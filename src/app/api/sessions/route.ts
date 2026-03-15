import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { duration, focusScore } = await req.json();

  const studySession = await prisma.studySession.create({
    data: {
      userId: session.user.id,
      duration,
      focusScore,
      endTime: new Date(),
    },
  });

  return NextResponse.json(studySession);
}
