import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 🔹 GET: Fetch a single exercise by ID
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exerciseId = parseInt(params.id); // Get ID from URL

    // Fetch exercise from the database
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    // Handle not found
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise, { status: 200 });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 🔹 PUT: Update an existing exercise
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, categoryId } = await req.json();
    const exerciseId = parseInt(params.id); // Get ID from URL

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure exercise exists
    const existingExercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Ensure category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update the exercise
    const updatedExercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: { name, categoryId },
    });

    return NextResponse.json(updatedExercise, { status: 200 });
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 🔹 DELETE: Remove an exercise
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exerciseId = parseInt(params.id);

    // Ensure exercise exists before deleting
    const existingExercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    await prisma.exercise.delete({ where: { id: exerciseId } });

    return NextResponse.json(
      { message: 'Exercise deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
