import type { ScenarioResult } from "./ScenarioRunner";

export interface SimulationReport {
  generatedAt: string;
  scenarioCount: number;
  scenarios: ScenarioResult[];
  aggregate: {
    averageFinalMastery: number;
    averageFinalConfidence: number;
    averageAccuracy: number;
    averageHintRate: number;
  };
}

export const ReportGenerator = {
  build(results: ScenarioResult[]): SimulationReport {
    const n = results.length || 1;
    const sum = results.reduce(
      (acc, r) => {
        acc.mastery += r.finalMetrics.finalMastery;
        acc.confidence += r.finalMetrics.finalConfidence;
        acc.accuracy += r.finalMetrics.accuracy;
        acc.hintRate += r.finalMetrics.hintRate;
        return acc;
      },
      { mastery: 0, confidence: 0, accuracy: 0, hintRate: 0 },
    );

    return {
      generatedAt: new Date().toISOString(),
      scenarioCount: results.length,
      scenarios: results,
      aggregate: {
        averageFinalMastery: sum.mastery / n,
        averageFinalConfidence: sum.confidence / n,
        averageAccuracy: sum.accuracy / n,
        averageHintRate: sum.hintRate / n,
      },
    };
  },

  toJSON(results: ScenarioResult[], pretty = true): string {
    const report = ReportGenerator.build(results);
    return pretty ? JSON.stringify(report, null, 2) : JSON.stringify(report);
  },
};
