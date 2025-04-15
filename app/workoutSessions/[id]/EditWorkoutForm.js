'use client';

import { useState } from 'react';

export default function EditWorkoutForm({ workout, onSubmit }) {
  const [name, setName] = useState(workout.name);
  const [date, setDate] = useState(workout.date.slice(0, 10)); // YYYY-MM-DD format
  const [exercises, setExercises] = useState(workout.workoutExercises);

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
    newExercises[idx][name] = value;
    setExercises(newExercises);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedWorkout = {
      name,
      date,
      workoutExercises: exercises.map((ex) => ({
        exerciseId: ex.exercise.id,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      })),
    };
    onSubmit(updatedWorkout); // Pass updated workout data to parent component
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
            </li>
          ))}
        </ul>
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
