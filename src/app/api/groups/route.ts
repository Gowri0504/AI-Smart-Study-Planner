import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groups = await prisma.studyGroup.findMany({
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  return NextResponse.json(groups.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    members: g.members.length,
    lastActive: "Just now", // Mock for simplicity
    isMember: g.members.some(m => m.userId === session.user.id)
  })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();

  const group = await prisma.studyGroup.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN"
        }
      }
    }
  });

  return NextResponse.json(group);
}
