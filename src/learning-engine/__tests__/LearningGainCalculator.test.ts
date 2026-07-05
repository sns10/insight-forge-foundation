import { describe, expect, it } from "vitest";
import { LearningGainCalculator } from "../calculators/LearningGainCalculator";
import { state } from "./fixtures";

describe("LearningGainCalculator", () => {
  it("is positive when mastery increases", () => {
    expect(LearningGainCalculator.compute(state({ mastery: 0.2 }), 0.5)).toBeCloseTo(0.3);
  });

  it("is negative when mastery decreases", () => {
    expect(LearningGainCalculator.compute(state({ mastery: 0.7 }), 0.4)).toBeCloseTo(-0.3);
  });

  it("is zero when mastery is unchanged", () => {
    expect(LearningGainCalculator.compute(state({ mastery: 0.5 }), 0.5)).toBe(0);
  });

  it("is clamped to [-1, 1]", () => {
    expect(LearningGainCalculator.compute(state({ mastery: 0 }), 5)).toBe(1);
    expect(LearningGainCalculator.compute(state({ mastery: 1 }), -5)).toBe(-1);
  });
});
