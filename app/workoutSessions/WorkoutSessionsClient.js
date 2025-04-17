'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WorkoutSessionsClient({ workouts }) {
  const [workoutList, setWorkoutList] = useState(workouts);
  const router = useRouter();

  const adjustDateByHours = (dateString, hours = 6) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  };

  const handleEditBtnClick = (workoutId) => {
    router.push(`/workoutSessions/${workoutId}`);
  };

  const handleDeleteBtnClick = async (workoutId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this workout? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/workoutSessions/${workoutId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete workout');
      }

      // Update the UI by removing the deleted workout from state
      setWorkoutList((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutId)
      );
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Something went wrong while deleting the workout.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Workouts</h1>

      {workoutList.length === 0 ? (
        <p className="text-gray-500">No workouts found. Start adding some!</p>
      ) : (
        <div className="grid gap-4">
          {workoutList.map((workout) => (
            <div
              key={workout.id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-semibold text-gray-700">
                {workout.name}
              </h2>
              <p className="text-gray-500">
                {adjustDateByHours(workout.date).toLocaleDateString()}
              </p>

              <ul className="mt-2">
                {workout.workoutExercises.map((ex) => (
                  <li key={ex.id} className="text-gray-600">
                    {ex.exercise.name}: {ex.sets} sets x {ex.reps} reps @{' '}
                    {ex.weight} lbs
                  </li>
                ))}
              </ul>
              <div>
                <button
                  onClick={() => handleEditBtnClick(workout.id)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  className="bg-red-300 px-4 py-2 rounded"
                  onClick={() => handleDeleteBtnClick(workout.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
