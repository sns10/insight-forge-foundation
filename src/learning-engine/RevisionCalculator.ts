import type { LearningEvent, StudentConceptState } from "./models";

/**
 * Spaced repetition: interval grows with mastery, shrinks on error.
 */
export class RevisionCalculator {
  static readonly MIN_HOURS = 4;
  static readonly MAX_HOURS = 24 * 14;

  static computeRevisionAt(
    prev: StudentConceptState,
    nextMastery: number,
    event: LearningEvent,
  ): string {
    const base = event.correct ? nextMastery : Math.max(0, nextMastery - 0.3);
    const hours =
      this.MIN_HOURS + base * base * (this.MAX_HOURS - this.MIN_HOURS);
    const ts = new Date(event.timestamp).getTime() + hours * 3_600_000;
    return new Date(ts).toISOString();
  }

  static isDue(revisionAt: string | null, now: string): boolean {
    if (!revisionAt) return true;
    return new Date(revisionAt).getTime() <= new Date(now).getTime();
  }
}
