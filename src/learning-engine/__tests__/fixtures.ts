import type { LearningEvent } from "../models/LearningEvent";
import type { StudentConceptState } from "../models/StudentConceptState";
import { initialConceptState } from "../models/StudentConceptState";

export function state(
  overrides: Partial<StudentConceptState> = {},
): StudentConceptState {
  return { ...initialConceptState("student-1", "concept-1", "2026-01-01T00:00:00.000Z"), ...overrides };
}

export function event(overrides: Partial<LearningEvent> = {}): LearningEvent {
  return {
    studentId: "student-1",
    conceptId: "concept-1",
    questionId: "question-1",
    correct: true,
    responseTimeMs: 5_000,
    attemptNumber: 1,
    hintUsed: false,
    difficulty: "medium",
    timestamp: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
