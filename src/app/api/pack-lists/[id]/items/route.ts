import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const addPackListItemSchema = z.object({
  gearItemId: z.string().min(1, 'Gear item is required'),
  quantity: z.number().int().positive().default(1),
  isIncluded: z.boolean().default(true),
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

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const validatedData = addPackListItemSchema.parse(body);

    // Verify gear item exists and belongs to user
    const gearItem = await prisma.gearItem.findFirst({
      where: {
        id: validatedData.gearItemId,
        userId: session.user.id,
      },
    });

    if (!gearItem) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in pack list
    const existingItem = await prisma.packListItem.findUnique({
      where: {
        packListId_gearItemId: {
          packListId: id,
          gearItemId: validatedData.gearItemId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already exists in pack list' },
        { status: 409 }
      );
    }

    const packListItem = await prisma.packListItem.create({
      data: {
        packListId: id,
        gearItemId: validatedData.gearItemId,
        quantity: validatedData.quantity,
        isIncluded: validatedData.isIncluded,
      },
      include: {
        gearItem: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(packListItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error adding item to pack list:', error);
    return NextResponse.json(
      { error: 'Failed to add item to pack list' },
      { status: 500 }
    );
  }
}
