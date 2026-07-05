import type { LearningEvent, StudentConceptState } from "./models";

/**
 * Confidence rises with fast, correct, unhinted answers and
 * falls with slow or incorrect ones.
 */
export class ConfidenceCalculator {
  static readonly FAST_MS = 8_000;
  static readonly SLOW_MS = 30_000;
  static readonly ALPHA = 0.25;

  static compute(prev: StudentConceptState, event: LearningEvent): number {
    const speedScore = this.speedScore(event.responseTimeMs);
    const base = event.correct ? speedScore : -0.4;
    const hintAdj = event.hintUsed ? base * 0.5 : base;
    const target = clamp01(prev.confidence + hintAdj * 0.5);
    const next = (1 - this.ALPHA) * prev.confidence + this.ALPHA * target;
    return clamp01(next);
  }

  private static speedScore(ms: number): number {
    if (ms <= this.FAST_MS) return 1;
    if (ms >= this.SLOW_MS) return 0.2;
    const range = this.SLOW_MS - this.FAST_MS;
    return 1 - ((ms - this.FAST_MS) / range) * 0.8;
  }
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
