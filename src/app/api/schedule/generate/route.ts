import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { addDays, startOfWeek, format } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schedules = await prisma.schedule.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subjects = await prisma.subject.findMany({
    where: { userId: session.user.id },
    include: { topics: true },
  });

  if (subjects.length === 0) {
    return NextResponse.json({ error: "No subjects found" }, { status: 400 });
  }

  // Clear existing schedules
  await prisma.schedule.deleteMany({
    where: { userId: session.user.id },
  });

  // AI Logic Simulation (Simple Algorithm for now)
  // In a real app, you would send subjects and topics to OpenAI/Gemini
  // and get an optimized schedule.
  
  const schedulesToCreate: any[] = [];
  const days = [0, 1, 2, 3, 4, 5, 6]; // Sun to Sat
  const studyHours = [
    { start: "08:00", end: "09:00" },
    { start: "10:00", end: "11:00" },
    { start: "14:00", end: "15:00" },
    { start: "19:00", end: "20:00" },
  ];

  let subjectIdx = 0;
  for (const day of days) {
    for (const slot of studyHours) {
      const subject = subjects[subjectIdx % subjects.length];
      const topic = subject.topics[Math.floor(Math.random() * subject.topics.length)];
      
      schedulesToCreate.push({
        userId: session.user.id,
        dayOfWeek: day,
        startTime: slot.start,
        endTime: slot.end,
        taskName: `${subject.name}: ${topic?.name || 'General Study'}`,
      });
      
      subjectIdx++;
    }
  }

  await prisma.schedule.createMany({
    data: schedulesToCreate,
  });

  return NextResponse.json({ message: "Schedule generated successfully", schedules: schedulesToCreate });
}
