import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function transferUserData() {
  try {
    console.log('Starting user data transfer...');

    // Find both users
    const oldUser = await prisma.user.findFirst({
      where: { id: 'cmg35batc0000itrhhje9b5i4' }
    });

    const newUser = await prisma.user.findFirst({
      where: { id: 'cmg38rbab0000kz04oz20c7t1' }
    });

    if (!oldUser || !newUser) {
      console.error('Could not find both users');
      return;
    }

    console.log(`Transferring data from ${oldUser.name} (${oldUser.id}) to ${newUser.name} (${newUser.id})`);

    // Transfer gear items
    const gearUpdate = await prisma.gearItem.updateMany({
      where: { userId: oldUser.id },
      data: { userId: newUser.id }
    });
    console.log(`✓ Transferred ${gearUpdate.count} gear items`);

    // Transfer pack lists
    const packListUpdate = await prisma.packList.updateMany({
      where: { userId: oldUser.id },
      data: { userId: newUser.id }
    });
    console.log(`✓ Transferred ${packListUpdate.count} pack lists`);

    // Verify the transfer
    const newUserGearCount = await prisma.gearItem.count({
      where: { userId: newUser.id }
    });
    const newUserPackListCount = await prisma.packList.count({
      where: { userId: newUser.id }
    });

    console.log(`\n✅ Transfer complete!`);
    console.log(`   New user now has: ${newUserGearCount} gear items, ${newUserPackListCount} pack lists`);

    // Delete the old user (optional)
    console.log('\nCleaning up old user account...');
    await prisma.account.deleteMany({
      where: { userId: oldUser.id }
    });
    await prisma.session.deleteMany({
      where: { userId: oldUser.id }
    });
    await prisma.user.delete({
      where: { id: oldUser.id }
    });
    console.log('✓ Old user account deleted');

  } catch (error) {
    console.error('Transfer failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the transfer
transferUserData();