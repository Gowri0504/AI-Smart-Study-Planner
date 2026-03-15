import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { subDays, format, startOfDay } from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get data for the last 365 days
  const endDate = new Date();
  const startDate = subDays(startOfDay(endDate), 365);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId: session.user.id,
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      startTime: true,
      duration: true, // in minutes
    },
  });

  // Aggregate by date (YYYY-MM-DD)
  const activityMap: Record<string, number> = {};
  
  sessions.forEach(s => {
    const dateStr = format(s.startTime, "yyyy-MM-dd");
    if (!activityMap[dateStr]) {
      activityMap[dateStr] = 0;
    }
    activityMap[dateStr] += (s.duration || 30); // Default to 30 mins if null
  });

  // Convert map to array { date, count }
  const heatmapData = Object.keys(activityMap).map(date => ({
    date,
    count: Math.round(activityMap[date] / 60) // convert to hours for visualization weighing
  }));

  // Ensure today is always in the map even if 0
  const todayStr = format(endDate, "yyyy-MM-dd");
  if (!activityMap[todayStr]) {
    heatmapData.push({ date: todayStr, count: 0 });
  }

  return NextResponse.json(heatmapData);
}
