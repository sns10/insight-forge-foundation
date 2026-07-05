import { supabase } from "@/lib/supabase";
import type { StudentConceptState } from "@/learning-engine";

/**
 * I/O boundary for StudentConceptState.
 * The learning-engine module stays pure; this file owns all Supabase calls.
 */
export class StudentStateRepository {
  static async load(
    studentId: string,
    conceptId: string,
  ): Promise<StudentConceptState | null> {
    const { data, error } = await supabase
      .from("student_concept_state")
      .select("*")
      .eq("student_id", studentId)
      .eq("concept_id", conceptId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      studentId: data.student_id,
      conceptId: data.concept_id,
      mastery: data.mastery,
      confidence: data.confidence,
      learningGain: data.learning_gain,
      revisionDue: data.revision_due,
      revisionAt: data.revision_at,
      attempts: data.attempts,
      correctAttempts: data.correct_attempts,
      lastAttemptAt: data.last_attempt_at,
      updatedAt: data.updated_at,
    };
  }

  static async save(state: StudentConceptState): Promise<StudentConceptState> {
    const { error } = await supabase.from("student_concept_state").upsert(
      [
        {
          student_id: state.studentId,
          concept_id: state.conceptId,
          mastery: state.mastery,
          confidence: state.confidence,
          learning_gain: state.learningGain,
          revision_due: state.revisionDue,
          revision_at: state.revisionAt,
          attempts: state.attempts,
          correct_attempts: state.correctAttempts,
          last_attempt_at: state.lastAttemptAt,
          updated_at: state.updatedAt,
        },
      ],
      { onConflict: "student_id,concept_id" },
    );

    if (error) throw error;
    return state;
  }
}
