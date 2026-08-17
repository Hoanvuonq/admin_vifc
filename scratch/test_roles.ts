import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.hifazlvhdkrdnbbqiguw:testonlybro2009%21@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function main() {
  try {
    const roles = await prisma.role.findMany();
    console.log('Roles in DB:', roles);

    const userRoles = await prisma.userRole.findMany({
      include: {
        role: true,
        user: true,
      }
    });
    console.log('User roles in DB:', userRoles);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
