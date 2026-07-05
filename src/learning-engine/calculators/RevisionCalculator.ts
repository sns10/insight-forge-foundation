import type { LearningEvent } from "../models/LearningEvent";
import type { StudentConceptState } from "../models/StudentConceptState";

/**
 * Spaced repetition: interval grows quadratically with mastery,
 * shrinks on an incorrect answer. Pure.
 */
export class RevisionCalculator {
  static readonly MIN_HOURS = 4;
  static readonly MAX_HOURS = 24 * 14;

  static computeRevisionAt(
    _prev: StudentConceptState,
    nextMastery: number,
    event: LearningEvent,
  ): string {
    const base = event.correct ? nextMastery : Math.max(0, nextMastery - 0.3);
    const hours =
      RevisionCalculator.MIN_HOURS +
      base * base * (RevisionCalculator.MAX_HOURS - RevisionCalculator.MIN_HOURS);
    const ts = new Date(event.timestamp).getTime() + hours * 3_600_000;
    return new Date(ts).toISOString();
  }

  static isDue(revisionAt: string | null, now: string): boolean {
    if (!revisionAt) return true;
    return new Date(revisionAt).getTime() <= new Date(now).getTime();
  }
}
