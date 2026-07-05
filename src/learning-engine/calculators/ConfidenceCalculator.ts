import type { LearningEvent } from "../models/LearningEvent";
import type { StudentConceptState } from "../models/StudentConceptState";
import { clamp01 } from "./utils";

/**
 * Confidence rises with fast, correct, unhinted answers and
 * falls with slow or incorrect ones. Pure.
 */
export class ConfidenceCalculator {
  static readonly FAST_MS = 8_000;
  static readonly SLOW_MS = 30_000;
  static readonly ALPHA = 0.25;

  static speedScore(ms: number): number {
    if (ms <= ConfidenceCalculator.FAST_MS) return 1;
    if (ms >= ConfidenceCalculator.SLOW_MS) return 0.2;
    const range = ConfidenceCalculator.SLOW_MS - ConfidenceCalculator.FAST_MS;
    return 1 - ((ms - ConfidenceCalculator.FAST_MS) / range) * 0.8;
  }

  static compute(prev: StudentConceptState, event: LearningEvent): number {
    const speed = ConfidenceCalculator.speedScore(event.responseTimeMs);
    const base = event.correct ? speed : -0.4;
    const hintAdj = event.hintUsed ? base * 0.5 : base;
    const target = clamp01(prev.confidence + hintAdj * 0.5);
    const next =
      (1 - ConfidenceCalculator.ALPHA) * prev.confidence +
      ConfidenceCalculator.ALPHA * target;
    return clamp01(next);
  }
}
