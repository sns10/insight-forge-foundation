import type { LearningEvent, StudentConceptState } from "./models";

/**
 * Exponential moving average of correctness, weighted by difficulty
 * and penalized by hint usage.
 */
export class MasteryCalculator {
  static readonly ALPHA = 0.3;

  static difficultyWeight(difficulty?: string | null): number {
    switch (difficulty) {
      case "easy":
        return 0.7;
      case "hard":
        return 1.3;
      case "medium":
      default:
        return 1.0;
    }
  }

  static compute(prev: StudentConceptState, event: LearningEvent): number {
    const weight = this.difficultyWeight(event.difficulty);
    const hintPenalty = event.hintUsed ? 0.5 : 1;
    const signal = event.correct ? 1 * weight * hintPenalty : 0;
    const next = (1 - this.ALPHA) * prev.mastery + this.ALPHA * signal;
    return clamp01(next);
  }
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
