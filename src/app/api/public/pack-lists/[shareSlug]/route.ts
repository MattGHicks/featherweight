import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    shareSlug: string;
  }>;
}

function calculatePackListStats(
  items: Array<{
    isIncluded: boolean;
    gearItem: { weight: number; isConsumable: boolean; isWorn: boolean };
    quantity: number;
  }>
) {
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { shareSlug } = await params;

  try {
    // Find public pack list by share slug
    const packList = await prisma.packList.findFirst({
      where: {
        shareSlug,
        isPublic: true,
      },
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
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!packList) {
      return NextResponse.json(
        { error: 'Pack list not found or not public' },
        { status: 404 }
      );
    }

    const stats = calculatePackListStats(packList.items);

    return NextResponse.json({
      ...packList,
      stats,
    });
  } catch (error) {
    console.error('Error fetching public pack list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pack list' },
      { status: 500 }
    );
  }
}
