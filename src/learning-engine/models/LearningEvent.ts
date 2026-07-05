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
