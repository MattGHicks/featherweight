import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Category mapping from Lighterpack to our database names
const categoryNameMapping = {
  'Pack': 'Backpack',
  'Shelter': 'Shelter',
  'Sleep System': 'Sleep System',
  'Clothing': 'Clothing',
  'Cook': 'Cooking',
  'Water': 'Water',
  'Navigation': 'Navigation',
  'Safety': 'Safety',
  'Electronics': 'Electronics',
  'Hygiene': 'Hygiene',
  'First Aid': 'First Aid',
  'Tools': 'Tools',
  'Food': 'Food',
  'Miscellaneous': 'Miscellaneous',
};

// Your gear data from Lighterpack (4 Day Loadout)
const gearData = [
  // Pack
  { name: 'Nylofume® Pack Liner', weight: 26, category: 'Pack', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Waymark EVLV - 35', weight: 476, category: 'Pack', quantity: 1, isWorn: false, isConsumable: false, description: 'Includes removable 1in hip belt' },

  // Shelter
  { name: 'Zpacks Duplex', weight: 539, category: 'Shelter', quantity: 1, isWorn: false, isConsumable: false, description: 'Spruce Green' },
  { name: 'MSR Groundhog Stakes', weight: 13, category: 'Shelter', quantity: 8, isWorn: false, isConsumable: false },

  // Sleep System
  { name: 'Western Mountaineering UltraLite', weight: 680, category: 'Sleep System', quantity: 1, isWorn: false, isConsumable: false, description: '20°F sleeping bag' },
  { name: 'Therm-a-Rest NeoAir XLite', weight: 340, category: 'Sleep System', quantity: 1, isWorn: false, isConsumable: false, description: 'Regular size' },
  { name: 'Sea to Summit Aeros Pillow Premium', weight: 75, category: 'Sleep System', quantity: 1, isWorn: false, isConsumable: false, description: 'Regular size' },

  // Clothing
  { name: 'Patagonia Houdini Windbreaker', weight: 95, category: 'Clothing', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Smartwool Merino 150 Base Layer', weight: 130, category: 'Clothing', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Darn Tough Vermont Merino Socks', weight: 57, category: 'Clothing', quantity: 2, isWorn: false, isConsumable: false },
  { name: 'ExOfficio Give-N-Go Boxer Briefs', weight: 45, category: 'Clothing', quantity: 2, isWorn: false, isConsumable: false },
  { name: 'Patagonia P-6 Logo Trucker Hat', weight: 71, category: 'Clothing', quantity: 1, isWorn: true, isConsumable: false },
  { name: 'Outdoor Research Ferrosi Pants', weight: 285, category: 'Clothing', quantity: 1, isWorn: true, isConsumable: false },
  { name: 'REI Co-op Merino Wool Long-Sleeve Base Layer', weight: 168, category: 'Clothing', quantity: 1, isWorn: true, isConsumable: false },

  // Cook
  { name: 'MSR PocketRocket 2', weight: 73, category: 'Cook', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'MSR Titan Kettle', weight: 118, category: 'Cook', quantity: 1, isWorn: false, isConsumable: false, description: '0.85L' },
  { name: 'MSR Isopro Fuel Canister', weight: 367, category: 'Cook', quantity: 1, isWorn: false, isConsumable: true, description: '227g canister' },
  { name: 'Light My Fire Spork', weight: 9, category: 'Cook', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Sea to Summit X-Mug', weight: 60, category: 'Cook', quantity: 1, isWorn: false, isConsumable: false },

  // Water
  { name: 'Platypus Big Zip LP', weight: 42, category: 'Water', quantity: 1, isWorn: false, isConsumable: false, description: '3L reservoir' },
  { name: 'Sawyer Squeeze Water Filter', weight: 57, category: 'Water', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Aquatainer Water', weight: 1000, category: 'Water', quantity: 1, isWorn: false, isConsumable: true, description: '1L starting water' },

  // Electronics
  { name: 'iPhone 14 Pro', weight: 206, category: 'Electronics', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Anker PowerCore 10000', weight: 180, category: 'Electronics', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Lightning Cable', weight: 30, category: 'Electronics', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Petzl Actik Core Headlamp', weight: 75, category: 'Electronics', quantity: 1, isWorn: false, isConsumable: false },

  // Navigation
  { name: 'Garmin inReach Mini 2', weight: 100, category: 'Navigation', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Silva Compass', weight: 20, category: 'Navigation', quantity: 1, isWorn: false, isConsumable: false },

  // Safety
  { name: 'Emergency Whistle', weight: 8, category: 'Safety', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Duct Tape (small roll)', weight: 30, category: 'Safety', quantity: 1, isWorn: false, isConsumable: false },

  // First Aid
  { name: 'Adventure Medical Kits Ultralight .7', weight: 85, category: 'First Aid', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Ibuprofen (10 tablets)', weight: 5, category: 'First Aid', quantity: 1, isWorn: false, isConsumable: true },

  // Hygiene
  { name: 'Dr. Bronners Soap (small)', weight: 60, category: 'Hygiene', quantity: 1, isWorn: false, isConsumable: true, description: '2oz bottle' },
  { name: 'Toilet Paper (partial roll)', weight: 25, category: 'Hygiene', quantity: 1, isWorn: false, isConsumable: true },
  { name: 'Trowel (lightweight)', weight: 15, category: 'Hygiene', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Toothbrush (cut down)', weight: 10, category: 'Hygiene', quantity: 1, isWorn: false, isConsumable: false },
  { name: 'Toothpaste (travel size)', weight: 34, category: 'Hygiene', quantity: 1, isWorn: false, isConsumable: true },

  // Tools
  { name: 'Leatherman Squirt PS4', weight: 56, category: 'Tools', quantity: 1, isWorn: false, isConsumable: false },

  // Food (4 days worth)
  { name: 'Mountain House Meals', weight: 400, category: 'Food', quantity: 4, isWorn: false, isConsumable: true, description: 'Freeze dried dinners' },
  { name: 'Instant Oatmeal Packets', weight: 180, category: 'Food', quantity: 4, isWorn: false, isConsumable: true, description: 'Breakfast' },
  { name: 'Energy Bars', weight: 600, category: 'Food', quantity: 12, isWorn: false, isConsumable: true, description: 'Lunch and snacks' },
  { name: 'Trail Mix', weight: 500, category: 'Food', quantity: 1, isWorn: false, isConsumable: true, description: '500g bag' },
  { name: 'Instant Coffee Packets', weight: 30, category: 'Food', quantity: 8, isWorn: false, isConsumable: true },
  { name: 'Electrolyte Powder', weight: 50, category: 'Food', quantity: 1, isWorn: false, isConsumable: true, description: 'Nuun tablets' },

  // Miscellaneous
  { name: 'Ziploc Bags (various)', weight: 15, category: 'Miscellaneous', quantity: 5, isWorn: false, isConsumable: false },
  { name: 'Paracord (10 feet)', weight: 32, category: 'Miscellaneous', quantity: 1, isWorn: false, isConsumable: false },
];

async function importGear() {
  try {
    console.log('Starting gear import...');

    // Find the user (assuming Matt Hicks is the only user)
    const user = await prisma.user.findFirst({
      where: { email: 'mattghicks@gmail.com' }
    });

    if (!user) {
      console.error('User not found!');
      return;
    }

    console.log(`Importing gear for user: ${user.name} (${user.email})`);

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.name, cat.id);
    });

    console.log('Available categories:', categories.map(c => c.name));

    let imported = 0;
    let skipped = 0;

    for (const item of gearData) {
      try {
        // Check if item already exists
        const existingItem = await prisma.gearItem.findFirst({
          where: {
            userId: user.id,
            name: item.name
          }
        });

        if (existingItem) {
          console.log(`Skipping existing item: ${item.name}`);
          skipped++;
          continue;
        }

        // Get category ID by mapping the category name
        const mappedCategoryName = categoryNameMapping[item.category as keyof typeof categoryNameMapping];
        const categoryId = categoryMap.get(mappedCategoryName);

        if (!categoryId) {
          console.warn(`Unknown category: ${item.category} -> ${mappedCategoryName} for item: ${item.name}`);
          continue;
        }

        // Create gear item
        await prisma.gearItem.create({
          data: {
            name: item.name,
            description: item.description || '',
            weight: item.weight,
            quantity: item.quantity,
            categoryId: categoryId,
            isWorn: item.isWorn,
            isConsumable: item.isConsumable,
            userId: user.id,
          }
        });

        console.log(`✓ Imported: ${item.name} (${item.weight}g)`);
        imported++;

      } catch (error) {
        console.error(`Error importing ${item.name}:`, error);
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Imported: ${imported} items`);
    console.log(`   Skipped: ${skipped} items`);

  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importGear();