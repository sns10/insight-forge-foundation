import { describe, expect, it } from "vitest";
import { MasteryCalculator } from "../calculators/MasteryCalculator";
import { event, state } from "./fixtures";

describe("MasteryCalculator", () => {
  it("returns 0 for a wrong first answer", () => {
    const m = MasteryCalculator.compute(state(), event({ correct: false }));
    expect(m).toBe(0);
  });

  it("increases mastery after a correct answer", () => {
    const m = MasteryCalculator.compute(state({ mastery: 0.5 }), event());
    expect(m).toBeGreaterThan(0.5);
  });

  it("decays mastery on a wrong answer", () => {
    const m = MasteryCalculator.compute(state({ mastery: 0.8 }), event({ correct: false }));
    expect(m).toBeLessThan(0.8);
  });

  it("weights hard questions higher than easy ones", () => {
    const hard = MasteryCalculator.compute(state(), event({ difficulty: "hard" }));
    const easy = MasteryCalculator.compute(state(), event({ difficulty: "easy" }));
    expect(hard).toBeGreaterThan(easy);
  });

  it("penalizes hint usage", () => {
    const noHint = MasteryCalculator.compute(state(), event({ hintUsed: false }));
    const withHint = MasteryCalculator.compute(state(), event({ hintUsed: true }));
    expect(noHint).toBeGreaterThan(withHint);
  });

  it("stays within [0, 1]", () => {
    for (const s of [0, 0.5, 1]) {
      const m = MasteryCalculator.compute(state({ mastery: s }), event());
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(1);
    }
  });
});
