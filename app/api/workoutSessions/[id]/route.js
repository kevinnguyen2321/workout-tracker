import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma'; // Adjust the path as necessary
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
// GET workoutSession by ID//
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const parsedId = parseInt(id);

  try {
    const workoutSession = await prisma.workoutSession.findUnique({
      where: {
        id: parsedId,
        userId: session.user.id, // Only fetch workouts belonging to the logged-in user
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workoutSession) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json(workoutSession);
  } catch (error) {
    console.error('Error fetching workout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
// This function handles the PATCH request to update a workout session by ID.
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const parsedId = parseInt(id);
  console.log('ID:', parsedId);

  const { name, date, exercises } = await req.json();
  console.log('Request body:', { name, date, exercises });

  try {
    const parsedDate = date ? new Date(date) : null;
    console.log('Parsed Date:', parsedDate);

    if (parsedDate && isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const updateData = {
      ...(name && { name }),
      ...(date && { date: parsedDate }),
    };

    console.log('Update Data for Workout Session:', updateData);

    if (!updateData.name && !updateData.date) {
      return NextResponse.json(
        { error: 'Invalid data for update' },
        { status: 400 }
      );
    }

    await prisma.workoutSession.update({
      where: { id: parsedId, userId: session.user.id }, // ✅ Use correct field name
      data: updateData,
    });

    console.log('Workout session updated');

    if (Array.isArray(exercises)) {
      console.log('Exercises Array:', exercises);

      await prisma.workoutExercise.deleteMany({
        where: { workoutSessionId: parsedId },
      });

      const newWorkoutExercises = exercises.map((ex) => ({
        workoutSessionId: parsedId,
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      }));

      console.log('New Workout Exercises:', newWorkoutExercises);

      await prisma.workoutExercise.createMany({
        data: newWorkoutExercises,
      });

      console.log('Workout exercises updated');
    }

    return NextResponse.json(
      { message: 'Workout session updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating workout session:', error); // ✅ error should be valid object

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE workoutSession by ID
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const parsedId = parseInt(id);
    // First, ensure the workout belongs to the user
    const existingWorkout = await prisma.workoutSession.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!existingWorkout || existingWorkout.userId !== session.user.id) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    // Delete associated workoutExercises
    await prisma.workoutExercise.deleteMany({
      where: {
        workoutSessionId: parsedId,
      },
    });

    // Delete the workoutSession
    await prisma.workoutSession.delete({
      where: {
        id: parsedId,
      },
    });

    return NextResponse.json(
      { message: 'Workout session deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting workout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
