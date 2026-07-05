import type { SimulatedStudentProfile } from "./StudentSimulator";

export type Difficulty = "easy" | "medium" | "hard";

export interface ScenarioStep {
  difficulty: Difficulty;
  /** Minutes elapsed since scenario start for this attempt. */
  offsetMinutes: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  studentId: string;
  conceptId: string;
  profile: SimulatedStudentProfile;
  seed: number;
  steps: ScenarioStep[];
}

function repeat(count: number, difficulty: Difficulty, everyMin = 5): ScenarioStep[] {
  return Array.from({ length: count }, (_, i) => ({
    difficulty,
    offsetMinutes: i * everyMin,
  }));
}

export const ScenarioLibrary = {
  list(): Scenario[] {
    return [
      {
        id: "fast-learner",
        name: "Fast learner",
        description: "High baseline accuracy, quick answers, minimal hints.",
        studentId: "sim-student-fast",
        conceptId: "concept-1",
        seed: 1,
        profile: {
          baseAccuracy: 0.75,
          learningRate: 0.25,
          hintProbability: 0.05,
          baseResponseTimeMs: 5_000,
          responseTimeJitterMs: 2_000,
        },
        steps: repeat(20, "medium"),
      },
      {
        id: "struggling-student",
        name: "Struggling student",
        description: "Low accuracy, frequent hints, slow answers on hard problems.",
        studentId: "sim-student-struggle",
        conceptId: "concept-1",
        seed: 2,
        profile: {
          baseAccuracy: 0.35,
          learningRate: 0.2,
          hintProbability: 0.5,
          baseResponseTimeMs: 15_000,
          responseTimeJitterMs: 8_000,
        },
        steps: [
          ...repeat(10, "medium"),
          ...repeat(10, "hard", 6).map((s, i) => ({ ...s, offsetMinutes: 50 + i * 6 })),
        ],
      },
      {
        id: "steady-improver",
        name: "Steady improver",
        description: "Average student progressing through mixed difficulty.",
        studentId: "sim-student-steady",
        conceptId: "concept-1",
        seed: 3,
        profile: {
          baseAccuracy: 0.55,
          learningRate: 0.35,
          hintProbability: 0.15,
          baseResponseTimeMs: 8_000,
          responseTimeJitterMs: 4_000,
        },
        steps: [
          ...repeat(6, "easy"),
          ...repeat(8, "medium", 5).map((s, i) => ({ ...s, offsetMinutes: 30 + i * 5 })),
          ...repeat(6, "hard", 6).map((s, i) => ({ ...s, offsetMinutes: 70 + i * 6 })),
        ],
      },
      {
        id: "forgetful-student",
        name: "Forgetful student",
        description: "Learns then regresses; tests revision scheduling.",
        studentId: "sim-student-forget",
        conceptId: "concept-1",
        seed: 4,
        profile: {
          baseAccuracy: 0.6,
          learningRate: 0.15,
          hintProbability: 0.25,
          baseResponseTimeMs: 10_000,
          responseTimeJitterMs: 6_000,
        },
        steps: [
          ...repeat(10, "medium"),
          // long gap then hard revisions
          ...repeat(8, "hard", 10).map((s, i) => ({
            ...s,
            offsetMinutes: 60 * 24 + i * 10,
          })),
        ],
      },
    ];
  },

  byId(id: string): Scenario | undefined {
    return ScenarioLibrary.list().find((s) => s.id === id);
  },
};
