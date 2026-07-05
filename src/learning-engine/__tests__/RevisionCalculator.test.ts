import { describe, expect, it } from "vitest";
import { RevisionCalculator } from "../calculators/RevisionCalculator";
import { event, state } from "./fixtures";

const HOUR = 3_600_000;

describe("RevisionCalculator", () => {
  it("schedules the minimum interval when mastery is 0", () => {
    const at = RevisionCalculator.computeRevisionAt(state(), 0, event());
    const delta = new Date(at).getTime() - new Date(event().timestamp).getTime();
    expect(delta / HOUR).toBeCloseTo(RevisionCalculator.MIN_HOURS, 5);
  });

  it("schedules a longer interval for higher mastery", () => {
    const low = RevisionCalculator.computeRevisionAt(state(), 0.2, event());
    const high = RevisionCalculator.computeRevisionAt(state(), 0.9, event());
    expect(new Date(high).getTime()).toBeGreaterThan(new Date(low).getTime());
  });

  it("shortens the interval after an incorrect answer", () => {
    const correct = RevisionCalculator.computeRevisionAt(state(), 0.8, event({ correct: true }));
    const wrong = RevisionCalculator.computeRevisionAt(state(), 0.8, event({ correct: false }));
    expect(new Date(wrong).getTime()).toBeLessThan(new Date(correct).getTime());
  });

  it("caps the interval at MAX_HOURS", () => {
    const at = RevisionCalculator.computeRevisionAt(state(), 1, event());
    const delta = new Date(at).getTime() - new Date(event().timestamp).getTime();
    expect(delta / HOUR).toBeLessThanOrEqual(RevisionCalculator.MAX_HOURS + 0.001);
  });

  it("treats missing revisionAt as due", () => {
    expect(RevisionCalculator.isDue(null, "2026-01-01T00:00:00.000Z")).toBe(true);
  });

  it("reports due when now is past revisionAt", () => {
    expect(
      RevisionCalculator.isDue("2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z"),
    ).toBe(true);
  });

  it("reports not due when now is before revisionAt", () => {
    expect(
      RevisionCalculator.isDue("2026-01-02T00:00:00.000Z", "2026-01-01T00:00:00.000Z"),
    ).toBe(false);
  });
});
