import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'mattghicks@gmail.com' },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log(`User: ${user.email} (${user.id})`);
    console.log(`Base Weight Goal: ${user.baseWeightGoal}g`);
    console.log(`Total Weight Goal: ${user.totalWeightGoal}g`);

    // Check gear items
    const gearCount = await prisma.gearItem.count({
      where: { userId: user.id },
    });
    console.log(`\nGear Items: ${gearCount}`);

    // Check pack lists
    const packLists = await prisma.packList.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            gearItem: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    console.log(`\nPack Lists: ${packLists.length}`);

    packLists.forEach(list => {
      const totalWeight = list.items
        .filter(item => item.isIncluded)
        .reduce((sum, item) => sum + item.gearItem.weight * item.quantity, 0);

      const baseWeight = list.items
        .filter(
          item =>
            item.isIncluded &&
            !item.gearItem.isWorn &&
            !item.gearItem.isConsumable
        )
        .reduce((sum, item) => sum + item.gearItem.weight * item.quantity, 0);

      console.log(
        `- ${list.name}: ${list.items.length} items, ${totalWeight}g total, ${baseWeight}g base`
      );
    });

    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`\nCategories: ${categories.length}`);
    categories.forEach(cat => console.log(`- ${cat.name}`));
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
