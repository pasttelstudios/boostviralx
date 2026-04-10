const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: { contains: "pasttelshop2" } },
    data: { role: "ADMIN", balance: 1000 }
  });
  console.log("Updated to ADMIN");
}

main().catch(console.error).finally(() => prisma.$disconnect());
