import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateGoalsSchema = z.object({
  baseWeightGoal: z.number().positive().optional(),
  totalWeightGoal: z.number().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        baseWeightGoal: true,
        totalWeightGoal: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      baseWeightGoal: user.baseWeightGoal,
      totalWeightGoal: user.totalWeightGoal,
    });
  } catch (error) {
    console.error('Error fetching user goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { baseWeightGoal, totalWeightGoal } = updateGoalsSchema.parse(body);

    // Build update object with only provided fields
    const updateData: any = {};
    if (baseWeightGoal !== undefined) updateData.baseWeightGoal = baseWeightGoal;
    if (totalWeightGoal !== undefined) updateData.totalWeightGoal = totalWeightGoal;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        baseWeightGoal: true,
        totalWeightGoal: true,
      },
    });

    return NextResponse.json({
      baseWeightGoal: user.baseWeightGoal,
      totalWeightGoal: user.totalWeightGoal,
    });
  } catch (error) {
    console.error('Error updating user goals:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update goals' },
      { status: 500 }
    );
  }
}