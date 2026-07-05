import { StudentStateEngine } from "../engine/StudentStateEngine";
import { initialConceptState, type StudentConceptState } from "../models/StudentConceptState";
import { Metrics, revisionScore, type FinalMetrics, type StepSnapshot } from "./Metrics";
import type { Scenario } from "./ScenarioLibrary";
import { createRng, StudentSimulator } from "./StudentSimulator";

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  studentId: string;
  conceptId: string;
  masteryHistory: number[];
  confidenceHistory: number[];
  revisionScoreHistory: number[];
  snapshots: StepSnapshot[];
  finalState: StudentConceptState;
  finalMetrics: FinalMetrics;
}

const START = new Date("2026-01-01T00:00:00.000Z").getTime();

export class ScenarioRunner {
  static run(scenario: Scenario): ScenarioResult {
    const rng = createRng(scenario.seed);
    const simulator = new StudentSimulator(scenario.profile, rng);

    let state: StudentConceptState = initialConceptState(
      scenario.studentId,
      scenario.conceptId,
      new Date(START).toISOString(),
    );

    const snapshots: StepSnapshot[] = [];
    const masteryHistory: number[] = [];
    const confidenceHistory: number[] = [];
    const revisionScoreHistory: number[] = [];

    scenario.steps.forEach((step, i) => {
      const timestamp = new Date(START + step.offsetMinutes * 60_000).toISOString();
      const answer = simulator.answer(state, step.difficulty);
      const event = simulator.buildEvent({
        studentId: scenario.studentId,
        conceptId: scenario.conceptId,
        questionId: `${scenario.id}-q${i + 1}`,
        attemptNumber: i + 1,
        difficulty: step.difficulty,
        timestamp,
        answer,
      });

      state = StudentStateEngine.updateStudentState(state, event);
      const rScore = revisionScore(state.revisionAt, timestamp);

      snapshots.push({
        step: i + 1,
        timestamp,
        correct: event.correct,
        hintUsed: event.hintUsed,
        responseTimeMs: event.responseTimeMs,
        difficulty: step.difficulty,
        mastery: state.mastery,
        confidence: state.confidence,
        learningGain: state.learningGain,
        revisionAt: state.revisionAt,
        revisionScore: rScore,
      });
      masteryHistory.push(state.mastery);
      confidenceHistory.push(state.confidence);
      revisionScoreHistory.push(rScore);
    });

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      studentId: scenario.studentId,
      conceptId: scenario.conceptId,
      masteryHistory,
      confidenceHistory,
      revisionScoreHistory,
      snapshots,
      finalState: state,
      finalMetrics: Metrics.summarize(snapshots, state),
    };
  }

  static runAll(scenarios: Scenario[]): ScenarioResult[] {
    return scenarios.map((s) => ScenarioRunner.run(s));
  }
}
