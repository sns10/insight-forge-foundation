import { ConfidenceCalculator } from "./ConfidenceCalculator";
import { LearningGainCalculator } from "./LearningGainCalculator";
import { MasteryCalculator } from "./MasteryCalculator";
import { RevisionCalculator } from "./RevisionCalculator";
import {
  initialConceptState,
  type LearningEvent,
  type StudentConceptState,
} from "./models";

/**
 * Pure reducer: (prevState, event) -> nextState.
 * No side effects; safe to unit test.
 */
export class StudentStateEngine {
  static update(
    prev: StudentConceptState | null,
    event: LearningEvent,
  ): StudentConceptState {
    const base =
      prev ?? initialConceptState(event.studentId, event.conceptId, event.timestamp);

    const mastery = MasteryCalculator.compute(base, event);
    const confidence = ConfidenceCalculator.compute(base, event);
    const learningGain = LearningGainCalculator.compute(base, mastery);
    const revisionAt = RevisionCalculator.computeRevisionAt(base, mastery, event);
    const revisionDue = RevisionCalculator.isDue(revisionAt, event.timestamp);

    return {
      studentId: event.studentId,
      conceptId: event.conceptId,
      mastery,
      confidence,
      learningGain,
      revisionAt,
      revisionDue,
      attempts: base.attempts + 1,
      correctAttempts: base.correctAttempts + (event.correct ? 1 : 0),
      lastAttemptAt: event.timestamp,
      updatedAt: event.timestamp,
    };
  }
}
