// Pure domain models for the Learning Engine.
// No React, no Supabase, no I/O.

export interface LearningEvent {
  studentId: string;
  conceptId: string;
  questionId: string;
  correct: boolean;
  responseTimeMs: number;
  attemptNumber: number;
  hintUsed: boolean;
  difficulty?: "easy" | "medium" | "hard" | string | null;
  timestamp: string; // ISO
}

export interface StudentConceptState {
  studentId: string;
  conceptId: string;
  mastery: number;      // 0..1
  confidence: number;   // 0..1
  learningGain: number; // delta from last update, -1..1
  revisionDue: boolean;
  revisionAt: string | null; // ISO
  attempts: number;
  correctAttempts: number;
  lastAttemptAt: string | null;
  updatedAt: string;
}

export function initialConceptState(
  studentId: string,
  conceptId: string,
  now: string = new Date().toISOString(),
): StudentConceptState {
  return {
    studentId,
    conceptId,
    mastery: 0,
    confidence: 0,
    learningGain: 0,
    revisionDue: false,
    revisionAt: null,
    attempts: 0,
    correctAttempts: 0,
    lastAttemptAt: null,
    updatedAt: now,
  };
}
