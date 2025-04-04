import ExercisesClient from './ExercisesClient';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login'); // Redirect to login if no session found
  }

  const categories = await prisma.category.findMany(); // Fetch categories directly from DB

  return <ExercisesClient categories={categories} />;
}
