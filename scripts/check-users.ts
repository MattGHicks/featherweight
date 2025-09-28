import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(
        `- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Created: ${user.createdAt}`
      );
    });

    if (users.length === 0) {
      console.log(
        '\nNo users found. You need to sign up first through the app.'
      );
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
