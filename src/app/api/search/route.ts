import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.toLowerCase();

    // Search gear items
    const gearItems = await prisma.gearItem.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 10,
    });

    // Search pack lists
    const packLists = await prisma.packList.findMany({
      where: {
        userId: session.user.id,
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        items: {
          include: {
            gearItem: true,
          },
        },
      },
      take: 10,
    });

    // Format results
    const gearResults = gearItems.map((item) => ({
      id: item.id,
      type: 'gear' as const,
      title: item.name,
      description: item.description || undefined,
      metadata: {
        weight: item.weight,
        category: item.category.name,
      },
    }));

    const packListResults = packLists.map((list) => {
      const includedItems = list.items.filter((item: any) => item.isIncluded);
      const totalWeight = includedItems.reduce(
        (sum: number, item: any) => sum + item.gearItem.weight * item.quantity,
        0
      );

      return {
        id: list.id,
        type: 'pack-list' as const,
        title: list.name,
        description: list.description || undefined,
        metadata: {
          itemCount: includedItems.length,
          totalWeight,
        },
      };
    });

    const results = [...gearResults, ...packListResults];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}