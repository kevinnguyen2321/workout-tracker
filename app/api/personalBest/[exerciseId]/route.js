import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const exerciseId = parseInt(params.exerciseId, 10);

  try {
    const personalBest = await prisma.workoutExercise.findFirst({
      where: {
        exerciseId,
        workoutSession: {
          userId,
        },
      },
      orderBy: {
        weight: 'desc',
      },
      include: {
        workoutSession: true,
        exercise: true,
      },
    });

    if (!personalBest) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(personalBest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
