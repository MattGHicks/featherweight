import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('🔍 Checking database connection and tables...');

    // Check database connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Check what tables exist by trying to query each model
    const checks = [
      { name: 'users', query: () => prisma.user.count() },
      { name: 'accounts', query: () => prisma.account.count() },
      { name: 'sessions', query: () => prisma.session.count() },
      { name: 'categories', query: () => prisma.category.count() },
      { name: 'gear_items', query: () => prisma.gearItem.count() },
      { name: 'pack_lists', query: () => prisma.packList.count() },
      { name: 'pack_list_items', query: () => prisma.packListItem.count() },
    ];

    console.log('\n📊 Table status:');
    for (const check of checks) {
      try {
        const count = await check.query();
        console.log(`  ✅ ${check.name}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${check.name}: Table missing or error`);
        console.log(`     Error: ${error.message}`);
      }
    }

    // Check current DATABASE_URL
    console.log(`\n🔗 Database URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();