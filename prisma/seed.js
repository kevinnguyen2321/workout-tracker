const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Arms' },
      { name: 'Legs' },
      { name: 'Abs' },
      { name: 'Chest' },
      { name: 'Back' },
      { name: 'Shoulders' },
    ],
  });

  console.log('Categories seeded!');

  // Fetch categories from the database (since createMany doesn't return IDs)
  const categoryMap = {};
  const fetchedCategories = await prisma.category.findMany();
  fetchedCategories.forEach((category) => {
    categoryMap[category.name] = category.id;
  });

  // Seed exercises and assign correct category IDs
  const exercises = await prisma.exercise.createMany({
    data: [
      { name: 'Bench Press', categoryId: categoryMap['Chest'] },
      { name: 'Incline Bench Press', categoryId: categoryMap['Chest'] },
      { name: 'Dumbbell Flat Bench Press', categoryId: categoryMap['Chest'] },
      {
        name: 'Dumbbell Incline Chest Press',
        categoryId: categoryMap['Chest'],
      },
      { name: 'Low Lat Rows', categoryId: categoryMap['Back'] },
      { name: 'Chest Supported Row', categoryId: categoryMap['Back'] },
      { name: 'Squats', categoryId: categoryMap['Legs'] },
      { name: 'Leg Raises', categoryId: categoryMap['Abs'] },
      { name: 'Leg Extensions', categoryId: categoryMap['Legs'] },
      { name: 'Hamstring Curls', categoryId: categoryMap['Legs'] },
    ],
  });

  console.log('Exercises seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
