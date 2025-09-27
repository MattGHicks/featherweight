import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateGearItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  weight: z.number().positive('Weight must be positive').optional(),
  quantity: z.number().int().positive().optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isWorn: z.boolean().optional(),
  isConsumable: z.boolean().optional(),
  retailerUrl: z.string().url().optional().or(z.literal('')),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function verifyGearItemOwnership(gearItemId: string, userId: string) {
  const gearItem = await prisma.gearItem.findFirst({
    where: {
      id: gearItemId,
      userId,
    },
  });

  if (!gearItem) {
    return null;
  }

  return gearItem;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gearItem = await verifyGearItemOwnership(id, session.user.id);

    if (!gearItem) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    const fullGearItem = await prisma.gearItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    return NextResponse.json(fullGearItem);
  } catch (error) {
    console.error('Error fetching gear item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gear item' },
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

    const existingGearItem = await verifyGearItemOwnership(id, session.user.id);

    if (!existingGearItem) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateGearItemSchema.parse(body);

    // If categoryId is being updated, verify it exists
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    const updatedGearItem = await prisma.gearItem.update({
      where: { id },
      data: {
        ...validatedData,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        retailerUrl:
          validatedData.retailerUrl === '' ? null : validatedData.retailerUrl,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedGearItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating gear item:', error);
    return NextResponse.json(
      { error: 'Failed to update gear item' },
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

    const existingGearItem = await verifyGearItemOwnership(id, session.user.id);

    if (!existingGearItem) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    await prisma.gearItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Gear item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gear item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gear item' },
      { status: 500 }
    );
  }
}
