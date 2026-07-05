import { StudentStateEngine } from "../engine/StudentStateEngine";
import type { LearningEvent } from "../models/LearningEvent";
import type { StudentConceptState } from "../models/StudentConceptState";

export interface SimulatedStudentProfile {
  /** Baseline probability of answering correctly (0..1). */
  baseAccuracy: number;
  /** How much mastery boosts accuracy (0..1). */
  learningRate: number;
  /** Probability of using a hint (0..1). */
  hintProbability: number;
  /** Typical response time in ms for a confident answer. */
  baseResponseTimeMs: number;
  /** Random noise added to response time in ms. */
  responseTimeJitterMs: number;
}

export const defaultProfile: SimulatedStudentProfile = {
  baseAccuracy: 0.55,
  learningRate: 0.35,
  hintProbability: 0.15,
  baseResponseTimeMs: 7_000,
  responseTimeJitterMs: 4_000,
};

/** Deterministic mulberry32 PRNG for reproducible scenarios. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SimulatedAnswer {
  correct: boolean;
  responseTimeMs: number;
  hintUsed: boolean;
}

export class StudentSimulator {
  constructor(
    public readonly profile: SimulatedStudentProfile = defaultProfile,
    private readonly rng: () => number = Math.random,
  ) {}

  /** Simulate an answer given the student's current state and question difficulty. */
  answer(
    state: StudentConceptState,
    difficulty: "easy" | "medium" | "hard" = "medium",
  ): SimulatedAnswer {
    const difficultyMod =
      difficulty === "easy" ? 0.15 : difficulty === "hard" ? -0.2 : 0;
    const p =
      this.profile.baseAccuracy +
      this.profile.learningRate * state.mastery +
      difficultyMod;
    const prob = Math.max(0.02, Math.min(0.98, p));
    const correct = this.rng() < prob;

    const hintUsed = this.rng() < this.profile.hintProbability * (1 - state.confidence);

    const speedFactor = 1 - 0.5 * state.confidence;
    const responseTimeMs = Math.max(
      500,
      Math.round(
        this.profile.baseResponseTimeMs * speedFactor +
          (this.rng() - 0.5) * this.profile.responseTimeJitterMs,
      ),
    );

    return { correct, responseTimeMs, hintUsed };
  }

  /** Build a full LearningEvent by combining the simulated answer with metadata. */
  buildEvent(params: {
    studentId: string;
    conceptId: string;
    questionId: string;
    attemptNumber: number;
    difficulty: "easy" | "medium" | "hard";
    timestamp: string;
    answer: SimulatedAnswer;
  }): LearningEvent {
    return {
      studentId: params.studentId,
      conceptId: params.conceptId,
      questionId: params.questionId,
      correct: params.answer.correct,
      responseTimeMs: params.answer.responseTimeMs,
      attemptNumber: params.attemptNumber,
      hintUsed: params.answer.hintUsed,
      difficulty: params.difficulty,
      timestamp: params.timestamp,
    };
  }

  /** Convenience: run engine for a single event. */
  step(
    state: StudentConceptState | null,
    event: LearningEvent,
  ): StudentConceptState {
    return StudentStateEngine.updateStudentState(state, event);
  }
}
