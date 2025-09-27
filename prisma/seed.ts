import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default categories for ultralight backpacking
  const categories = [
    { name: 'Shelter', color: '#ef4444', order: 1, isDefault: true }, // red
    { name: 'Sleep System', color: '#f97316', order: 2, isDefault: true }, // orange
    { name: 'Backpack', color: '#eab308', order: 3, isDefault: true }, // yellow
    { name: 'Clothing', color: '#22c55e', order: 4, isDefault: true }, // green
    { name: 'Cooking', color: '#3b82f6', order: 5, isDefault: true }, // blue
    { name: 'Water', color: '#6366f1', order: 6, isDefault: true }, // indigo
    { name: 'Navigation', color: '#8b5cf6', order: 7, isDefault: true }, // violet
    { name: 'Safety', color: '#ec4899', order: 8, isDefault: true }, // pink
    { name: 'Electronics', color: '#06b6d4', order: 9, isDefault: true }, // cyan
    { name: 'Hygiene', color: '#84cc16', order: 10, isDefault: true }, // lime
    { name: 'First Aid', color: '#f43f5e', order: 11, isDefault: true }, // rose
    { name: 'Tools', color: '#64748b', order: 12, isDefault: true }, // slate
    { name: 'Food', color: '#d97706', order: 13, isDefault: true }, // amber
    { name: 'Miscellaneous', color: '#6b7280', order: 14, isDefault: true }, // gray
  ];

  console.log('Seeding default categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: category,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
