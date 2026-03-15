import { prisma } from "@backend/lib/prisma";

export async function main() {
  console.log("Starting verification tests...");

  try {
    // 1. Test User Creation (Simulation of Auth)
    const testEmail = `test-${Date.now()}@example.com`;
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test User",
      },
    });
    console.log("✅ User creation test passed.");

    // 2. Test Subject Creation
    const subject = await prisma.subject.create({
      data: {
        name: "Test Subject",
        userId: user.id,
        difficulty: 3,
        topics: {
          create: [{ name: "Topic 1" }, { name: "Topic 2" }],
        },
      },
      include: { topics: true },
    });
    console.log("✅ Subject and Topic creation test passed.");

    // 3. Test Achievement System
    const achievement = await prisma.achievement.create({
      data: {
        userId: user.id,
        type: "STREAK",
        title: "Test Achievement",
        description: "Unlocked during verification",
      },
    });
    console.log("✅ Achievement system test passed.");

    // 4. Test Study Groups
    const group = await prisma.studyGroup.create({
      data: {
        name: "Test Group",
        members: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });
    console.log("✅ Study Group system test passed.");

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.studyGroup.delete({ where: { id: group.id } });
    console.log("✅ Cleanup successful.");
    console.log("ALL TESTS PASSED SUCCESSFULLY! 🚀");

  } catch (error) {
    console.error("❌ Verification tests failed:", error);
    process.exit(1);
  }
}

main();
