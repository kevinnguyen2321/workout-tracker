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
                <button className="bg-red-300 px-4 py-2 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
