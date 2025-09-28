import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createRetailerLinkSchema = z.object({
  name: z.string().min(1, 'Retailer name is required'),
  url: z.string().url('Valid URL is required'),
  price: z.number().positive().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const gearItemId = resolvedParams.id;

    // Verify gear item belongs to user
    const gearItem = await prisma.gearItem.findUnique({
      where: { id: gearItemId },
      select: { userId: true },
    });

    if (!gearItem || gearItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, url, price } = createRetailerLinkSchema.parse(body);

    // Create retailer link
    await prisma.retailerLink.create({
      data: {
        gearItemId,
        name,
        url,
        price,
        lastChecked: price ? new Date() : null,
      },
    });

    // Return updated list of retailer links
    const retailerLinks = await prisma.retailerLink.findMany({
      where: { gearItemId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(retailerLinks);
  } catch (error) {
    console.error('Error creating retailer link:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create retailer link' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const gearItemId = resolvedParams.id;

    // Verify gear item belongs to user
    const gearItem = await prisma.gearItem.findUnique({
      where: { id: gearItemId },
      select: { userId: true },
    });

    if (!gearItem || gearItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Gear item not found' },
        { status: 404 }
      );
    }

    const retailerLinks = await prisma.retailerLink.findMany({
      where: { gearItemId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(retailerLinks);
  } catch (error) {
    console.error('Error fetching retailer links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch retailer links' },
      { status: 500 }
    );
  }
}
