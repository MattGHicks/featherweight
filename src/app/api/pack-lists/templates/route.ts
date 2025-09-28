import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch public templates and user's own templates
    const templates = await prisma.packListTemplate.findMany({
      where: {
        OR: [{ isPublic: true }, { createdBy: session.user.id }],
      },
      include: {
        templateItems: {
          include: {
            category: {
              select: {
                name: true,
                color: true,
              },
            },
          },
          orderBy: {
            priority: 'asc',
          },
        },
      },
      orderBy: [
        { isPublic: 'desc' }, // Public templates first
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching pack list templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
