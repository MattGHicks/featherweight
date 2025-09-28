import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserPrefs() {
  console.log('🔍 Checking user preferences...');

  const user = await prisma.user.findUnique({
    where: { email: 'mattghicks@gmail.com' },
    select: {
      email: true,
      name: true,
      preferredUnits: true,
      baseWeightGoal: true,
      totalWeightGoal: true,
    },
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found:');
  console.log(`  Email: ${user.email}`);
  console.log(`  Name: ${user.name}`);
  console.log(`  Preferred Units: ${user.preferredUnits}`);
  console.log(
    `  Base Weight Goal: ${user.baseWeightGoal ? user.baseWeightGoal + ' grams' : 'Not set'}`
  );
  console.log(
    `  Total Weight Goal: ${user.totalWeightGoal ? user.totalWeightGoal + ' grams' : 'Not set'}`
  );

  // Update to lbs if not already set
  if (user.preferredUnits !== 'lbs') {
    console.log(
      `🔄 Updating user preference from ${user.preferredUnits} to lbs...`
    );

    const updated = await prisma.user.update({
      where: { email: 'mattghicks@gmail.com' },
      data: {
        preferredUnits: 'lbs',
      },
    });

    console.log(`✅ Updated to: ${updated.preferredUnits}`);
  } else {
    console.log('✅ User already set to lbs');
  }
}

checkUserPrefs()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
