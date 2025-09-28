import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUserWithGear() {
  console.log('🔍 Checking for existing users...');

  // Check if any users exist
  let user = await prisma.user.findFirst();

  if (!user) {
    console.log('👤 Creating test user...');
    // Create a test user
    user = await prisma.user.create({
      data: {
        email: 'test@featherweight.app',
        name: 'Test User',
        preferredUnits: 'lbs', // Default to pounds as requested
        baseWeightGoal: 4536, // 10 lbs in grams
        totalWeightGoal: 11340, // 25 lbs in grams
      },
    });
    console.log(`✅ Created user: ${user.email}`);
  } else {
    console.log(`✅ Using existing user: ${user.email}`);
  }

  return user;
}

// Sample ultralight gear data organized by category
const gearData = {
  // Shelter
  Shelter: [
    {
      name: 'Zpacks Duplex Tent',
      description: 'Ultralight 2-person tent',
      weight: 538,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Big Agnes Tiger Wall UL2',
      description: 'Lightweight 2-person tent',
      weight: 1134,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Tarp Tent Protrail',
      description: 'Single-wall 1-person tent',
      weight: 709,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Borah Gear Bivy',
      description: 'Ultralight bivy sack',
      weight: 170,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Polycro Groundsheet',
      description: 'Ultralight ground cover',
      weight: 28,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Sleep System
  'Sleep System': [
    {
      name: 'Western Mountaineering UltraLite',
      description: '20°F down sleeping bag',
      weight: 794,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Enlightened Equipment Revelation',
      description: '20°F down quilt',
      weight: 567,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Therm-a-Rest NeoAir XLite',
      description: 'Inflatable sleeping pad',
      weight: 340,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Klymit Static V',
      description: 'Lightweight sleeping pad',
      weight: 510,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Z Lite Sol Pad',
      description: 'Closed-cell foam pad',
      weight: 410,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Zpacks Pillow',
      description: 'Ultralight inflatable pillow',
      weight: 28,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Backpack
  Backpack: [
    {
      name: 'Zpacks Arc Blast',
      description: '60L ultralight backpack',
      weight: 482,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Gossamer Gear Mariposa',
      description: '60L lightweight backpack',
      weight: 878,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Hyperlite Mountain Gear 2400',
      description: '40L ultralight pack',
      weight: 680,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'ULA Circuit',
      description: '68L backpack',
      weight: 1106,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: "Pa'lante V2",
      description: '19L ultralight daypack',
      weight: 340,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Clothing
  Clothing: [
    {
      name: 'Patagonia Houdini Jacket',
      description: 'Ultralight windbreaker',
      weight: 102,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Patagonia R1 Hoody',
      description: 'Synthetic insulation layer',
      weight: 340,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Smartwool Merino Base Layer',
      description: 'Long sleeve base layer',
      weight: 140,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Patagonia Baggies Shorts 5"',
      description: 'Hiking shorts',
      weight: 142,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Darn Tough Vermont Socks',
      description: 'Merino wool hiking socks',
      weight: 57,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Smartwool PhD Socks',
      description: 'Lightweight hiking socks',
      weight: 45,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Outdoor Research Sun Hat',
      description: 'Lightweight sun protection',
      weight: 71,
      isWorn: true,
      isConsumable: false,
    },
  ],

  // Footwear
  Footwear: [
    {
      name: 'Altra Lone Peak 8',
      description: 'Zero-drop trail runners',
      weight: 680,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Hoka Speedgoat 5',
      description: 'Cushioned trail runners',
      weight: 794,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Salomon X Ultra 3',
      description: 'Lightweight hiking shoes',
      weight: 907,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Xero Shoes TerraFlex',
      description: 'Minimalist trail runners',
      weight: 453,
      isWorn: true,
      isConsumable: false,
    },
    {
      name: 'Camp Shoes - Crocs',
      description: 'Lightweight camp shoes',
      weight: 368,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Cooking
  Cooking: [
    {
      name: 'Jetboil Flash',
      description: 'Integrated canister stove',
      weight: 371,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'BRS-3000T Stove',
      description: 'Ultralight canister stove',
      weight: 25,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Toaks Titanium Pot 750ml',
      description: 'Lightweight titanium pot',
      weight: 95,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Snow Peak Trek 900',
      description: 'Titanium cookset',
      weight: 150,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Light My Fire Spork',
      description: 'Titanium spork',
      weight: 11,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'GSI Outdoors Spoon',
      description: 'Lightweight camping spoon',
      weight: 8,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Jetboil Fuel Canister 100g',
      description: 'Stove fuel',
      weight: 200,
      isWorn: false,
      isConsumable: true,
    },
  ],

  // Water
  Water: [
    {
      name: 'Sawyer Squeeze Filter',
      description: 'Lightweight water filter',
      weight: 85,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Katadyn BeFree Filter',
      description: 'Collapsible water filter',
      weight: 63,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Smartwater 1L Bottle',
      description: 'Lightweight water bottle',
      weight: 38,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Platypus 2L Reservoir',
      description: 'Hydration bladder',
      weight: 142,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Aquatainer 2L',
      description: 'Collapsible water container',
      weight: 57,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Aquatabs Water Purification',
      description: 'Water purification tablets',
      weight: 28,
      isWorn: false,
      isConsumable: true,
    },
  ],

  // Electronics
  Electronics: [
    {
      name: 'Anker PowerCore 10000',
      description: 'Portable battery pack',
      weight: 180,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Petzl Bindi Headlamp',
      description: 'Ultralight headlamp',
      weight: 35,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Black Diamond Spot Headlamp',
      description: 'Waterproof headlamp',
      weight: 86,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Garmin inReach Mini',
      description: 'Satellite communicator',
      weight: 100,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Smartphone',
      weight: 187,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Lightning Cable',
      description: 'Phone charging cable',
      weight: 30,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Personal Care
  'Personal Care': [
    {
      name: 'Dr. Bronners Soap',
      description: 'Biodegradable soap',
      weight: 57,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Toothbrush (cut down)',
      description: 'Lightweight toothbrush',
      weight: 8,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Toothpaste Tablets',
      description: 'Lightweight toothpaste',
      weight: 14,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Sunscreen SPF 30',
      description: 'Sun protection',
      weight: 85,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Toilet Paper',
      description: 'Essential hygiene',
      weight: 57,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Trowel',
      description: 'Lightweight camping trowel',
      weight: 28,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Navigation
  Navigation: [
    {
      name: 'Suunto MC-2 Compass',
      description: 'Mirror compass',
      weight: 71,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'USGS Topo Map',
      description: 'Waterproof trail map',
      weight: 28,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Garmin eTrex 32x',
      description: 'Handheld GPS',
      weight: 142,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'AllTrails App',
      description: 'Digital trail maps',
      weight: 0,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Safety
  Safety: [
    {
      name: 'Adventure Medical Ultralight Kit',
      description: 'Minimal first aid kit',
      weight: 85,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Emergency Whistle',
      description: 'Safety whistle',
      weight: 8,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Emergency Bivvy',
      description: 'Space blanket bivvy',
      weight: 113,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Duct Tape',
      description: 'Multi-purpose repair tape',
      weight: 28,
      isWorn: false,
      isConsumable: false,
    },
    {
      name: 'Paracord 50ft',
      description: 'Utility cord',
      weight: 113,
      isWorn: false,
      isConsumable: false,
    },
  ],

  // Food
  Food: [
    {
      name: 'Mountain House Beef Stroganoff',
      description: 'Freeze-dried dinner',
      weight: 128,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Backpackers Pantry Pad Thai',
      description: 'Freeze-dried dinner',
      weight: 142,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Instant Oatmeal',
      description: 'Breakfast cereal',
      weight: 43,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Clif Bar',
      description: 'Energy bar',
      weight: 68,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Trail Mix',
      description: 'Nuts and dried fruit',
      weight: 142,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Peanut Butter Packets',
      description: 'Individual PB servings',
      weight: 32,
      isWorn: false,
      isConsumable: true,
    },
    {
      name: 'Instant Coffee',
      description: 'Morning caffeine',
      weight: 14,
      isWorn: false,
      isConsumable: true,
    },
  ],
};

// Pack list templates
const packListTemplates = [
  {
    name: '2-Day Weekend Trip',
    description: 'Perfect for a weekend backpacking trip',
    gear: [
      // Core Big 4
      { category: 'Backpack', item: 'Zpacks Arc Blast', quantity: 1 },
      { category: 'Shelter', item: 'Zpacks Duplex Tent', quantity: 1 },
      {
        category: 'Sleep System',
        item: 'Enlightened Equipment Revelation',
        quantity: 1,
      },
      {
        category: 'Sleep System',
        item: 'Therm-a-Rest NeoAir XLite',
        quantity: 1,
      },

      // Clothing
      { category: 'Clothing', item: 'Patagonia Houdini Jacket', quantity: 1 },
      {
        category: 'Clothing',
        item: 'Smartwool Merino Base Layer',
        quantity: 1,
      },
      {
        category: 'Clothing',
        item: 'Patagonia Baggies Shorts 5"',
        quantity: 1,
      },
      { category: 'Clothing', item: 'Darn Tough Vermont Socks', quantity: 2 },
      { category: 'Footwear', item: 'Altra Lone Peak 8', quantity: 1 },

      // Cooking
      { category: 'Cooking', item: 'BRS-3000T Stove', quantity: 1 },
      { category: 'Cooking', item: 'Toaks Titanium Pot 750ml', quantity: 1 },
      { category: 'Cooking', item: 'Light My Fire Spork', quantity: 1 },
      { category: 'Cooking', item: 'Jetboil Fuel Canister 100g', quantity: 1 },

      // Water
      { category: 'Water', item: 'Sawyer Squeeze Filter', quantity: 1 },
      { category: 'Water', item: 'Smartwater 1L Bottle', quantity: 2 },

      // Electronics
      { category: 'Electronics', item: 'Petzl Bindi Headlamp', quantity: 1 },
      { category: 'Electronics', item: 'Anker PowerCore 10000', quantity: 1 },

      // Food (2 days)
      { category: 'Food', item: 'Mountain House Beef Stroganoff', quantity: 2 },
      { category: 'Food', item: 'Instant Oatmeal', quantity: 2 },
      { category: 'Food', item: 'Clif Bar', quantity: 4 },
      { category: 'Food', item: 'Trail Mix', quantity: 1 },
      { category: 'Food', item: 'Instant Coffee', quantity: 4 },

      // Safety & Personal Care
      {
        category: 'Safety',
        item: 'Adventure Medical Ultralight Kit',
        quantity: 1,
      },
      { category: 'Personal Care', item: 'Toothbrush (cut down)', quantity: 1 },
      { category: 'Personal Care', item: 'Toothpaste Tablets', quantity: 1 },
      { category: 'Personal Care', item: 'Toilet Paper', quantity: 1 },
    ],
  },
  {
    name: 'Day Hike Essentials',
    description: 'Lightweight setup for day hiking',
    gear: [
      { category: 'Backpack', item: "Pa'lante V2", quantity: 1 },
      { category: 'Clothing', item: 'Patagonia Houdini Jacket', quantity: 1 },
      { category: 'Clothing', item: 'Outdoor Research Sun Hat', quantity: 1 },
      { category: 'Footwear', item: 'Altra Lone Peak 8', quantity: 1 },
      { category: 'Water', item: 'Smartwater 1L Bottle', quantity: 2 },
      { category: 'Food', item: 'Clif Bar', quantity: 2 },
      { category: 'Food', item: 'Trail Mix', quantity: 1 },
      { category: 'Electronics', item: 'Petzl Bindi Headlamp', quantity: 1 },
      {
        category: 'Safety',
        item: 'Adventure Medical Ultralight Kit',
        quantity: 1,
      },
      { category: 'Navigation', item: 'Suunto MC-2 Compass', quantity: 1 },
      { category: 'Navigation', item: 'USGS Topo Map', quantity: 1 },
      { category: 'Personal Care', item: 'Sunscreen SPF 30', quantity: 1 },
    ],
  },
  {
    name: '5-Day Thru-Hike Section',
    description: 'Extended backpacking trip gear',
    gear: [
      // Core Big 4
      { category: 'Backpack', item: 'ULA Circuit', quantity: 1 },
      { category: 'Shelter', item: 'Big Agnes Tiger Wall UL2', quantity: 1 },
      {
        category: 'Sleep System',
        item: 'Western Mountaineering UltraLite',
        quantity: 1,
      },
      {
        category: 'Sleep System',
        item: 'Therm-a-Rest NeoAir XLite',
        quantity: 1,
      },
      { category: 'Sleep System', item: 'Zpacks Pillow', quantity: 1 },

      // Extended clothing
      { category: 'Clothing', item: 'Patagonia R1 Hoody', quantity: 1 },
      { category: 'Clothing', item: 'Patagonia Houdini Jacket', quantity: 1 },
      {
        category: 'Clothing',
        item: 'Smartwool Merino Base Layer',
        quantity: 1,
      },
      {
        category: 'Clothing',
        item: 'Patagonia Baggies Shorts 5"',
        quantity: 1,
      },
      { category: 'Clothing', item: 'Darn Tough Vermont Socks', quantity: 3 },
      { category: 'Footwear', item: 'Hoka Speedgoat 5', quantity: 1 },
      { category: 'Footwear', item: 'Camp Shoes - Crocs', quantity: 1 },

      // Cooking for extended trip
      { category: 'Cooking', item: 'Jetboil Flash', quantity: 1 },
      { category: 'Cooking', item: 'Snow Peak Trek 900', quantity: 1 },
      { category: 'Cooking', item: 'Light My Fire Spork', quantity: 1 },
      { category: 'Cooking', item: 'Jetboil Fuel Canister 100g', quantity: 2 },

      // Water system
      { category: 'Water', item: 'Katadyn BeFree Filter', quantity: 1 },
      { category: 'Water', item: 'Platypus 2L Reservoir', quantity: 1 },
      { category: 'Water', item: 'Smartwater 1L Bottle', quantity: 1 },
      { category: 'Water', item: 'Aquatabs Water Purification', quantity: 1 },

      // Electronics
      {
        category: 'Electronics',
        item: 'Black Diamond Spot Headlamp',
        quantity: 1,
      },
      { category: 'Electronics', item: 'Anker PowerCore 10000', quantity: 1 },
      { category: 'Electronics', item: 'Garmin inReach Mini', quantity: 1 },
      { category: 'Electronics', item: 'iPhone 15 Pro', quantity: 1 },

      // Extended food supply
      { category: 'Food', item: 'Mountain House Beef Stroganoff', quantity: 3 },
      { category: 'Food', item: 'Backpackers Pantry Pad Thai', quantity: 2 },
      { category: 'Food', item: 'Instant Oatmeal', quantity: 5 },
      { category: 'Food', item: 'Clif Bar', quantity: 10 },
      { category: 'Food', item: 'Trail Mix', quantity: 3 },
      { category: 'Food', item: 'Peanut Butter Packets', quantity: 10 },
      { category: 'Food', item: 'Instant Coffee', quantity: 10 },

      // Safety & Navigation
      {
        category: 'Safety',
        item: 'Adventure Medical Ultralight Kit',
        quantity: 1,
      },
      { category: 'Safety', item: 'Emergency Bivvy', quantity: 1 },
      { category: 'Safety', item: 'Paracord 50ft', quantity: 1 },
      { category: 'Navigation', item: 'Garmin eTrex 32x', quantity: 1 },
      { category: 'Navigation', item: 'USGS Topo Map', quantity: 2 },

      // Personal care for extended trip
      { category: 'Personal Care', item: 'Dr. Bronners Soap', quantity: 1 },
      { category: 'Personal Care', item: 'Toothbrush (cut down)', quantity: 1 },
      { category: 'Personal Care', item: 'Toothpaste Tablets', quantity: 1 },
      { category: 'Personal Care', item: 'Sunscreen SPF 30', quantity: 1 },
      { category: 'Personal Care', item: 'Toilet Paper', quantity: 2 },
      { category: 'Personal Care', item: 'Trowel', quantity: 1 },
    ],
  },
];

async function main() {
  const user = await createUserWithGear();

  // Get all categories
  const categories = await prisma.category.findMany();
  console.log(`📋 Found ${categories.length} categories`);

  // Create a map of category names to IDs
  const categoryMap = new Map();
  categories.forEach(cat => categoryMap.set(cat.name, cat.id));

  console.log('🎒 Creating gear items...');

  // Create gear items
  const createdGear = new Map();
  let gearCount = 0;

  for (const [categoryName, items] of Object.entries(gearData)) {
    const categoryId = categoryMap.get(categoryName);
    if (!categoryId) {
      console.log(`⚠️  Category "${categoryName}" not found, skipping...`);
      continue;
    }

    for (const item of items) {
      try {
        const gearItem = await prisma.gearItem.create({
          data: {
            ...item,
            userId: user.id,
            categoryId: categoryId,
          },
        });

        createdGear.set(`${categoryName}:${item.name}`, gearItem);
        gearCount++;

        if (gearCount % 10 === 0) {
          console.log(`   Created ${gearCount} gear items...`);
        }
      } catch (error) {
        console.log(`   ❌ Failed to create ${item.name}: ${error.message}`);
      }
    }
  }

  console.log(`✅ Created ${gearCount} gear items`);

  console.log('📦 Creating pack lists...');

  // Create pack lists
  for (const template of packListTemplates) {
    try {
      const packList = await prisma.packList.create({
        data: {
          name: template.name,
          description: template.description,
          userId: user.id,
          isPublic: false,
        },
      });

      console.log(`   📋 Created pack list: ${template.name}`);

      // Add items to pack list
      let itemCount = 0;
      for (const gearRef of template.gear) {
        const gearKey = `${gearRef.category}:${gearRef.item}`;
        const gearItem = createdGear.get(gearKey);

        if (gearItem) {
          await prisma.packListItem.create({
            data: {
              packListId: packList.id,
              gearItemId: gearItem.id,
              quantity: gearRef.quantity,
              isIncluded: true,
            },
          });
          itemCount++;
        } else {
          console.log(`     ⚠️  Gear item not found: ${gearKey}`);
        }
      }

      console.log(`     ✅ Added ${itemCount} items to ${template.name}`);
    } catch (error) {
      console.log(
        `   ❌ Failed to create pack list ${template.name}: ${error.message}`
      );
    }
  }

  console.log('🎉 Sample data creation complete!');

  // Show summary
  const totalGear = await prisma.gearItem.count({ where: { userId: user.id } });
  const totalPackLists = await prisma.packList.count({
    where: { userId: user.id },
  });

  console.log(`\n📊 Summary for ${user.email}:`);
  console.log(`   🎒 Total gear items: ${totalGear}`);
  console.log(`   📦 Total pack lists: ${totalPackLists}`);
  console.log(`\n🌐 Visit http://localhost:3000/gear to see your gear`);
  console.log(`🌐 Visit http://localhost:3000/lists to see your pack lists`);
  console.log(
    `🌐 Visit http://localhost:3000/settings to test the unit preferences!`
  );
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
