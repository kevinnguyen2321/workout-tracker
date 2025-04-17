'use client';

import { useState } from 'react';

export default function EditWorkoutForm({ workout, onSubmit, allExercises }) {
  const [name, setName] = useState(workout.name);
  const [date, setDate] = useState(workout.date.slice(0, 10)); // YYYY-MM-DD format
  const [exercises, setExercises] = useState(workout.workoutExercises || []); // Initialize with workout exercises

  // Handle input changes for the workout session name and date
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'date') {
      setDate(value);
    }
  };

  // Handle input changes for exercises (reps, sets, weight)
  const handleExerciseChange = (e, idx) => {
    const { name, value } = e.target;
    const newExercises = [...exercises];
    newExercises[idx][name] = parseInt(value, 10); // Convert to integer
    setExercises(newExercises);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedWorkout = {
      name,
      date,
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exercise.id,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      })),
    };

    if (!name || !date || exercises.length === 0) {
      alert('Please fill out forms before saving');
    } else {
      onSubmit(updatedWorkout); // Pass updated workout data to parent component
    }
  };

  const handleOnChangeNewExercise = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedExercise = allExercises.find((ex) => ex.id === selectedId);
    if (!selectedExercise) return;

    setExercises([
      ...exercises,
      {
        id: Date.now(), // temp id for frontend mapping
        sets: 0,
        reps: 0,
        weight: 0,
        exerciseId: selectedId,
        workoutSessionId: workout.id,
        exercise: selectedExercise,
      },
    ]);
  };

  const handleDeleteExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Workout Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Date</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Exercises</label>
        <ul className="space-y-2">
          {exercises.map((ex, idx) => (
            <li key={ex.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="italic">{ex.exercise.name}</div>
                <div>
                  Sets:{' '}
                  <input
                    type="number"
                    name="sets"
                    value={ex.sets}
                    onChange={(e) => handleExerciseChange(e, idx)}
                    className="border w-16 px-1"
                  />
                </div>
                <div>
                  Reps:{' '}
                  <input
                    type="number"
                    name="reps"
                    value={ex.reps}
                    onChange={(e) => handleExerciseChange(e, idx)}
                    className="border w-16 px-1"
                  />
                </div>
                <div>
                  Weight:{' '}
                  <input
                    type="number"
                    name="weight"
                    value={ex.weight}
                    onChange={(e) => handleExerciseChange(e, idx)}
                    className="border w-16 px-1"
                  />
                </div>
                <div>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDeleteExercise(idx)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* Add Exercise Dropdown */}
        <div className="mt-4">
          <label className="block font-semibold">Add Exercise</label>
          <select
            onChange={handleOnChangeNewExercise}
            defaultValue=""
            className="border px-2 py-1 w-full"
          >
            <option value="" disabled>
              Select an exercise
            </option>
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
}
