import ExercisesClient from './ExercisesClient';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Unauthorized</p>;
  }

  const categories = await prisma.category.findMany(); // Fetch categories directly from DB

  return <ExercisesClient categories={categories} />;
}
