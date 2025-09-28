import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all gear items with their categories
    const gearItems = await prisma.gearItem.findMany({
      where: { userId: session.user.id },
      include: {
        category: true,
      },
    });

    // Get all pack lists with their items
    const packLists = await prisma.packList.findMany({
      where: { userId: session.user.id },
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
      orderBy: { createdAt: 'asc' },
    });

    // Calculate analytics
    const analytics = calculateAnalytics(gearItems, packLists);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function calculateAnalytics(gearItems: any[], packLists: any[]) {
  // Basic counts
  const totalGearItems = gearItems.length;
  const totalPackLists = packLists.length;

  // Calculate pack list stats
  const packListStats = packLists.map(packList => {
    const stats = calculatePackListStats(packList.items);
    return {
      name: packList.name,
      baseWeight: stats.baseWeight,
      totalWeight: stats.totalWeight,
      itemCount: packList.items.length,
      createdAt: packList.createdAt,
    };
  });

  const baseWeights = packListStats.map(p => p.baseWeight).filter(w => w > 0);
  const averageBaseWeight = baseWeights.length > 0
    ? baseWeights.reduce((sum, w) => sum + w, 0) / baseWeights.length
    : 0;
  const lightestBaseWeight = baseWeights.length > 0 ? Math.min(...baseWeights) : 0;
  const heaviestBaseWeight = baseWeights.length > 0 ? Math.max(...baseWeights) : 0;

  // Category breakdown
  const categoryMap = new Map();
  gearItems.forEach(item => {
    const category = item.category.name;
    const color = item.category.color;

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        category,
        weight: 0,
        count: 0,
        color,
      });
    }

    const cat = categoryMap.get(category);
    cat.weight += item.weight * item.quantity;
    cat.count += 1;
  });

  const categoryBreakdown = Array.from(categoryMap.values())
    .sort((a, b) => b.weight - a.weight);

  // Weight distribution (by ranges)
  const weightRanges = [
    { range: '0-50g', min: 0, max: 50 },
    { range: '50-100g', min: 50, max: 100 },
    { range: '100-250g', min: 100, max: 250 },
    { range: '250-500g', min: 250, max: 500 },
    { range: '500g-1kg', min: 500, max: 1000 },
    { range: '1kg+', min: 1000, max: Infinity },
  ];

  const weightDistribution = weightRanges.map(range => ({
    range: range.range,
    count: gearItems.filter(item => {
      const weight = item.weight;
      return weight >= range.min && weight < range.max;
    }).length,
  }));

  // Find heaviest items by usage
  const itemUsage = new Map();
  packLists.forEach(packList => {
    packList.items.forEach((item: any) => {
      const key = item.gearItem.id;
      if (!itemUsage.has(key)) {
        itemUsage.set(key, {
          name: item.gearItem.name,
          category: item.gearItem.category.name,
          weight: item.gearItem.weight,
          usage: 0,
        });
      }
      itemUsage.get(key).usage += 1;
    });
  });

  const topHeaviestItems = Array.from(itemUsage.values())
    .sort((a, b) => (b.weight * b.usage) - (a.weight * a.usage))
    .slice(0, 5);

  return {
    totalGearItems,
    totalPackLists,
    averageBaseWeight,
    lightestBaseWeight,
    heaviestBaseWeight,
    categoryBreakdown,
    weightDistribution,
    packListTrends: packListStats,
    topHeaviestItems,
  };
}

function calculatePackListStats(items: any[]) {
  const totalWeight = items.reduce((sum, item) => {
    if (item.isIncluded) {
      return sum + item.gearItem.weight * item.quantity;
    }
    return sum;
  }, 0);

  const baseWeight = items.reduce((sum, item) => {
    if (
      item.isIncluded &&
      !item.gearItem.isConsumable &&
      !item.gearItem.isWorn
    ) {
      return sum + item.gearItem.weight * item.quantity;
    }
    return sum;
  }, 0);

  return {
    totalWeight,
    baseWeight,
    itemCount: items.length,
  };
}