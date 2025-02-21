import ExercisesClient from './ExercisesClient';

export default async function ExercisesPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`
  );
  const categories = await response.json();

  return <ExercisesClient categories={categories} />;
}
