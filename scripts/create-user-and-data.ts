import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUserAndData() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'mattghicks@gmail.com',
        name: 'Matt Hicks',
        preferredUnits: 'imperial',
        baseWeightGoal: 4536, // 10 lbs in grams
        totalWeightGoal: 9072, // 20 lbs in grams
      }
    });

    console.log(`Created user: ${user.email} (${user.id})`);

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Comprehensive gear data
    const gearData = [
      // Shelter
      { name: 'Zpacks Duplex Tent', description: 'Ultralight 2-person DCF tent', weight: 595, categoryId: categoryMap['Shelter'], isWorn: false, isConsumable: false, retailerUrl: 'https://zpacks.com/products/duplex-tent' },
      { name: 'Big Agnes Fly Creek HV UL1', description: 'Lightweight 1-person tent', weight: 907, categoryId: categoryMap['Shelter'] },
      { name: 'Tarp Tent Protrail', description: 'Single wall ultralight tent', weight: 740, categoryId: categoryMap['Shelter'] },
      { name: 'MSR Hubba Hubba NX', description: 'Freestanding 2-person tent', weight: 1540, categoryId: categoryMap['Shelter'] },
      { name: 'Zpacks Plexamid', description: 'Single person pyramid tent', weight: 425, categoryId: categoryMap['Shelter'] },

      // Sleep System
      { name: 'Western Mountaineering Ultralite', description: '20°F down sleeping bag', weight: 680, categoryId: categoryMap['Sleep System'] },
      { name: 'Enlightened Equipment Revelation', description: '20°F down quilt', weight: 515, categoryId: categoryMap['Sleep System'] },
      { name: 'Thermarest NeoAir Xlite', description: 'Ultralight inflatable sleeping pad', weight: 350, categoryId: categoryMap['Sleep System'] },
      { name: 'Klymit Static V', description: 'Lightweight sleeping pad', weight: 510, categoryId: categoryMap['Sleep System'] },
      { name: 'Sea to Summit Aeros Pillow', description: 'Ultralight inflatable pillow', weight: 75, categoryId: categoryMap['Sleep System'] },
      { name: 'Zpacks Medium Pillow', description: 'Ultralight pillow', weight: 40, categoryId: categoryMap['Sleep System'] },

      // Backpack
      { name: 'Zpacks Arc Blast', description: '60L frameless ultralight pack', weight: 735, categoryId: categoryMap['Backpack'] },
      { name: 'Hyperlite Mountain Gear 2400', description: '40L ultralight pack', weight: 794, categoryId: categoryMap['Backpack'] },
      { name: 'Gossamer Gear Mariposa 60', description: 'Lightweight framed pack', weight: 1020, categoryId: categoryMap['Backpack'] },
      { name: 'Osprey Exos 58', description: 'Lightweight framed pack', weight: 1190, categoryId: categoryMap['Backpack'] },
      { name: 'ULA Circuit', description: 'Internal frame pack', weight: 1134, categoryId: categoryMap['Backpack'] },

      // Clothing
      { name: 'Patagonia Houdini Jacket', description: 'Ultralight windbreaker', weight: 95, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Arc\'teryx Atom LT Vest', description: 'Insulated vest', weight: 285, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Smartwool Merino 150 Base Layer', description: 'Merino wool base layer', weight: 140, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Patagonia Strider Pro Shorts', description: 'Running shorts', weight: 115, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Darn Tough Vermont Socks', description: 'Merino wool hiking socks', weight: 60, quantity: 2, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Outdoor Research Ferrosi Pants', description: 'Softshell hiking pants', weight: 340, categoryId: categoryMap['Clothing'], isWorn: true },
      { name: 'Salomon X Ultra 3 GTX', description: 'Waterproof hiking shoes', weight: 780, categoryId: categoryMap['Clothing'], isWorn: true },

      // Cooking
      { name: 'Jetboil Flash', description: 'Integrated stove system', weight: 371, categoryId: categoryMap['Cooking'] },
      { name: 'MSR PocketRocket 2', description: 'Ultralight canister stove', weight: 73, categoryId: categoryMap['Cooking'] },
      { name: 'Toaks Titanium 750ml Pot', description: 'Ultralight titanium cookpot', weight: 95, categoryId: categoryMap['Cooking'] },
      { name: 'MSR Titan Kettle', description: 'Lightweight titanium kettle', weight: 118, categoryId: categoryMap['Cooking'] },
      { name: 'Light My Fire Spork', description: 'Titanium spork', weight: 17, categoryId: categoryMap['Cooking'] },
      { name: 'Fuel Canister 100g', description: 'Isobutane fuel canister', weight: 180, categoryId: categoryMap['Cooking'], isConsumable: true },

      // Water
      { name: 'Sawyer Squeeze Filter', description: 'Lightweight water filter', weight: 85, categoryId: categoryMap['Water'] },
      { name: 'Katadyn BeFree 1L', description: 'Collapsible water filter', weight: 63, categoryId: categoryMap['Water'] },
      { name: 'Smart Water Bottle 1L', description: 'Lightweight water bottle', weight: 38, quantity: 2, categoryId: categoryMap['Water'] },
      { name: 'Platypus Hoser 2L', description: 'Hydration reservoir', weight: 115, categoryId: categoryMap['Water'] },
      { name: 'Aquatainer 2L', description: 'Collapsible water container', weight: 55, categoryId: categoryMap['Water'] },

      // Navigation
      { name: 'Garmin inReach Mini', description: 'Satellite communicator', weight: 100, categoryId: categoryMap['Navigation'] },
      { name: 'Suunto MC-2 Compass', description: 'Mirror compass', weight: 64, categoryId: categoryMap['Navigation'] },
      { name: 'National Geographic Topo Map', description: 'Waterproof topographic map', weight: 30, categoryId: categoryMap['Navigation'] },

      // Safety
      { name: 'Black Diamond Spot Headlamp', description: 'LED headlamp', weight: 86, categoryId: categoryMap['Safety'] },
      { name: 'Petzl e+LITE', description: 'Emergency headlamp', weight: 26, categoryId: categoryMap['Safety'] },
      { name: 'Emergency Whistle', description: 'Loud safety whistle', weight: 8, categoryId: categoryMap['Safety'] },
      { name: 'Emergency Bivvy', description: 'Ultralight emergency shelter', weight: 85, categoryId: categoryMap['Safety'] },

      // Electronics
      { name: 'iPhone 15 Pro', description: 'Smartphone with GPS', weight: 187, categoryId: categoryMap['Electronics'] },
      { name: 'Anker PowerCore 10000', description: 'Portable battery pack', weight: 180, categoryId: categoryMap['Electronics'] },
      { name: 'Goal Zero Nomad 7', description: 'Solar panel charger', weight: 360, categoryId: categoryMap['Electronics'] },
      { name: 'USB-C Cable', description: 'Charging cable', weight: 25, categoryId: categoryMap['Electronics'] },

      // Hygiene
      { name: 'Dr. Bronner\'s Soap', description: 'Biodegradable soap', weight: 15, categoryId: categoryMap['Hygiene'], isConsumable: true },
      { name: 'Toothbrush', description: 'Ultralight toothbrush', weight: 5, categoryId: categoryMap['Hygiene'] },
      { name: 'Toothpaste Tablets', description: 'Toothpaste tablets', weight: 20, categoryId: categoryMap['Hygiene'], isConsumable: true },
      { name: 'Toilet Paper', description: 'Biodegradable TP', weight: 30, categoryId: categoryMap['Hygiene'], isConsumable: true },
      { name: 'Trowel', description: 'Lightweight camp trowel', weight: 45, categoryId: categoryMap['Hygiene'] },

      // First Aid
      { name: 'Adventure Medical Ultralight', description: 'Ultralight first aid kit', weight: 85, categoryId: categoryMap['First Aid'] },
      { name: 'Ibuprofen', description: 'Pain reliever', weight: 10, categoryId: categoryMap['First Aid'], isConsumable: true },
      { name: 'Band-Aids', description: 'Adhesive bandages', weight: 5, quantity: 10, categoryId: categoryMap['First Aid'], isConsumable: true },
      { name: 'Duct Tape', description: 'Multi-purpose tape', weight: 15, categoryId: categoryMap['First Aid'] },

      // Tools
      { name: 'Leatherman Squirt PS4', description: 'Ultralight multi-tool', weight: 56, categoryId: categoryMap['Tools'] },
      { name: 'Opinel No. 8', description: 'Lightweight folding knife', weight: 45, categoryId: categoryMap['Tools'] },
      { name: 'Paracord 25ft', description: 'Utility cord', weight: 60, categoryId: categoryMap['Tools'] },
      { name: 'Safety Pins', description: 'Assorted safety pins', weight: 5, quantity: 6, categoryId: categoryMap['Tools'] },

      // Food (consumables)
      { name: 'Mountain House Beef Stroganoff', description: 'Freeze-dried meal', weight: 142, categoryId: categoryMap['Food'], isConsumable: true },
      { name: 'Peak Refuel Chicken Pesto', description: 'Freeze-dried meal', weight: 113, categoryId: categoryMap['Food'], isConsumable: true },
      { name: 'Clif Bars', description: 'Energy bars', weight: 68, quantity: 6, categoryId: categoryMap['Food'], isConsumable: true },
      { name: 'Trail Mix', description: 'Mixed nuts and dried fruit', weight: 454, categoryId: categoryMap['Food'], isConsumable: true },
      { name: 'Instant Oatmeal', description: 'Quick breakfast', weight: 43, quantity: 3, categoryId: categoryMap['Food'], isConsumable: true },
      { name: 'Peanut Butter', description: 'Individual packets', weight: 32, quantity: 4, categoryId: categoryMap['Food'], isConsumable: true },

      // Miscellaneous
      { name: 'Lightweight Stuff Sacks', description: 'Organization sacks', weight: 25, quantity: 3, categoryId: categoryMap['Miscellaneous'] },
      { name: 'Carabiners', description: 'Aluminum carabiners', weight: 12, quantity: 4, categoryId: categoryMap['Miscellaneous'] },
      { name: 'Ziploc Bags', description: 'Waterproof storage', weight: 5, quantity: 5, categoryId: categoryMap['Miscellaneous'] },
      { name: 'Trash Bag', description: 'Leave no trace', weight: 8, categoryId: categoryMap['Miscellaneous'] },
    ];

    console.log('Adding gear items...');

    // Add all gear items
    for (const gear of gearData) {
      await prisma.gearItem.create({
        data: {
          ...gear,
          userId: user.id,
          quantity: gear.quantity || 1,
          isWorn: gear.isWorn || false,
          isConsumable: gear.isConsumable || false,
        }
      });
    }

    console.log(`Added ${gearData.length} gear items`);

    // Get some gear items for pack lists
    const gearItems = await prisma.gearItem.findMany({
      where: { userId: user.id },
      include: { category: true }
    });

    // Create pack lists
    const packLists = [
      {
        name: 'Sierra Nevada 3-Day',
        description: 'Late summer backpacking in the Sierra Nevada mountains',
        items: [
          'Zpacks Duplex Tent',
          'Enlightened Equipment Revelation',
          'Thermarest NeoAir Xlite',
          'Sea to Summit Aeros Pillow',
          'Zpacks Arc Blast',
          'Patagonia Houdini Jacket',
          'Smartwool Merino 150 Base Layer',
          'Patagonia Strider Pro Shorts',
          'Darn Tough Vermont Socks',
          'Salomon X Ultra 3 GTX',
          'MSR PocketRocket 2',
          'Toaks Titanium 750ml Pot',
          'Light My Fire Spork',
          'Fuel Canister 100g',
          'Sawyer Squeeze Filter',
          'Smart Water Bottle 1L',
          'Black Diamond Spot Headlamp',
          'iPhone 15 Pro',
          'Anker PowerCore 10000',
          'Adventure Medical Ultralight',
          'Leatherman Squirt PS4',
          'Mountain House Beef Stroganoff',
          'Peak Refuel Chicken Pesto',
          'Clif Bars',
          'Trail Mix',
          'Instant Oatmeal'
        ]
      },
      {
        name: 'PCT Section Hike',
        description: 'Week-long section hike on the Pacific Crest Trail',
        items: [
          'Tarp Tent Protrail',
          'Western Mountaineering Ultralite',
          'Thermarest NeoAir Xlite',
          'Zpacks Medium Pillow',
          'Hyperlite Mountain Gear 2400',
          'Arc\'teryx Atom LT Vest',
          'Outdoor Research Ferrosi Pants',
          'Darn Tough Vermont Socks',
          'Jetboil Flash',
          'Katadyn BeFree 1L',
          'Platypus Hoser 2L',
          'Garmin inReach Mini',
          'Petzl e+LITE',
          'Goal Zero Nomad 7',
          'Dr. Bronner\'s Soap',
          'Toothbrush',
          'Adventure Medical Ultralight',
          'Opinel No. 8'
        ]
      },
      {
        name: 'Day Hike - Local Trails',
        description: 'Day hiking essentials for local trail networks',
        items: [
          'Osprey Exos 58',
          'Patagonia Houdini Jacket',
          'Patagonia Strider Pro Shorts',
          'Salomon X Ultra 3 GTX',
          'Smart Water Bottle 1L',
          'Clif Bars',
          'iPhone 15 Pro',
          'Black Diamond Spot Headlamp',
          'Emergency Whistle',
          'Suunto MC-2 Compass',
          'National Geographic Topo Map'
        ]
      },
      {
        name: 'Overnight Car Camping',
        description: 'Relaxed car camping setup with extra comfort',
        items: [
          'MSR Hubba Hubba NX',
          'Western Mountaineering Ultralite',
          'Klymit Static V',
          'MSR Titan Kettle',
          'Jetboil Flash',
          'Smart Water Bottle 1L',
          'Mountain House Beef Stroganoff',
          'Peak Refuel Chicken Pesto',
          'Anker PowerCore 10000',
          'Adventure Medical Ultralight'
        ]
      },
      {
        name: 'Alpine Climbing',
        description: 'Gear for technical alpine climbing routes',
        items: [
          'Zpacks Plexamid',
          'Emergency Bivvy',
          'Thermarest NeoAir Xlite',
          'ULA Circuit',
          'Arc\'teryx Atom LT Vest',
          'Outdoor Research Ferrosi Pants',
          'MSR PocketRocket 2',
          'Toaks Titanium 750ml Pot',
          'Smart Water Bottle 1L',
          'Garmin inReach Mini',
          'Black Diamond Spot Headlamp',
          'Petzl e+LITE',
          'Emergency Whistle',
          'Adventure Medical Ultralight',
          'Paracord 25ft',
          'Carabiners'
        ]
      }
    ];

    console.log('Creating pack lists...');

    for (const packListData of packLists) {
      // Create the pack list
      const packList = await prisma.packList.create({
        data: {
          name: packListData.name,
          description: packListData.description,
          userId: user.id,
        }
      });

      // Add items to the pack list
      for (const itemName of packListData.items) {
        const gearItem = gearItems.find(item => item.name === itemName);
        if (gearItem) {
          await prisma.packListItem.create({
            data: {
              packListId: packList.id,
              gearItemId: gearItem.id,
              quantity: 1,
              isIncluded: true,
            }
          });
        }
      }

      console.log(`Created pack list: ${packListData.name} with ${packListData.items.length} items`);
    }

    console.log('\n🎉 Sample data creation complete!');
    console.log(`✅ Created user: ${user.email}`);
    console.log(`✅ Added ${gearData.length} gear items`);
    console.log(`✅ Created ${packLists.length} pack lists`);
    console.log('\nYou can now sign in to the app with the email: mattghicks@gmail.com');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUserAndData();