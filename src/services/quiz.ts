import { supabase } from "@/lib/supabase";
import {
  StudentStateEngine,
  type LearningEvent,
  type StudentConceptState,
} from "@/learning-engine";
import { StudentStateRepository } from "./StudentStateRepository";

export interface QuizSubmission {
  studentId: string;
  conceptId: string;
  questionId: string;
  selectedOption: string | null;
  correct: boolean;
  responseTimeMs: number;
  attemptNumber: number;
  hintUsed: boolean;
  difficulty?: string | null;
}

/**
 * Orchestrates the quiz submission pipeline:
 * 1. Save QuestionAttempt
 * 2. Load StudentConceptState
 * 3. Reduce with StudentStateEngine.updateStudentState(...)
 * 4. Save updated state
 * 5. Return updated state
 */
export async function submitQuizAnswer(
  input: QuizSubmission,
): Promise<StudentConceptState> {
  const timestamp = new Date().toISOString();

  // 1. Save the raw attempt
  const { error: attemptError } = await supabase
    .from("question_attempts")
    .insert({
      student_id: input.studentId,
      question_id: input.questionId,
      selected_option: input.selectedOption,
      correct: input.correct,
      response_time: Math.round(input.responseTimeMs),
      attempt_number: input.attemptNumber,
      hint_used: input.hintUsed,
    });
  if (attemptError) throw attemptError;

  // 2. Load existing state
  const prev = await StudentStateRepository.load(input.studentId, input.conceptId);

  // 3. Reduce (pure)
  const event: LearningEvent = {
    studentId: input.studentId,
    conceptId: input.conceptId,
    questionId: input.questionId,
    correct: input.correct,
    responseTimeMs: input.responseTimeMs,
    attemptNumber: input.attemptNumber,
    hintUsed: input.hintUsed,
    difficulty: input.difficulty ?? null,
    timestamp,
  };
  const next = StudentStateEngine.updateStudentState(prev, event);

  // 4. Persist
  await StudentStateRepository.save(next);

  // 5. Return
  return next;
}
