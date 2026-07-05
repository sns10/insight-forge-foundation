import type { StudentConceptState } from "../models/StudentConceptState";

export interface StepSnapshot {
  step: number;
  timestamp: string;
  correct: boolean;
  hintUsed: boolean;
  responseTimeMs: number;
  difficulty: string;
  mastery: number;
  confidence: number;
  learningGain: number;
  revisionAt: string | null;
  revisionScore: number;
}

export interface FinalMetrics {
  attempts: number;
  correctAttempts: number;
  accuracy: number;
  finalMastery: number;
  finalConfidence: number;
  averageLearningGain: number;
  totalLearningGain: number;
  averageResponseTimeMs: number;
  hintRate: number;
  finalRevisionAt: string | null;
  finalRevisionScore: number;
}

/**
 * Revision score = normalized urgency of scheduled revision.
 * 1.0 = due now (short interval), 0.0 = far in the future.
 * Uses hours-until-revision, clipped to [0, 14 days].
 */
export function revisionScore(
  revisionAt: string | null,
  now: string,
): number {
  if (!revisionAt) return 1;
  const diffMs = new Date(revisionAt).getTime() - new Date(now).getTime();
  const hours = Math.max(0, diffMs / 3_600_000);
  const MAX = 24 * 14;
  return Math.max(0, Math.min(1, 1 - hours / MAX));
}

export const Metrics = {
  revisionScore,

  summarize(snapshots: StepSnapshot[], finalState: StudentConceptState): FinalMetrics {
    const attempts = snapshots.length;
    const correct = snapshots.filter((s) => s.correct).length;
    const hints = snapshots.filter((s) => s.hintUsed).length;
    const rtSum = snapshots.reduce((a, s) => a + s.responseTimeMs, 0);
    const gainSum = snapshots.reduce((a, s) => a + s.learningGain, 0);

    return {
      attempts,
      correctAttempts: correct,
      accuracy: attempts ? correct / attempts : 0,
      finalMastery: finalState.mastery,
      finalConfidence: finalState.confidence,
      averageLearningGain: attempts ? gainSum / attempts : 0,
      totalLearningGain: gainSum,
      averageResponseTimeMs: attempts ? rtSum / attempts : 0,
      hintRate: attempts ? hints / attempts : 0,
      finalRevisionAt: finalState.revisionAt,
      finalRevisionScore: snapshots[snapshots.length - 1]?.revisionScore ?? 0,
    };
  },
};
