import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const bulkUpdateSchema = z.object({
  itemIds: z.array(z.string()),
  updates: z.object({
    weight: z.number().positive().optional(),
    quantity: z.number().positive().optional(),
    categoryId: z.string().optional(),
    isWorn: z.boolean().optional(),
    isConsumable: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

const bulkDeleteSchema = z.object({
  itemIds: z.array(z.string()),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemIds, updates } = bulkUpdateSchema.parse(body);

    if (itemIds.length === 0) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 });
    }

    // Verify all items belong to the user
    const items = await prisma.gearItem.findMany({
      where: {
        id: { in: itemIds },
        userId: session.user.id,
      },
    });

    if (items.length !== itemIds.length) {
      return NextResponse.json({ error: 'Some items not found or unauthorized' }, { status: 404 });
    }

    // If categoryId is provided, verify it exists
    if (updates.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updates.categoryId },
      });

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    // Build the update object, only including fields that were provided
    const updateData: any = {};
    if (updates.weight !== undefined) updateData.weight = updates.weight;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.categoryId !== undefined) updateData.categoryId = updates.categoryId;
    if (updates.isWorn !== undefined) updateData.isWorn = updates.isWorn;
    if (updates.isConsumable !== undefined) updateData.isConsumable = updates.isConsumable;
    if (updates.description !== undefined) updateData.description = updates.description;

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Perform bulk update
    const result = await prisma.gearItem.updateMany({
      where: {
        id: { in: itemIds },
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: `Successfully updated ${result.count} items`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Bulk update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update items' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemIds } = bulkDeleteSchema.parse(body);

    if (itemIds.length === 0) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 });
    }

    // Verify all items belong to the user
    const items = await prisma.gearItem.findMany({
      where: {
        id: { in: itemIds },
        userId: session.user.id,
      },
    });

    if (items.length !== itemIds.length) {
      return NextResponse.json({ error: 'Some items not found or unauthorized' }, { status: 404 });
    }

    // Check if any items are currently in pack lists
    const packListItems = await prisma.packListItem.findMany({
      where: {
        gearItemId: { in: itemIds },
      },
      include: {
        packList: {
          select: {
            name: true,
          },
        },
      },
    });

    if (packListItems.length > 0) {
      // Delete pack list items first
      await prisma.packListItem.deleteMany({
        where: {
          gearItemId: { in: itemIds },
        },
      });
    }

    // Perform bulk delete
    const result = await prisma.gearItem.deleteMany({
      where: {
        id: { in: itemIds },
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} items`,
      deletedCount: result.count,
      removedFromPackLists: packListItems.length > 0 ? packListItems.length : 0,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete items' },
      { status: 500 }
    );
  }
}