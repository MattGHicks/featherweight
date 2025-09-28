import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const preferencesSchema = z.object({
  preferredUnits: z.enum(['lbs', 'oz', 'kg', 'g']),
  baseWeightGoal: z.number().min(0).optional().nullable(),
  totalWeightGoal: z.number().min(0).optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        preferredUnits: true,
        baseWeightGoal: true,
        totalWeightGoal: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        preferredUnits: validatedData.preferredUnits,
        baseWeightGoal: validatedData.baseWeightGoal,
        totalWeightGoal: validatedData.totalWeightGoal,
      },
      select: {
        preferredUnits: true,
        baseWeightGoal: true,
        totalWeightGoal: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
