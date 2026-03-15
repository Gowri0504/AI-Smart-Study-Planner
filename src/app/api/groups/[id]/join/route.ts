import { authOptions } from "@backend/lib/auth";
import { prisma } from "@backend/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  // Check if group exists
  const group = await prisma.studyGroup.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  // Check if already a member
  const existingMember = await prisma.studyGroupMember.findFirst({
    where: {
      groupId,
      userId: session.user.id
    }
  });

  if (existingMember) {
    return NextResponse.json({ error: "Already a member" }, { status: 400 });
  }

  // Add member
  await prisma.studyGroupMember.create({
    data: {
      groupId,
      userId: session.user.id,
      role: "MEMBER"
    }
  });

  return NextResponse.json({ success: true });
}

