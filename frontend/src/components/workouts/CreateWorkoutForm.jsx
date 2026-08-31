import React, { useState } from "react";
import axios from "axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { LuDumbbell } from "react-icons/lu";

function CreateWorkoutForm({ currentUser, onClose, onWorkoutCreated }) {
  const token = currentUser?.token;

  const [day, setDay] = useState("Monday");
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 3, reps: "", kgs: "" }]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hantera ändringar i en specifik övning
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];

    // Om fältet är numeriskt, låt det vara tom sträng "" om användaren rensat rutan,
    // annars gör om till Number.
    if (field === "sets" || field === "reps" || field === "kgs") {
      updatedExercises[index][field] = value === "" ? "" : Number(value);
    } else {
      updatedExercises[index][field] = value;
    }

    setExercises(updatedExercises);
  };

  // Lägg till en ny tom övningsrad
  const addExerciseRow = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10, kgs: 0 }]);
  };

  // Ta bort en övningsrad
  const removeExerciseRow = (indexToRemove) => {
    if (exercises.length === 1) {
      setError("At least one exercise is required.");
      return;
    }
    setError("");
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  };

  // Skapa passet via API
  const createWorkout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validera att alla övningar har namn
    const hasEmptyExercise = exercises.some((ex) => !ex.name.trim());
    if (hasEmptyExercise) {
      setError("Please fill in the name for all exercises.");
      setIsSubmitting(false);
      return;
    }

    // 1. OMVANDLA DATAN TILL BACKEND-FORMATET HÄR:
    const formattedExercises = exercises.map((ex) => {
      const numSets = Number(ex.sets) || 1;
      const numReps = Number(ex.reps) || 10;
      const numKgs = Number(ex.kgs) || 0;

      // Skapa arrayen av set-objekt utifrån siffran i "Sets"
      const setsArray = Array.from({ length: numSets }, () => ({
        reps: numReps,
        kgs: numKgs
      }));

      return {
        name: ex.name,
        sets: setsArray // <-- Nu blir backend nöjd!
      };
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/workouts/create`,
        { day, title, exercises: formattedExercises }, // Skicka den omvandlade datan!
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Workout created successfully:", response.data);

      if (onWorkoutCreated) {
        onWorkoutCreated(response.data.workout);
      }

      onClose();
    } catch (err) {
      const errorResponse = err.response?.data;
      setError(
        errorResponse?.message || "Workout could not be created. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
      {/* Container - Samma vita modal-box som CreatePostForm */}
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 text-left max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-black text-white rounded-lg">
            <LuDumbbell size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Create Workout Routine</h3>
        </div>

        <form onSubmit={createWorkout} className="space-y-4 overflow-y-auto pr-1">

          {/* DAY & TITLE Input-rad */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Day</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full text-xs text-gray-800 bg-gray-50/50 border border-zinc-200 rounded-lg p-2 outline-none focus:border-zinc-400 font-medium cursor-pointer"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Routine Title</label>
              <input
                type="text"
                placeholder="e.g. Chest & Triceps Focus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xs text-gray-800 placeholder-gray-400 bg-gray-50/50 border border-zinc-200 rounded-lg p-2 outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          {/* EXERCISES LIST */}
          <div className="space-y-2 pt-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Exercises</label>

            {exercises.map((exercise, index) => (
              <div key={index} className="flex flex-col gap-2 p-2.5 bg-zinc-50/80 rounded-xl border border-zinc-200/60 relative group">

                {/* Övningsnamn + Radera-knapp */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Exercise name (e.g. Bench Press)"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                    className="flex-1 text-xs font-semibold text-gray-800 placeholder-gray-400 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400"
                  />

                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExerciseRow(index)}
                      className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove exercise"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Sets, Reps, Kgs */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Sets</span>
                    <input
                      type="number"
                      value={exercise.sets}
                      placeholder="3"
                      onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Reps</span>
                    <input
                      type="number"
                      value={exercise.reps}
                      placeholder="10"
                      onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Kg</span>
                    <input
                      type="number"
                      value={exercise.kgs}
                      placeholder="0"
                      onChange={(e) => handleExerciseChange(index, "kgs", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

              </div>
            ))}

            {/* Knapp för att lägga till ännu en övning */}
            <button
              type="button"
              onClick={addExerciseRow}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
            >
              <FiPlus size={14} />
              <span>Add Exercise</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Action buttons (Cancel / Create) */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-xs shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Save Routine"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutForm;