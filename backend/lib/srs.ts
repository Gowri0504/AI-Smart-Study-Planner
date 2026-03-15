import { addDays, startOfDay } from "date-fns";
import { prisma } from "./prisma";

// SM-2 Algorithm Implementation
// Quality (0-5 rating from user):
// 0 = Complete blackout.
// 1 = Incorrect response; remembered correct after seeing it.
// 2 = Incorrect response; recalled after effort.
// 3 = Correct response recalled with serious difficulty.
// 4 = Correct response after hesitation.
// 5 = Perfect response.

export function calculateSM2(
  quality: number,
  repetitions: number,
  previousInterval: number,
  previousEaseFactor: number
) {
  let newRepetitions = repetitions;
  let newInterval = previousInterval;
  let newEaseFactor = previousEaseFactor;

  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * previousEaseFactor);
    }
    newRepetitions++;
  } else {
    // If quality < 3, the card is failed. Re-learn it.
    newRepetitions = 0;
    newInterval = 1;
  }

  // Update ease factor
  newEaseFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor shouldn't fall below 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  return {
    interval: newInterval,
    repetition: newRepetitions,
    easeFactor: newEaseFactor
  };
}

export async function processRevisionScore(revisionId: string, quality: number) {
  const revision = await prisma.revision.findUnique({
    where: { id: revisionId }
  });

  if (!revision) throw new Error("Revision not found");

  const { interval, repetition, easeFactor } = calculateSM2(
    quality,
    revision.repetition,
    revision.interval,
    revision.easeFactor
  );

  const nextReviewDate = addDays(startOfDay(new Date()), interval);

  // Update the current revision to completed
  await prisma.revision.update({
    where: { id: revisionId },
    data: {
      completedAt: new Date()
    }
  });

  // Schedule the next revision
  await prisma.revision.create({
    data: {
      topicId: revision.topicId,
      userId: revision.userId,
      scheduledAt: nextReviewDate,
      interval,
      repetition,
      easeFactor
    }
  });

  return { nextReviewDate, interval };
}
