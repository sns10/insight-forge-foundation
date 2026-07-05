import { ConfidenceCalculator } from "../calculators/ConfidenceCalculator";
import { LearningGainCalculator } from "../calculators/LearningGainCalculator";
import { MasteryCalculator } from "../calculators/MasteryCalculator";
import { RevisionCalculator } from "../calculators/RevisionCalculator";
import type { LearningEvent } from "../models/LearningEvent";
import {
  initialConceptState,
  type StudentConceptState,
} from "../models/StudentConceptState";

/**
 * Pure reducer for the Learning Intelligence Engine.
 * Only exposes `updateStudentState`.
 */
export class StudentStateEngine {
  static updateStudentState(
    currentState: StudentConceptState | null,
    learningEvent: LearningEvent,
  ): StudentConceptState {
    const base =
      currentState ??
      initialConceptState(
        learningEvent.studentId,
        learningEvent.conceptId,
        learningEvent.timestamp,
      );

    const mastery = MasteryCalculator.compute(base, learningEvent);
    const confidence = ConfidenceCalculator.compute(base, learningEvent);
    const learningGain = LearningGainCalculator.compute(base, mastery);
    const revisionAt = RevisionCalculator.computeRevisionAt(
      base,
      mastery,
      learningEvent,
    );
    const revisionDue = RevisionCalculator.isDue(revisionAt, learningEvent.timestamp);

    return {
      studentId: learningEvent.studentId,
      conceptId: learningEvent.conceptId,
      mastery,
      confidence,
      learningGain,
      revisionAt,
      revisionDue,
      attempts: base.attempts + 1,
      correctAttempts: base.correctAttempts + (learningEvent.correct ? 1 : 0),
      lastAttemptAt: learningEvent.timestamp,
      updatedAt: learningEvent.timestamp,
    };
  }
}
