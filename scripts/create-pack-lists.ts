import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPackLists() {
  try {
    console.log('Creating pack lists...');

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: 'mattghicks@gmail.com' }
    });

    if (!user) {
      console.error('User not found!');
      return;
    }

    // Get all user's gear items
    const gearItems = await prisma.gearItem.findMany({
      where: { userId: user.id },
      include: { category: true }
    });

    console.log(`Found ${gearItems.length} gear items`);

    // Create "4 Day Loadout" pack list (matching your Lighterpack)
    const fourDayLoadout = await prisma.packList.create({
      data: {
        name: '4 Day Loadout',
        description: 'Complete 4-day backpacking setup based on Lighterpack configuration',
        userId: user.id,
        isPublic: false,
      }
    });

    console.log('✓ Created pack list: 4 Day Loadout');

    // Add all items to the pack list with appropriate quantities
    const packListItems = [
      // Pack
      { name: 'Nylofume® Pack Liner', quantity: 1 },
      { name: 'Waymark EVLV - 35', quantity: 1 },

      // Shelter
      { name: 'Zpacks Duplex', quantity: 1 },
      { name: 'MSR Groundhog Stakes', quantity: 8 },

      // Sleep System
      { name: 'Western Mountaineering UltraLite', quantity: 1 },
      { name: 'Therm-a-Rest NeoAir XLite', quantity: 1 },
      { name: 'Sea to Summit Aeros Pillow Premium', quantity: 1 },

      // Clothing (pack extras, worn items not included in base weight)
      { name: 'Patagonia Houdini Windbreaker', quantity: 1 },
      { name: 'Smartwool Merino 150 Base Layer', quantity: 1 },
      { name: 'Darn Tough Vermont Merino Socks', quantity: 2 },
      { name: 'ExOfficio Give-N-Go Boxer Briefs', quantity: 2 },

      // Cook
      { name: 'MSR PocketRocket 2', quantity: 1 },
      { name: 'MSR Titan Kettle', quantity: 1 },
      { name: 'MSR Isopro Fuel Canister', quantity: 1 },
      { name: 'Light My Fire Spork', quantity: 1 },
      { name: 'Sea to Summit X-Mug', quantity: 1 },

      // Water
      { name: 'Platypus Big Zip LP', quantity: 1 },
      { name: 'Sawyer Squeeze Water Filter', quantity: 1 },
      { name: 'Aquatainer Water', quantity: 1 },

      // Electronics
      { name: 'iPhone 14 Pro', quantity: 1 },
      { name: 'Anker PowerCore 10000', quantity: 1 },
      { name: 'Lightning Cable', quantity: 1 },
      { name: 'Petzl Actik Core Headlamp', quantity: 1 },

      // Navigation
      { name: 'Garmin inReach Mini 2', quantity: 1 },
      { name: 'Silva Compass', quantity: 1 },

      // Safety
      { name: 'Emergency Whistle', quantity: 1 },
      { name: 'Duct Tape (small roll)', quantity: 1 },

      // First Aid
      { name: 'Adventure Medical Kits Ultralight .7', quantity: 1 },
      { name: 'Ibuprofen (10 tablets)', quantity: 1 },

      // Hygiene
      { name: 'Dr. Bronners Soap (small)', quantity: 1 },
      { name: 'Toilet Paper (partial roll)', quantity: 1 },
      { name: 'Trowel (lightweight)', quantity: 1 },
      { name: 'Toothbrush (cut down)', quantity: 1 },
      { name: 'Toothpaste (travel size)', quantity: 1 },

      // Tools
      { name: 'Leatherman Squirt PS4', quantity: 1 },

      // Food (4 days worth)
      { name: 'Mountain House Meals', quantity: 4 },
      { name: 'Instant Oatmeal Packets', quantity: 4 },
      { name: 'Energy Bars', quantity: 12 },
      { name: 'Trail Mix', quantity: 1 },
      { name: 'Instant Coffee Packets', quantity: 8 },
      { name: 'Electrolyte Powder', quantity: 1 },

      // Miscellaneous
      { name: 'Ziploc Bags (various)', quantity: 5 },
      { name: 'Paracord (10 feet)', quantity: 1 },
    ];

    let addedItems = 0;
    for (const packItem of packListItems) {
      const gearItem = gearItems.find(g => g.name === packItem.name);
      if (gearItem) {
        await prisma.packListItem.create({
          data: {
            packListId: fourDayLoadout.id,
            gearItemId: gearItem.id,
            quantity: packItem.quantity,
            isIncluded: true,
          }
        });
        console.log(`  ✓ Added: ${packItem.name} (${packItem.quantity}x)`);
        addedItems++;
      } else {
        console.log(`  ⚠ Not found: ${packItem.name}`);
      }
    }

    // Create additional pack lists
    const dayHike = await prisma.packList.create({
      data: {
        name: 'Day Hike Essentials',
        description: 'Lightweight day hiking pack with essentials',
        userId: user.id,
        isPublic: false,
      }
    });

    console.log('✓ Created pack list: Day Hike Essentials');

    // Add day hike items
    const dayHikeItems = [
      { name: 'Waymark EVLV - 35', quantity: 1 },
      { name: 'Platypus Big Zip LP', quantity: 1 },
      { name: 'Sawyer Squeeze Water Filter', quantity: 1 },
      { name: 'iPhone 14 Pro', quantity: 1 },
      { name: 'Petzl Actik Core Headlamp', quantity: 1 },
      { name: 'Garmin inReach Mini 2', quantity: 1 },
      { name: 'Emergency Whistle', quantity: 1 },
      { name: 'Adventure Medical Kits Ultralight .7', quantity: 1 },
      { name: 'Energy Bars', quantity: 2 },
      { name: 'Electrolyte Powder', quantity: 1 },
      { name: 'Patagonia Houdini Windbreaker', quantity: 1 },
    ];

    let dayHikeAdded = 0;
    for (const packItem of dayHikeItems) {
      const gearItem = gearItems.find(g => g.name === packItem.name);
      if (gearItem) {
        await prisma.packListItem.create({
          data: {
            packListId: dayHike.id,
            gearItemId: gearItem.id,
            quantity: packItem.quantity,
            isIncluded: true,
          }
        });
        console.log(`  ✓ Added: ${packItem.name} (${packItem.quantity}x)`);
        dayHikeAdded++;
      }
    }

    // Create weekend backpacking list
    const weekendBackpacking = await prisma.packList.create({
      data: {
        name: 'Weekend Backpacking',
        description: '2-3 day backpacking trip with reduced food and consumables',
        userId: user.id,
        isPublic: false,
      }
    });

    console.log('✓ Created pack list: Weekend Backpacking');

    // Add weekend items (similar to 4-day but less food)
    const weekendItems = [
      // Pack & Shelter
      { name: 'Nylofume® Pack Liner', quantity: 1 },
      { name: 'Waymark EVLV - 35', quantity: 1 },
      { name: 'Zpacks Duplex', quantity: 1 },
      { name: 'MSR Groundhog Stakes', quantity: 8 },

      // Sleep System
      { name: 'Western Mountaineering UltraLite', quantity: 1 },
      { name: 'Therm-a-Rest NeoAir XLite', quantity: 1 },
      { name: 'Sea to Summit Aeros Pillow Premium', quantity: 1 },

      // Cook
      { name: 'MSR PocketRocket 2', quantity: 1 },
      { name: 'MSR Titan Kettle', quantity: 1 },
      { name: 'MSR Isopro Fuel Canister', quantity: 1 },
      { name: 'Light My Fire Spork', quantity: 1 },
      { name: 'Sea to Summit X-Mug', quantity: 1 },

      // Water
      { name: 'Platypus Big Zip LP', quantity: 1 },
      { name: 'Sawyer Squeeze Water Filter', quantity: 1 },

      // Electronics & Navigation
      { name: 'iPhone 14 Pro', quantity: 1 },
      { name: 'Anker PowerCore 10000', quantity: 1 },
      { name: 'Lightning Cable', quantity: 1 },
      { name: 'Petzl Actik Core Headlamp', quantity: 1 },
      { name: 'Garmin inReach Mini 2', quantity: 1 },

      // Safety & First Aid
      { name: 'Emergency Whistle', quantity: 1 },
      { name: 'Adventure Medical Kits Ultralight .7', quantity: 1 },

      // Hygiene (reduced)
      { name: 'Toilet Paper (partial roll)', quantity: 1 },
      { name: 'Trowel (lightweight)', quantity: 1 },
      { name: 'Toothbrush (cut down)', quantity: 1 },

      // Tools
      { name: 'Leatherman Squirt PS4', quantity: 1 },

      // Food (2-3 days)
      { name: 'Mountain House Meals', quantity: 2 },
      { name: 'Instant Oatmeal Packets', quantity: 2 },
      { name: 'Energy Bars', quantity: 6 },
      { name: 'Instant Coffee Packets', quantity: 4 },

      // Clothing (pack extras)
      { name: 'Smartwool Merino 150 Base Layer', quantity: 1 },
      { name: 'Darn Tough Vermont Merino Socks', quantity: 1 },
    ];

    let weekendAdded = 0;
    for (const packItem of weekendItems) {
      const gearItem = gearItems.find(g => g.name === packItem.name);
      if (gearItem) {
        await prisma.packListItem.create({
          data: {
            packListId: weekendBackpacking.id,
            gearItemId: gearItem.id,
            quantity: packItem.quantity,
            isIncluded: true,
          }
        });
        weekendAdded++;
      }
    }

    console.log(`  ✓ Added ${weekendAdded} items to Weekend Backpacking`);

    console.log(`\n✅ Pack lists created successfully!`);
    console.log(`   4 Day Loadout: ${addedItems} items`);
    console.log(`   Day Hike Essentials: ${dayHikeAdded} items`);
    console.log(`   Weekend Backpacking: ${weekendAdded} items`);

  } catch (error) {
    console.error('Error creating pack lists:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the pack list creation
createPackLists();