import type { LearningEvent } from "../models/LearningEvent";
import type { StudentConceptState } from "../models/StudentConceptState";
import { clamp01 } from "./utils";

/**
 * Exponential moving average of correctness, weighted by difficulty
 * and penalized by hint usage. Pure.
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
    const weight = MasteryCalculator.difficultyWeight(event.difficulty);
    const hintPenalty = event.hintUsed ? 0.5 : 1;
    const signal = event.correct ? weight * hintPenalty : 0;
    const next = (1 - MasteryCalculator.ALPHA) * prev.mastery + MasteryCalculator.ALPHA * signal;
    return clamp01(next);
  }
}
