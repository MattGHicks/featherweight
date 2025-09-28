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

  // Get category IDs for templates
  const shelterCategory = await prisma.category.findUnique({
    where: { name: 'Shelter' },
  });
  const sleepCategory = await prisma.category.findUnique({
    where: { name: 'Sleep System' },
  });
  const backpackCategory = await prisma.category.findUnique({
    where: { name: 'Backpack' },
  });
  const clothingCategory = await prisma.category.findUnique({
    where: { name: 'Clothing' },
  });
  const cookingCategory = await prisma.category.findUnique({
    where: { name: 'Cooking' },
  });
  const waterCategory = await prisma.category.findUnique({
    where: { name: 'Water' },
  });
  const navigationCategory = await prisma.category.findUnique({
    where: { name: 'Navigation' },
  });
  const safetyCategory = await prisma.category.findUnique({
    where: { name: 'Safety' },
  });
  const electronicsCategory = await prisma.category.findUnique({
    where: { name: 'Electronics' },
  });
  const hygieneCategory = await prisma.category.findUnique({
    where: { name: 'Hygiene' },
  });
  const firstAidCategory = await prisma.category.findUnique({
    where: { name: 'First Aid' },
  });
  const toolsCategory = await prisma.category.findUnique({
    where: { name: 'Tools' },
  });

  console.log('Seeding pack list templates...');

  // Ultralight Overnight Template
  const overnightTemplate = await prisma.packListTemplate.create({
    data: {
      name: 'Ultralight Overnight',
      description:
        'Essential gear for a single night ultralight backpacking trip in 3-season conditions',
      category: 'Overnight',
      season: '3-season',
      difficulty: 'Intermediate',
      isPublic: true,
    },
  });

  const overnightItems = [
    {
      categoryId: shelterCategory!.id,
      itemName: 'Ultralight Tent',
      description: '1-2 person tent under 2 lbs',
      estimatedWeight: 800,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Sleeping Bag',
      description: '20°F comfort rating',
      estimatedWeight: 650,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Sleeping Pad',
      description: 'Closed-cell or ultralight inflatable',
      estimatedWeight: 400,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: backpackCategory!.id,
      itemName: 'Ultralight Backpack',
      description: '40-50L frameless pack',
      estimatedWeight: 900,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Rain Jacket',
      description: 'Lightweight waterproof shell',
      estimatedWeight: 200,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Ultralight Stove',
      description: 'Canister or alcohol stove',
      estimatedWeight: 60,
      quantity: 1,
      isEssential: false,
      priority: 2,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Titanium Pot',
      description: '750ml lightweight pot',
      estimatedWeight: 95,
      quantity: 1,
      isEssential: false,
      priority: 2,
    },
    {
      categoryId: waterCategory!.id,
      itemName: 'Water Filter',
      description: 'Lightweight filter or purification tablets',
      estimatedWeight: 85,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: electronicsCategory!.id,
      itemName: 'Headlamp',
      description: 'Lightweight LED headlamp',
      estimatedWeight: 65,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: firstAidCategory!.id,
      itemName: 'First Aid Kit',
      description: 'Basic emergency supplies',
      estimatedWeight: 120,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
  ];

  for (const item of overnightItems) {
    await prisma.packListTemplateItem.create({
      data: {
        templateId: overnightTemplate.id,
        ...item,
      },
    });
  }

  // 3-Season Backpacking Template
  const threSeasonTemplate = await prisma.packListTemplate.create({
    data: {
      name: '3-Season Backpacking',
      description:
        'Complete gear list for multi-day backpacking in spring, summer, and fall conditions',
      category: 'Multi-day',
      season: '3-season',
      difficulty: 'Beginner',
      isPublic: true,
    },
  });

  const threeSeasonItems = [
    {
      categoryId: shelterCategory!.id,
      itemName: 'Backpacking Tent',
      description: '2-3 person freestanding tent',
      estimatedWeight: 1400,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Sleeping Bag',
      description: '20°F comfort rating',
      estimatedWeight: 900,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Sleeping Pad',
      description: 'Inflatable pad with R-value 4+',
      estimatedWeight: 500,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Pillow',
      description: 'Inflatable or compressible pillow',
      estimatedWeight: 100,
      quantity: 1,
      isEssential: false,
      priority: 2,
    },
    {
      categoryId: backpackCategory!.id,
      itemName: 'Backpack',
      description: '60-70L framed pack',
      estimatedWeight: 1200,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Rain Jacket',
      description: 'Waterproof breathable shell',
      estimatedWeight: 300,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Rain Pants',
      description: 'Waterproof shell pants',
      estimatedWeight: 200,
      quantity: 1,
      isEssential: false,
      priority: 2,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Insulation Layer',
      description: 'Down or synthetic jacket',
      estimatedWeight: 400,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Stove',
      description: 'Canister stove with piezo ignition',
      estimatedWeight: 120,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Cookpot',
      description: '1L pot with lid',
      estimatedWeight: 150,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Spork',
      description: 'Lightweight utensil',
      estimatedWeight: 20,
      quantity: 1,
      isEssential: true,
      priority: 2,
    },
    {
      categoryId: waterCategory!.id,
      itemName: 'Water Filter',
      description: 'Pump or gravity filter',
      estimatedWeight: 250,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: waterCategory!.id,
      itemName: 'Water Bottles',
      description: '2L total capacity',
      estimatedWeight: 200,
      quantity: 2,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: navigationCategory!.id,
      itemName: 'Map & Compass',
      description: 'Topographic map and compass',
      estimatedWeight: 80,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: electronicsCategory!.id,
      itemName: 'Headlamp',
      description: 'LED headlamp with extra batteries',
      estimatedWeight: 100,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: firstAidCategory!.id,
      itemName: 'First Aid Kit',
      description: 'Comprehensive wilderness first aid',
      estimatedWeight: 200,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: hygieneCategory!.id,
      itemName: 'Toiletries',
      description: 'Toothbrush, soap, toilet paper',
      estimatedWeight: 100,
      quantity: 1,
      isEssential: true,
      priority: 2,
    },
    {
      categoryId: toolsCategory!.id,
      itemName: 'Multi-tool',
      description: 'Knife with basic tools',
      estimatedWeight: 150,
      quantity: 1,
      isEssential: true,
      priority: 2,
    },
  ];

  for (const item of threeSeasonItems) {
    await prisma.packListTemplateItem.create({
      data: {
        templateId: threSeasonTemplate.id,
        ...item,
      },
    });
  }

  // Winter Backpacking Template
  const winterTemplate = await prisma.packListTemplate.create({
    data: {
      name: 'Winter Backpacking',
      description: 'Cold weather gear for snow camping and winter conditions',
      category: 'Multi-day',
      season: 'Winter',
      difficulty: 'Advanced',
      isPublic: true,
    },
  });

  const winterItems = [
    {
      categoryId: shelterCategory!.id,
      itemName: '4-Season Tent',
      description: 'Mountaineering tent for snow loads',
      estimatedWeight: 2000,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Winter Sleeping Bag',
      description: '0°F rated down bag',
      estimatedWeight: 1200,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: sleepCategory!.id,
      itemName: 'Winter Sleeping Pad',
      description: 'R-value 5+ insulated pad',
      estimatedWeight: 650,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Winter Shell Jacket',
      description: 'Hardshell with ventilation',
      estimatedWeight: 500,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Winter Shell Pants',
      description: 'Hardshell with full zips',
      estimatedWeight: 400,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Down Jacket',
      description: 'Expedition weight insulation',
      estimatedWeight: 600,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Insulated Pants',
      description: 'Down or synthetic pants',
      estimatedWeight: 450,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: cookingCategory!.id,
      itemName: 'Liquid Fuel Stove',
      description: 'White gas stove for cold weather',
      estimatedWeight: 350,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: safetyCategory!.id,
      itemName: 'Avalanche Beacon',
      description: 'Digital avalanche transceiver',
      estimatedWeight: 250,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: safetyCategory!.id,
      itemName: 'Probe & Shovel',
      description: 'Avalanche rescue gear',
      estimatedWeight: 800,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: toolsCategory!.id,
      itemName: 'Snow Shovel',
      description: 'Lightweight aluminum shovel',
      estimatedWeight: 600,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
  ];

  for (const item of winterItems) {
    await prisma.packListTemplateItem.create({
      data: {
        templateId: winterTemplate.id,
        ...item,
      },
    });
  }

  // Day Hiking Template
  const dayHikeTemplate = await prisma.packListTemplate.create({
    data: {
      name: 'Day Hiking Essentials',
      description: 'Essential gear for safe day hiking adventures',
      category: 'Day Hike',
      season: 'All',
      difficulty: 'Beginner',
      isPublic: true,
    },
  });

  const dayHikeItems = [
    {
      categoryId: backpackCategory!.id,
      itemName: 'Day Pack',
      description: '20-30L daypack',
      estimatedWeight: 800,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: waterCategory!.id,
      itemName: 'Water Bottle',
      description: '1L water bottle',
      estimatedWeight: 150,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: navigationCategory!.id,
      itemName: 'Map & Compass',
      description: 'Trail map and basic compass',
      estimatedWeight: 60,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: safetyCategory!.id,
      itemName: 'Emergency Whistle',
      description: 'Signal whistle',
      estimatedWeight: 10,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: firstAidCategory!.id,
      itemName: 'Basic First Aid',
      description: 'Bandages and pain relievers',
      estimatedWeight: 80,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: clothingCategory!.id,
      itemName: 'Extra Layer',
      description: 'Fleece or light jacket',
      estimatedWeight: 300,
      quantity: 1,
      isEssential: true,
      priority: 1,
    },
    {
      categoryId: electronicsCategory!.id,
      itemName: 'Flashlight',
      description: 'Small LED flashlight',
      estimatedWeight: 50,
      quantity: 1,
      isEssential: true,
      priority: 2,
    },
  ];

  for (const item of dayHikeItems) {
    await prisma.packListTemplateItem.create({
      data: {
        templateId: dayHikeTemplate.id,
        ...item,
      },
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
