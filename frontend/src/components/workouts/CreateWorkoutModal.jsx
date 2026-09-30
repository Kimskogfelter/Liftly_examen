import React, { useState } from "react";
import api from "../../api/axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { LuDumbbell } from "react-icons/lu";

function CreateWorkoutModal({ currentUser, onClose, onWorkoutCreated }) {

  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 3, reps: "", kgs: "" }]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hantera ändringar i en specifik övning
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];

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

    // OMVANDLA DATAN TILL BACKEND-FORMATET:
    const formattedExercises = exercises.map((ex) => {
      const numSets = Number(ex.sets) || 1;
      const numReps = Number(ex.reps) || 10;
      const numKgs = Number(ex.kgs) || 0;

      const setsArray = Array.from({ length: numSets }, () => ({
        reps: numReps,
        kgs: numKgs
      }));

      return {
        name: ex.name,
        sets: setsArray
      };
    });

    try {
      const response = await api.post(`/workouts/create`, { title, exercises: formattedExercises });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 font-sans">
      <div className="w-full max-w-md bg-white rounded-lg p-4 sm:p-5 shadow-xl border border-gray-100 text-left max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-black text-white rounded-lg">
            <LuDumbbell size={16} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Create Workout Routine</h3>
        </div>

        <form onSubmit={createWorkout} className="space-y-3.5 overflow-y-auto pr-1">

          {/* ROUTINE TITLE (Full width now that Day is removed) */}
          <div>
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

          {/* EXERCISES LIST */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Exercises</label>

            {exercises.map((exercise, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 relative group">

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Exercise name (e.g. Bench Press)"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                    className="flex-1 text-xs font-semibold text-gray-800 placeholder-gray-400 bg-white border border-zinc-200 rounded-lg px-2.5 py-2 outline-none focus:border-zinc-400"
                  />

                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExerciseRow(index)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Remove exercise"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Sets</span>
                    <input
                      type="number"
                      value={exercise.sets}
                      placeholder="3"
                      onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1.5 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Reps</span>
                    <input
                      type="number"
                      value={exercise.reps}
                      placeholder="10"
                      onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1.5 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-zinc-400 block mb-0.5">Kg</span>
                    <input
                      type="number"
                      value={exercise.kgs}
                      placeholder="0"
                      onChange={(e) => handleExerciseChange(index, "kgs", e.target.value)}
                      className="w-full text-xs text-center bg-white border border-zinc-200 rounded-md py-1.5 text-gray-800 font-medium outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

              </div>
            ))}

            <button
              type="button"
              onClick={addExerciseRow}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
            >
              <FiPlus size={14} />
              <span>Add Exercise</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-2.5 rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-3.5 rounded-lg transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-xs shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Save Routine"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutModal;