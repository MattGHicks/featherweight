import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createGearItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  weight: z.number().positive('Weight must be positive'),
  quantity: z.number().int().positive().default(1),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isWorn: z.boolean().default(false),
  isConsumable: z.boolean().default(false),
  retailerUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where = {
      userId: session.user.id,
      ...(categoryId && { categoryId }),
    };

    const gearItems = await prisma.gearItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(gearItems);
  } catch (error) {
    console.error('Error fetching gear items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gear items' },
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
    const validatedData = createGearItemSchema.parse(body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    const gearItem = await prisma.gearItem.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        imageUrl: validatedData.imageUrl || null,
        retailerUrl: validatedData.retailerUrl || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(gearItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating gear item:', error);
    return NextResponse.json(
      { error: 'Failed to create gear item' },
      { status: 500 }
    );
  }
}
