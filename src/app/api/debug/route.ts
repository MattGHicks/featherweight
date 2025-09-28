import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const response = {
      sessionExists: !!session,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email,
    };

    if (session?.user?.id) {
      const gearCount = await prisma.gearItem.count({
        where: { userId: session.user.id }
      });

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true }
      });

      response.gearCount = gearCount;
      response.userFromDb = user;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}