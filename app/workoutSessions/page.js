import WorkoutSessionsClient from './WorkoutSessionsClient';
import prisma from '@/lib/prisma'; // Make sure prisma is correctly set up to access your DB
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function MyWorkoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login'); // Redirect to login if no session found
  }

  // Fetch workout sessions for the logged-in user using Prisma
  try {
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id, // Filter by the logged-in user's userId
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true, // If you need to include related exercises
          },
        },
      },
      orderBy: { date: 'desc' }, // Optional: Order by date (latest first)
    });

    return <WorkoutSessionsClient workouts={workouts} />;
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    return <p>Error fetching workouts.</p>;
  }
}
