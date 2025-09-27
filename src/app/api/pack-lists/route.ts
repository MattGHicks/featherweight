import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createPackListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packLists = await prisma.packList.findMany({
      where: {
        userId: session.user.id,
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
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate total weights for each pack list
    const packListsWithStats = packLists.map(packList => {
      const totalWeight = packList.items.reduce((sum, item) => {
        if (item.isIncluded) {
          return sum + item.gearItem.weight * item.quantity;
        }
        return sum;
      }, 0);

      const baseWeight = packList.items.reduce((sum, item) => {
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
        ...packList,
        stats: {
          totalWeight,
          baseWeight,
          itemCount: packList._count.items,
        },
      };
    });

    return NextResponse.json(packListsWithStats);
  } catch (error) {
    console.error('Error fetching pack lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pack lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPackListSchema.parse(body);

    // Generate share slug if public
    const shareSlug = validatedData.isPublic
      ? `${validatedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`
      : null;

    const packList = await prisma.packList.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        shareSlug,
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
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ...packList,
        stats: {
          totalWeight: 0,
          baseWeight: 0,
          itemCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating pack list:', error);
    return NextResponse.json(
      { error: 'Failed to create pack list' },
      { status: 500 }
    );
  }
}
