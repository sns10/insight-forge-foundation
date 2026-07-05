import { describe, expect, it } from "vitest";
import { ConfidenceCalculator } from "../calculators/ConfidenceCalculator";
import { event, state } from "./fixtures";

describe("ConfidenceCalculator", () => {
  it("rises on a fast, correct, unhinted answer", () => {
    const c = ConfidenceCalculator.compute(
      state({ confidence: 0.2 }),
      event({ correct: true, responseTimeMs: 3_000 }),
    );
    expect(c).toBeGreaterThan(0.2);
  });

  it("falls on a wrong answer", () => {
    const c = ConfidenceCalculator.compute(
      state({ confidence: 0.6 }),
      event({ correct: false }),
    );
    expect(c).toBeLessThan(0.6);
  });

  it("gives lower confidence for slower answers", () => {
    const fast = ConfidenceCalculator.compute(state(), event({ responseTimeMs: 2_000 }));
    const slow = ConfidenceCalculator.compute(state(), event({ responseTimeMs: 40_000 }));
    expect(fast).toBeGreaterThan(slow);
  });

  it("dampens gains when a hint was used", () => {
    const noHint = ConfidenceCalculator.compute(state(), event({ hintUsed: false }));
    const withHint = ConfidenceCalculator.compute(state(), event({ hintUsed: true }));
    expect(noHint).toBeGreaterThan(withHint);
  });

  it("stays within [0, 1]", () => {
    const c = ConfidenceCalculator.compute(
      state({ confidence: 1 }),
      event({ correct: true, responseTimeMs: 1_000 }),
    );
    expect(c).toBeLessThanOrEqual(1);
    const c2 = ConfidenceCalculator.compute(
      state({ confidence: 0 }),
      event({ correct: false }),
    );
    expect(c2).toBeGreaterThanOrEqual(0);
  });
});
