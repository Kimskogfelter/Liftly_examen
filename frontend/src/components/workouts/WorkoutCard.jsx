import React, { useState } from "react";
import axios from "axios";

function WorkoutCard({ workout, currentUser }) {

    const token = currentUser?.token;

    // Initiera statet med övningarna som kom från backend
    const [exercises, setExercises] = useState(workout?.exercises || []);

    // Funktion för att uppdatera ett specifikt set (reps/vikt/completed)
    const handleSetChange = (exerciseIndex, setIndex, field, value) => {
        const updatedExercises = [...exercises];
        const parsedValue = value === "" ? "" : Number(value);
        updatedExercises[exerciseIndex].sets[setIndex][field] = parsedValue;
        setExercises(updatedExercises);
    };

    const autoSaveWorkout = async (exercises) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/workouts/${workout._id}/update`,
                { exercises: exercises },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Auto-saved successfully!", exercises);
        } catch (err) {
            console.error("Auto-save failed:", err);
        }
    };

    // Funktion för att bocka för ett set
    const toggleSetComplete = (exerciseIndex, setIndex) => {
        const updatedExercises = [...exercises];
        const currentStatus = updatedExercises[exerciseIndex].sets[setIndex].completed;
        updatedExercises[exerciseIndex].sets[setIndex].completed = !currentStatus;
        setExercises(updatedExercises);
    };

    return (
        /* 🔴 MOBILJUSTERAT: Justerad padding (p-4 sm:p-6) och w-full för att ta hela utrymmet snyggt */
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-zinc-200 max-w-lg mx-auto shadow-xs w-full">
            {/* Header-info */}
            <div className="mb-5 border-b border-zinc-100 pb-4">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-md">
                    {workout.day}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mt-2">{workout.title}</h2>
            </div>

            {/* Lista med övningar */}
            <div className="space-y-5">
                {exercises.map((exercise, exIdx) => (
                    <div key={exIdx} className="bg-zinc-50/80 rounded-xl p-3 sm:p-4 border border-zinc-100">
                        <h3 className="font-bold text-sm text-zinc-900 mb-3">{exercise.name}</h3>

                        {/* Sets & Reps rader */}
                        <div className="space-y-2.5">
                            {exercise.sets.map((set, setIdx) => (
                                /* 🔴 MOBILJUSTERAT: Använder gap-1.5 sm:gap-3 och flex-1 på inputs så allt får plats på rad utan overflow */
                                <div key={setIdx} className="flex items-center gap-1.5 sm:gap-3 text-xs w-full">
                                    <span className="font-semibold text-zinc-400 w-10 sm:w-12 shrink-0 text-[11px] sm:text-xs">
                                        Set {setIdx + 1}
                                    </span>

                                    {/* Weight with label */}
                                    <div className="flex items-center gap-1 flex-1 min-w-0">
                                        <input
                                            type="number"
                                            value={set.kgs || ""}
                                            onChange={(e) => handleSetChange(exIdx, setIdx, "kgs", e.target.value)}
                                            onBlur={() => autoSaveWorkout(exercises)}
                                            placeholder="0"
                                            className="w-full min-w-9 max-w-14 p-1.5 bg-white border border-zinc-200 rounded-lg text-center font-medium text-xs focus:outline-none focus:border-zinc-400"
                                        />
                                        <span className="text-[10px] font-semibold text-zinc-400 shrink-0">kg</span>
                                    </div>

                                    {/* Reps with label */}
                                    <div className="flex items-center gap-1 flex-1 min-w-0">
                                        <input
                                            type="number"
                                            value={set.reps || ""}
                                            onChange={(e) => handleSetChange(exIdx, setIdx, "reps", e.target.value)}
                                            onBlur={() => autoSaveWorkout(exercises)}
                                            placeholder="0"
                                            className="w-full min-w-9 max-w-14 p-1.5 bg-white border border-zinc-200 rounded-lg text-center font-medium text-xs focus:outline-none focus:border-zinc-400"
                                        />
                                        <span className="text-[10px] font-semibold text-zinc-400 shrink-0">reps</span>
                                    </div>

                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleSetComplete(exIdx, setIdx)}
                                        className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-[11px] sm:text-xs cursor-pointer transition-all ${
                                            set.completed
                                                ? "bg-emerald-500 text-white"
                                                : "bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
                                        }`}
                                    >
                                        {set.completed ? "Done ✓" : "Check"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkoutCard;