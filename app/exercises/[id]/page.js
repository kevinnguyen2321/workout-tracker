'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExerciseEditPage({ params }) {
  const router = useRouter();

  const [exercise, setExercise] = useState({ name: '', categoryId: '' });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Fetch categories for dropdown
  const [id, setId] = useState(null); // State to store the exercise ID

  // Fetch and unwrap params using React.use()
  const { id: exerciseId } = React.use(params); // Using React.use() to unwrap the params

  // Fetch the exercise data when the page loads
  useEffect(() => {
    const fetchExerciseAndCategories = async () => {
      try {
        if (!exerciseId) return; // Make sure exerciseId is available

        // Fetch the exercise data using the ID
        const exerciseRes = await fetch(`/api/exercises/${exerciseId}`);
        if (!exerciseRes.ok) throw new Error('Failed to fetch exercise');
        const exerciseData = await exerciseRes.json();
        setExercise(exerciseData);

        // Fetch categories for the dropdown
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Set the ID after fetching
        setId(parseInt(exerciseId, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchExerciseAndCategories(); // Run the async function
  }, [exerciseId]); // Re-run the effect when exerciseId changes

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If it's the categoryId, parse it as an integer
    const newValue = name === 'categoryId' ? parseInt(value, 10) : value;

    setExercise({ ...exercise, [name]: newValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (!res.ok) throw new Error('Failed to update exercise');

      router.push('/exercises'); // Redirect back to the exercises page
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Exercise</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Name Input */}
        <div>
          <label className="block font-medium">Exercise Name:</label>
          <input
            type="text"
            name="name"
            value={exercise.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block font-medium">Category:</label>
          <select
            name="categoryId"
            value={exercise.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => router.push('/exercises')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
