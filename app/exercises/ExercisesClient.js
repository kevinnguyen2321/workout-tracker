'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExercisesClient({ categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({});
  const [exercises, setExercises] = useState([]);

  const router = useRouter();

  // 🔹 Fetch exercises when component mounts
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises'); // Calls your GET API
        if (!response.ok) throw new Error('Failed to fetch exercises');
        const data = await response.json();
        setExercises(data); // Update state with fetched exercises
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []); // Empty dependency array -> Runs once on mount

  //Event handlers//

  const handleOnChange = (e) => {
    const copyObj = { ...newExercise };
    if (e.target.name === 'categoryId') {
      copyObj[e.target.name] = parseInt(e.target.value);
    } else {
      copyObj[e.target.name] = e.target.value;
    }
    setNewExercise(copyObj);
  };

  const handleSaveBtnClick = async (e) => {
    e.preventDefault();
    if (!newExercise.name || !newExercise.categoryId) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const addedExercise = await response.json(); // ✅ Store JSON in a variable

      console.log('New exercise added:', addedExercise); // ✅ Log the stored variable

      // 🔹 Update state instead of relying on router.refresh()
      setExercises((prevExercises) => [...prevExercises, addedExercise]);

      setIsModalOpen(false);
      setNewExercise({});
    } catch (error) {
      console.error('Error adding new exercise:', error);
    }
  };

  const handleEditBtnClick = (id) => {
    router.push(`/exercises/${id}`);
  };

  const handleDeleteBtnClick = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this exercise?'
    );

    if (confirmDelete) {
      try {
        const res = await fetch(`/api/exercises/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Optionally, you can refresh the list of exercises here or update the state
          setExercises(exercises.filter((exercise) => exercise.id !== id));
        } else {
          alert('Failed to delete exercise');
        }
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('An error occurred while deleting the exercise.');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-11  h-screen">
      <button
        className="text-4xl border-2 border-black p-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>
      <h1 className="text-3xl font-bold mb-4">Exercises</h1>

      {/* 🔹 Display all fetched exercises */}
      <ul className="mb-6">
        {exercises.map((exercise) => (
          <li key={exercise.id} className="text-xl">
            {exercise.name} -{' '}
            {`(${
              categories.find((c) => c.id === exercise.categoryId)?.name ||
              'Unknown Category'
            })`}
            <button
              onClick={() => handleEditBtnClick(exercise.id)}
              className="bg-yellow-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteBtnClick(exercise.id)}
              className="bg-red-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Exercise</h2>
            <form>
              <label className="block mb-2 text-lg">Exercise Name:</label>
              <input
                type="text"
                placeholder="Enter exercise name"
                className="w-full p-2 border rounded mb-4"
                name="name"
                onChange={handleOnChange}
              />
              <label className="block mb-2 text-lg">Category:</label>
              <select
                className="w-full p-2 border rounded mb-4"
                name="categoryId"
                onChange={handleOnChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSaveBtnClick}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
