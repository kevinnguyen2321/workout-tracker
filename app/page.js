'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [exercises, setExercises] = useState([]); // All exercises from DB
  const [selectedExercises, setSelectedExercises] = useState([]); // User-selected exercises

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch('/api/exercises'); // Adjust API route if needed
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    }
    fetchExercises();
  }, []);

  if (status === 'loading') {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleAddExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      { exerciseId: '', reps: '', sets: '', weight: '' },
    ]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value;
    setSelectedExercises(updatedExercises);
  };

  const handleSubmit = async () => {
    if (!workoutName || !workoutDate || selectedExercises.length === 0) {
      alert('Please fill in all fields and add at least one exercise.');
      return;
    }
    const dateFormat = new Date(workoutDate);
    const workoutData = {
      userId: session.user.id,
      name: workoutName,
      date: dateFormat,
      exercises: selectedExercises.map((ex) => ({
        exerciseId: parseInt(ex.exerciseId),
        reps: parseInt(ex.reps),
        sets: parseInt(ex.sets),
        weight: parseInt(ex.weight),
      })),
    };

    try {
      const res = await fetch('/api/workoutSessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      if (!res.ok) {
        throw new Error('Failed to create workout session');
      }

      const result = await res.json();
      console.log('Workout created:', result);
      setShowModal(false);
      setWorkoutName('');
      setWorkoutDate('');
      setSelectedExercises([]);
    } catch (error) {
      console.error(error);
    }

    console.log(typeof dateFormat);
  };

  const handleRemoveExercise = (index) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      {/* Main content container */}
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Workout Session
        </h1>

        {/* Add Workout Button */}
        <button onClick={() => setShowModal(true)}>
          <Image src="/plus.png" alt="Add" width={40} height={40} />
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Container */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto"> */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-semibold mb-4">
                Add New Workout Session
              </h2>

              {/* Form Content */}
              <div className="space-y-4">
                {/* Workout Name Input */}
                <input
                  type="text"
                  placeholder="Workout Name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />

                {/* Workout Date Input */}
                <label htmlFor="workoutDate" className="text-gray-600">
                  Date
                </label>
                <input
                  id="workoutDate"
                  type="date"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  placeholder="Select a date"
                />

                {/* Exercises Section */}
                <h3 className="text-lg font-semibold text-gray-700">
                  Exercises
                </h3>
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 border rounded-lg relative"
                  >
                    {/* Exercise Dropdown */}
                    <select
                      className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={exercise.exerciseId}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          'exerciseId',
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Exercise</option>
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>

                    {/* Reps, Sets, Weight Inputs */}
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Sets"
                        min={0}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(index, 'sets', e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        min={0}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(index, 'reps', e.target.value)
                        }
                      />

                      <input
                        type="number"
                        placeholder="Weight (lbs)"
                        min={0}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={exercise.weight}
                        onChange={(e) =>
                          handleExerciseChange(index, 'weight', e.target.value)
                        }
                      />
                    </div>
                    {/* 🗑️ Remove Exercise Button */}
                    <button
                      className=" bg-red-500 mt-3 text-white px-2 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add Exercise Button */}
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all mb-2"
                  onClick={handleAddExercise}
                >
                  Add Exercise
                </button>

                {/* Submit Button */}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all mb-2"
                  onClick={handleSubmit}
                >
                  Save Workout
                </button>

                {/* Cancel Button */}
                <button
                  className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
