import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { getUserGamificationStats, evaluateAchievements } from "@backend/lib/gamification";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Evaluate new achievements before fetching
  await evaluateAchievements(userId);

  // 1. Fetch user achievements
  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { unlockedAt: 'desc' },
  });

  // 2. Calculate real stats
  const stats = await getUserGamificationStats(userId);

  // 3. Fetch leaderboard (top users by total study duration / XP approximation)
  // For simplicity, we rank by number of sessions or just user creation date.
  // Ideally, total XP should be on the User model.
  const leaderboardUsers = await prisma.user.findMany({
    take: 10,
    include: {
      sessions_data: true
    }
  });

  const formattedLeaderboard = leaderboardUsers.map((user) => {
    const totalMins = user.sessions_data.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    return {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || "Unknown",
      xp: totalMins * 10,
      streak: 0, // Simplified for global leaderboard
      isUser: user.id === userId
    };
  }).sort((a, b) => b.xp - a.xp).map((u, idx) => ({...u, rank: idx + 1})).slice(0, 5);

  return NextResponse.json({
    achievements: achievements.map(ach => ({
      id: ach.id,
      title: ach.title,
      description: ach.description,
      type: ach.type,
      unlocked: true,
      date: format(ach.unlockedAt, "yyyy-MM-dd")
    })),
    stats: {
      level: stats.level,
      totalXP: stats.totalXP,
      xpToNextLevel: stats.xpToNextLevel,
      xpProgress: stats.xpProgress,
      badgesCount: achievements.length,
      streak: stats.streak
    },
    leaderboard: formattedLeaderboard
  });
}
