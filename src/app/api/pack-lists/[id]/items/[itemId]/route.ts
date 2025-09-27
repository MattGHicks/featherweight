import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updatePackListItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  isIncluded: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}

async function verifyPackListItemOwnership(
  packListId: string,
  itemId: string,
  userId: string
) {
  const packListItem = await prisma.packListItem.findFirst({
    where: {
      id: itemId,
      packListId,
      packList: {
        userId,
      },
    },
  });

  return packListItem;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, itemId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingItem = await verifyPackListItemOwnership(
      id,
      itemId,
      session.user.id
    );

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Pack list item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updatePackListItemSchema.parse(body);

    const updatedItem = await prisma.packListItem.update({
      where: { id: itemId },
      data: validatedData,
      include: {
        gearItem: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating pack list item:', error);
    return NextResponse.json(
      { error: 'Failed to update pack list item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id, itemId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingItem = await verifyPackListItemOwnership(
      id,
      itemId,
      session.user.id
    );

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Pack list item not found' },
        { status: 404 }
      );
    }

    await prisma.packListItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      message: 'Item removed from pack list successfully',
    });
  } catch (error) {
    console.error('Error removing item from pack list:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from pack list' },
      { status: 500 }
    );
  }
}
