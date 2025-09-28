import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createFromTemplateSchema = z.object({
  templateId: z.string(),
  name: z.string().min(1, 'Pack list name is required'),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, name, description } = createFromTemplateSchema.parse(body);

    // Fetch the template with its items
    const template = await prisma.packListTemplate.findUnique({
      where: {
        id: templateId,
        OR: [
          { isPublic: true },
          { createdBy: session.user.id },
        ],
      },
      include: {
        templateItems: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create the pack list
    const packList = await prisma.packList.create({
      data: {
        userId: session.user.id,
        name,
        description,
      },
    });

    // For each template item, try to find matching gear in user's collection
    // or create a placeholder gear item if none exists
    const packListItems = [];

    for (const templateItem of template.templateItems) {
      // Try to find existing gear item that matches the template item
      let gearItem = await prisma.gearItem.findFirst({
        where: {
          userId: session.user.id,
          categoryId: templateItem.categoryId,
          name: {
            contains: templateItem.itemName,
            mode: 'insensitive',
          },
        },
      });

      // If no matching gear item exists, create a placeholder
      if (!gearItem) {
        gearItem = await prisma.gearItem.create({
          data: {
            userId: session.user.id,
            name: templateItem.itemName,
            description: templateItem.description,
            weight: templateItem.estimatedWeight,
            quantity: 1,
            categoryId: templateItem.categoryId,
            isWorn: false,
            isConsumable: false,
          },
        });
      }

      // Add item to pack list
      const packListItem = await prisma.packListItem.create({
        data: {
          packListId: packList.id,
          gearItemId: gearItem.id,
          quantity: templateItem.quantity,
          isIncluded: templateItem.isEssential, // Essential items are included by default
        },
      });

      packListItems.push(packListItem);
    }

    // Return the created pack list with items
    const createdPackList = await prisma.packList.findUnique({
      where: { id: packList.id },
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

    return NextResponse.json(createdPackList);
  } catch (error) {
    console.error('Error creating pack list from template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create pack list from template' },
      { status: 500 }
    );
  }
}