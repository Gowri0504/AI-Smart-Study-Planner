import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { subDays, format, startOfDay } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Calculate weekly study hours from real sessions
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, "EEE");
  });

  const sessions = await prisma.studySession.findMany({
    where: {
      userId: session.user.id,
      startTime: {
        gte: startOfDay(subDays(new Date(), 7)),
      },
    },
  });

  const studyData = last7Days.map((day) => {
    const daySessions = sessions.filter(s => format(s.startTime, "EEE") === day);
    const totalMinutes = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    return {
      day,
      hours: parseFloat((totalMinutes / 60).toFixed(1)),
    };
  });

  // 2. Subject progress
  const subjects = await prisma.subject.findMany({
    where: { userId: session.user.id },
    include: { topics: true },
  });

  const subjectStats = subjects.map((s, idx) => {
    const completedTopics = s.topics.filter(t => t.completed).length;
    const totalTopics = s.topics.length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    return {
      name: s.name,
      progress,
      color: colors[idx % colors.length],
    };
  });

  // 3. Summary stats
  const totalCompletedTasks = await prisma.task.count({
    where: { userId: session.user.id, completed: true },
  });

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);

  return NextResponse.json({
    studyData,
    subjectStats,
    summary: {
      completedTasks: totalCompletedTasks,
      studyHours: `${parseFloat((totalStudyMinutes / 60).toFixed(1))}h`,
      streak: "5 Days", // For real streak, would need more complex query
      productivity: "82%",
    }
  });
}
