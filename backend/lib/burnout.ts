import { prisma } from "./prisma";
import { startOfDay, subDays } from "date-fns";

export async function calculateBurnoutRisk(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { studyHours: true }
  });

  const recommendedDailyMinutes = (user?.studyHours || 2) * 60; // Default 2 hours

  // Analyze the last 7 days of study sessions
  const sevenDaysAgo = subDays(startOfDay(new Date()), 7);
  
  const recentSessions = await prisma.studySession.findMany({
    where: {
      userId,
      startTime: {
        gte: sevenDaysAgo
      }
    }
  });

  if (recentSessions.length === 0) {
    return {
      riskLevel: "Low",
      riskPercentage: 10,
      message: "You haven't studied much recently. Great time to start building momentum!"
    };
  }

  // Calculate daily totals for the last 7 days
  const dailyTotals = new Map<string, number>();
  
  recentSessions.forEach(session => {
    const dateStr = startOfDay(session.startTime).toISOString();
    const current = dailyTotals.get(dateStr) || 0;
    dailyTotals.set(dateStr, current + (session.duration || 0));
  });

  let warningDays = 0;
  let totalStudiedMinutes = 0;

  dailyTotals.forEach(minutes => {
    totalStudiedMinutes += minutes;
    // If studied more than 150% of recommended hours
    if (minutes > recommendedDailyMinutes * 1.5) {
      warningDays++;
    }
  });

  const averageDailyMinutes = totalStudiedMinutes / 7;
  let riskPercentage = (averageDailyMinutes / recommendedDailyMinutes) * 50; // Base risk on average
  
  // Exponentially increase risk for consecutive heavy days
  riskPercentage += (warningDays * 15);

  // Cap at 100
  riskPercentage = Math.min(Math.round(riskPercentage), 100);

  let riskLevel = "Low";
  let message = "Your study pace is healthy. Keep it up!";

  if (riskPercentage > 80) {
    riskLevel = "High";
    message = "⚠️ Burnout Alert! You've been overexerting yourself. Please schedule a rest day.";
  } else if (riskPercentage > 50) {
    riskLevel = "Medium";
    message = "You're pushing hard. Make sure to take adequate breaks and stay hydrated.";
  }

  return { riskLevel, riskPercentage, message };
}
