import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

//GET: Get all workoutSessions for a user //

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch workout sessions for the logged-in user, including exercises
    const workoutSessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: {
        workoutExercises: {
          include: {
            exercise: true, // Fetch exercise details
          },
        },
      },
      orderBy: { date: 'desc' }, // Sort by latest date
    });

    return NextResponse.json(workoutSessions, { status: 200 });
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//POST:Add new workoutSession //

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id; // Get logged-in user's ID

    const { name, date, exercises } = await req.json();

    // Validate request body
    if (
      !name ||
      !date ||
      !Array.isArray(exercises) ||
      exercises.length === 0 ||
      !userId
    ) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // ✅ 1️⃣ Check if userId exists in the database
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
    }

    // 1️⃣ Validate that all exerciseIds exist in the database
    const exerciseIds = exercises.map((e) => e.exerciseId);
    const validExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });

    const validExerciseIds = validExercises.map((e) => e.id);
    const invalidExerciseIds = exerciseIds.filter(
      (id) => !validExerciseIds.includes(id)
    );

    if (invalidExerciseIds.length > 0) {
      return NextResponse.json(
        { error: `Invalid exercise IDs: ${invalidExerciseIds.join(', ')}` },
        { status: 400 }
      );
    }

    // 2️⃣ Insert a new workout session
    const newWorkoutSession = await prisma.workoutSession.create({
      data: { userId, name, date },
    });

    // 3️⃣ Insert each exercise into workoutExercise table
    const workoutExercises = await Promise.all(
      exercises.map(async (exercise) => {
        return prisma.workoutExercise.create({
          data: {
            workoutSessionId: newWorkoutSession.id,
            exerciseId: exercise.exerciseId,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
          },
        });
      })
    );

    // 4️⃣ Return the created workout session with exercises
    return NextResponse.json(
      {
        id: newWorkoutSession.id,
        userId: newWorkoutSession.userId,
        name: newWorkoutSession.name,
        date: newWorkoutSession.date,
        exercises: workoutExercises,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating workout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
