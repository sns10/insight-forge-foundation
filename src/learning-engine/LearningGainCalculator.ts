import type { StudentConceptState } from "./models";

/**
 * Learning gain = change in mastery from prior state to next state.
 */
export class LearningGainCalculator {
  static compute(prev: StudentConceptState, nextMastery: number): number {
    const gain = nextMastery - prev.mastery;
    if (Number.isNaN(gain)) return 0;
    return Math.max(-1, Math.min(1, gain));
  }
}
