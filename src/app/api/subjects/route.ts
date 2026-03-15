import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subjects = await prisma.subject.findMany({
    where: { userId: session.user.id },
    include: { topics: true },
  });

  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, difficulty, topics } = await req.json();

  const subject = await prisma.subject.create({
    data: {
      name,
      difficulty: parseInt(difficulty),
      userId: session.user.id,
      topics: {
        create: topics.map((topicName: string) => ({
          name: topicName,
        })),
      },
    },
    include: { topics: true },
  });

  return NextResponse.json(subject);
}
