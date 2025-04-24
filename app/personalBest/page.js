'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PersonalBestPage() {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [personalBest, setPersonalBest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      const res = await fetch('/api/exercises');
      const data = await res.json();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  // Fetch personal best when exercise is selected
  useEffect(() => {
    if (!selectedExerciseId) return;

    const fetchPersonalBest = async () => {
      setLoading(true);
      const res = await fetch(`/api/personalBest/${selectedExerciseId}`);
      const data = await res.json();
      setPersonalBest(data);
      setLoading(false);
    };

    fetchPersonalBest();
  }, [selectedExerciseId]);

  const adjustDateByHours = (dateString, hours = 6) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">My Personal Best</h1>

      <label htmlFor="exercise" className="block mb-2 font-medium">
        Select an exercise:
      </label>
      <select
        id="exercise"
        value={selectedExerciseId}
        onChange={(e) => setSelectedExerciseId(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      >
        <option value="">-- Choose an exercise --</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name} ({exercise.category.name})
          </option>
        ))}
      </select>

      {loading && <p>Loading personal best...</p>}

      {!loading && personalBest?.exercise && personalBest?.workoutSession ? (
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <p className="flex items-center">
            <strong> PR Weight:</strong> {personalBest.weight} lbs{' '}
            <Image
              className="ml-1"
              src="/trophy.png"
              alt="Dumbbell"
              width={22}
              height={22}
            />
          </p>
          <p>
            <strong>Reps:</strong> {personalBest.reps}
          </p>
          <p>
            <strong>Sets:</strong> {personalBest.sets}
          </p>
          <p>
            <strong>Session:</strong> {personalBest.workoutSession.name}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {adjustDateByHours(
              personalBest.workoutSession.date
            ).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>No personal best found yet for this exercise.</p>
      )}
    </div>
  );
}
