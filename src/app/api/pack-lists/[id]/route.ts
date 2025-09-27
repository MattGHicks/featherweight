import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updatePackListSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function verifyPackListOwnership(packListId: string, userId: string) {
  const packList = await prisma.packList.findFirst({
    where: {
      id: packListId,
      userId,
    },
  });

  return packList;
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
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const shareSlug = searchParams.get('share');

    let packList;

    if (shareSlug) {
      // Public access via share slug
      packList = await prisma.packList.findFirst({
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
    } else {
      // Private access - requires authentication
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const existingPackList = await verifyPackListOwnership(
        id,
        session.user.id
      );

      if (!existingPackList) {
        return NextResponse.json(
          { error: 'Pack list not found' },
          { status: 404 }
        );
      }

      packList = await prisma.packList.findUnique({
        where: { id },
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
      });
    }

    if (!packList) {
      return NextResponse.json(
        { error: 'Pack list not found' },
        { status: 404 }
      );
    }

    const stats = calculatePackListStats(packList.items);

    return NextResponse.json({
      ...packList,
      stats,
    });
  } catch (error) {
    console.error('Error fetching pack list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pack list' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPackList = await verifyPackListOwnership(id, session.user.id);

    if (!existingPackList) {
      return NextResponse.json(
        { error: 'Pack list not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePackListSchema.parse(body);

    // Update share slug if making public/private
    let shareSlug = existingPackList.shareSlug;
    if (validatedData.isPublic !== undefined) {
      if (validatedData.isPublic && !shareSlug) {
        shareSlug = `${(validatedData.name || existingPackList.name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
      } else if (!validatedData.isPublic) {
        shareSlug = null;
      }
    }

    const updatedPackList = await prisma.packList.update({
      where: { id },
      data: {
        ...validatedData,
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
      },
    });

    const stats = calculatePackListStats(updatedPackList.items);

    return NextResponse.json({
      ...updatedPackList,
      stats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating pack list:', error);
    return NextResponse.json(
      { error: 'Failed to update pack list' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPackList = await verifyPackListOwnership(id, session.user.id);

    if (!existingPackList) {
      return NextResponse.json(
        { error: 'Pack list not found' },
        { status: 404 }
      );
    }

    await prisma.packList.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pack list deleted successfully' });
  } catch (error) {
    console.error('Error deleting pack list:', error);
    return NextResponse.json(
      { error: 'Failed to delete pack list' },
      { status: 500 }
    );
  }
}
