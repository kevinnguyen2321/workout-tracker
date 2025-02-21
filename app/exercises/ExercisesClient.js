'use client';

import { useState } from 'react';

export default function ExercisesClient({ categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({});

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
      console.log('New exercise added:', await response.json());

      setIsModalOpen(false);
      setNewExercise({});
    } catch (error) {
      console.error('Error adding new exercise:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <button
        className="text-4xl border-2 border-black p-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>
      <h1 className="text-3xl font-bold mb-4">Exercises</h1>

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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
