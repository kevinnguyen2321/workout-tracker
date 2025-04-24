'use client';

import Image from 'next/image';
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
    // <div className="w-full flex flex-col items-center mt-11  h-screen">
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center mt-11 min-h-screen">
      <button className="mb-5" onClick={() => setIsModalOpen(true)}>
        <Image src="/plus.png" alt="Add" width={40} height={40} />
      </button>
      <h1 className="text-3xl font-bold mb-4">Exercises</h1>

      {/* 🔹 Display all fetched exercises */}
      {/* <ul className="mb-6"> */}
      <ul className="w-full space-y-4 mb-8">
        {exercises.map((exercise) => (
          <li
            key={exercise.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between text-lg border-b pb-2"
          >
            <div className="mb-2 sm:mb-0">
              {exercise.name} -{' '}
              {`(${
                categories.find((c) => c.id === exercise.categoryId)?.name ||
                'Unknown Category'
              })`}
            </div>
            <div className="flex space-x-2">
              <button
                className="ml-3"
                onClick={() => handleEditBtnClick(exercise.id)}
              >
                <Image src="/edit.png" alt="Edit" width={25} height={25} />
              </button>
              <button
                className="ml-1"
                onClick={() => handleDeleteBtnClick(exercise.id)}
              >
                <Image src="/delete.png" alt="Delete" width={25} height={25} />
              </button>
            </div>
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
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSaveBtnClick}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
