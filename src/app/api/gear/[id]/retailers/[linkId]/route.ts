import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: gearItemId, linkId } = resolvedParams;

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

    // Delete the retailer link
    await prisma.retailerLink.delete({
      where: {
        id: linkId,
        gearItemId, // Ensure link belongs to the gear item
      },
    });

    // Return updated list of retailer links
    const retailerLinks = await prisma.retailerLink.findMany({
      where: { gearItemId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(retailerLinks);
  } catch (error) {
    console.error('Error deleting retailer link:', error);
    return NextResponse.json(
      { error: 'Failed to delete retailer link' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: gearItemId, linkId } = resolvedParams;

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
    const { price } = body;

    // Update the retailer link price
    await prisma.retailerLink.update({
      where: {
        id: linkId,
        gearItemId, // Ensure link belongs to the gear item
      },
      data: {
        price: price ? parseFloat(price) : null,
        lastChecked: new Date(),
      },
    });

    // Return updated list of retailer links
    const retailerLinks = await prisma.retailerLink.findMany({
      where: { gearItemId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(retailerLinks);
  } catch (error) {
    console.error('Error updating retailer link:', error);
    return NextResponse.json(
      { error: 'Failed to update retailer link' },
      { status: 500 }
    );
  }
}
