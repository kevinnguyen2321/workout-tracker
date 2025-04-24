'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditWorkoutForm from './EditWorkoutForm';

export default function EditWorkoutSessionPage({ params }) {
  const router = useRouter();

  const [workout, setWorkout] = useState({});
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null); // State to store the workout session ID

  // Fetch the workout session ID from the params
  const { id: workoutSessionId } = React.use(params); // Using React.use() to unwrap the params

  // Fetch the workout session data when the page loads
  useEffect(() => {
    const fetchWorkoutSession = async () => {
      try {
        if (!workoutSessionId) return; // Make sure workoutSessionId is available

        // Fetch the workout session data using the ID
        const workoutRes = await fetch(
          `/api/workoutSessions/${workoutSessionId}`
        );
        if (!workoutRes.ok) throw new Error('Failed to fetch workout session');
        const workoutData = await workoutRes.json();
        setWorkout(workoutData);

        // Set the ID after fetching
        setId(parseInt(workoutSessionId, 10));

        // Fetch all exercises
        const exercisesRes = await fetch('/api/exercises');
        if (!exercisesRes.ok) throw new Error('Failed to fetch exercises');
        const exercisesList = await exercisesRes.json();
        setAllExercises(exercisesList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchWorkoutSession(); // Run the async function
  }, [workoutSessionId]); // Re-run the effect when workoutSessionId changes

  // Handle form submission
  const handleSubmit = async (updatedWorkout) => {
    try {
      const res = await fetch(`/api/workoutSessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkout),
      });

      if (!res.ok) throw new Error('Failed to update workout session');

      router.push(`/workoutSessions/`); // Redirect to the updated workout session page
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    // <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <div className="max-h-[80vh] overflow-y-auto p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Edit Workout Session
      </h1>
      <EditWorkoutForm
        workout={workout}
        onSubmit={handleSubmit}
        allExercises={allExercises}
      />
    </div>
  );
}
