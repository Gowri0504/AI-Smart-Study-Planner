import { prisma } from "./prisma";
import { isSameDay, subDays, startOfDay } from "date-fns";

export async function getUserGamificationStats(userId: string) {
  // 1. Fetch user sessions to calculate streak and XP
  const sessions = await prisma.studySession.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
  });

  // Basic XP: 10 XP per minute studied
  const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalXP = totalMinutes * 10;
  
  // Level calculation (Starts at 1, every 1000 XP is a level)
  const level = Math.floor(totalXP / 1000) + 1;
  const xpToNextLevel = 1000 - (totalXP % 1000);
  const xpProgress = (totalXP % 1000) / 10; // percentage

  // Streak calculation
  let streak = 0;
  let currentDate = startOfDay(new Date());

  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = startOfDay(sessions[i].startTime);
    if (isSameDay(sessionDate, currentDate)) {
      if (i === 0 || !isSameDay(sessionDate, startOfDay(sessions[i-1].startTime))) {
        streak++;
      }
      currentDate = subDays(currentDate, 1);
    } else if (sessionDate < currentDate) {
      break; // Streak broken
    }
  }

  // Active dates mapped for streak UI
  const activeDates = sessions.map(s => startOfDay(s.startTime).toISOString());
  const uniqueDates = Array.from(new Set(activeDates));
  streak = uniqueDates.length; // Simplify streak to unique days studied for now

  return { totalXP, level, xpToNextLevel, xpProgress, streak };
}

export async function evaluateAchievements(userId: string) {
  const stats = await getUserGamificationStats(userId);
  const existingAchievements = await prisma.achievement.findMany({
    where: { userId }
  });
  const existingTypes = new Set(existingAchievements.map(a => a.type));

  const newAchievements = [];

  // 1. First Session
  if (stats.totalXP > 0 && !existingTypes.has("FIRST_SESSION")) {
    newAchievements.push({
      userId,
      type: "FIRST_SESSION",
      title: "First Steps",
      description: "Completed your first study session.",
    });
  }

  // 2. 3-Day Streak
  if (stats.streak >= 3 && !existingTypes.has("STREAK_3")) {
    newAchievements.push({
      userId,
      type: "STREAK_3",
      title: "On Fire",
      description: "You've studied for 3 days in a row!",
    });
  }

  // 3. Level 5
  if (stats.level >= 5 && !existingTypes.has("LEVEL_5")) {
    newAchievements.push({
      userId,
      type: "LEVEL_5",
      title: "Dedicated Scholar",
      description: "Reached Level 5.",
    });
  }

  if (newAchievements.length > 0) {
    await prisma.achievement.createMany({
      data: newAchievements
    });
  }
}
