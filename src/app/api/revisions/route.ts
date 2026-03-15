import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { format, isPast, startOfDay, endOfDay } from "date-fns";
import { processRevisionScore } from "@backend/lib/srs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revisions = await prisma.revision.findMany({
    where: { userId: session.user.id },
    include: { topic: { include: { subject: true } } },
    orderBy: { scheduledAt: 'asc' },
  });

  const formattedRevisions = revisions.map(rev => {
    let status = "Scheduled";
    let color = "text-indigo-500";
    let bg = "bg-indigo-50 dark:bg-indigo-900/20";

    if (rev.completedAt) {
      status = "Completed";
      color = "text-emerald-500";
      bg = "bg-emerald-50 dark:bg-emerald-900/20";
    } else if (isPast(rev.scheduledAt) && format(rev.scheduledAt, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")) {
      status = "Overdue";
      color = "text-rose-500";
      bg = "bg-rose-50 dark:bg-rose-900/20";
    } else if (format(rev.scheduledAt, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
      status = "Due Today";
      color = "text-amber-500";
      bg = "bg-amber-50 dark:bg-amber-900/20";
    }

    return {
      id: rev.id,
      topic: rev.topic.name,
      subject: rev.topic.subject.name,
      lastStudied: format(rev.scheduledAt, "yyyy-MM-dd"),
      status,
      color,
      bg,
      repetition: rev.repetition,
      easeFactor: rev.easeFactor
    };
  });

  return NextResponse.json(formattedRevisions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { revisionId, quality } = await req.json();

  if (!revisionId || quality === undefined || quality < 1 || quality > 5) {
    return NextResponse.json({ error: "Invalid data. Quality must be between 1 and 5." }, { status: 400 });
  }

  try {
    const result = await processRevisionScore(revisionId, quality);
    return NextResponse.json({ success: true, nextReview: result.nextReviewDate, intervalDays: result.interval });
  } catch (error: any) {
    console.error("Error processing revision score:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

