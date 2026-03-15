import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { calculateBurnoutRisk } from "@backend/lib/burnout";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Today's schedule
  const today = new Date().getDay();
  const schedule = await prisma.schedule.findMany({
    where: { userId, dayOfWeek: today },
    take: 3,
    orderBy: { startTime: 'asc' },
  });

  // 2. Progress summary
  const subjects = await prisma.subject.findMany({
    where: { userId },
    include: { topics: true },
  });

  let totalTopics = 0;
  let completedTopics = 0;
  subjects.forEach(s => {
    totalTopics += s.topics.length;
    completedTopics += s.topics.filter(t => t.completed).length;
  });

  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // 3. AI Insight (Randomized based on data)
  const insights = [
    `You've mastered ${completedTopics} topics so far. Keep it up!`,
    "Try studying in 45-minute blocks for better retention.",
    "Your focus sessions are most productive in the morning.",
    "Revision is due for some of your earlier topics."
  ];

  // 4. Burnout Score
  const burnoutData = await calculateBurnoutRisk(userId);

  return NextResponse.json({
    schedule: schedule.map(s => ({
      time: s.startTime,
      task: s.taskName
    })),
    progress,
    insight: insights[Math.floor(Math.random() * insights.length)],
    burnout: burnoutData
  });
}
