import React, { useState } from "react";
import axios from "axios";
import { FiTrash2, FiPlus } from "react-icons/fi";

function EditWorkoutModal({ onClose, handleEditWorkout, workout, currentUser }) {

    const token = currentUser?.token;
    const workoutId = workout._id;
    const [title, setTitle] = useState(workout.title || "");
    const [day, setDay] = useState(workout.day || "Monday");
    // Djuplokal kopia av exercises-arrayen för att undvika mutate-buggar
    const [exercises, setExercises] = useState(
        workout.exercises ? JSON.parse(JSON.stringify(workout.exercises)) : []
    );
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- HANDLERS FOR EXERCISES & SETS ---

    // 1. Ändra övningens namn
    const handleExerciseNameChange = (exIndex, value) => {
        const updated = [...exercises];
        updated[exIndex].name = value;
        setExercises(updated);
    };

    // 2. Ändra reps eller kgs för ett enskilt set
    const handleSetChange = (exIndex, setIndex, field, value) => {
        const updated = [...exercises];
        updated[exIndex].sets[setIndex][field] = Number(value);
        setExercises(updated);
    };

    // 3. Lägg till nytt set i en övning
    const addSet = (exIndex) => {
        const updated = [...exercises];
        updated[exIndex].sets.push({ reps: 10, kgs: 0 });
        setExercises(updated);
    };

    // 4. Ta bort ett set från en övning
    const removeSet = (exIndex, setIndex) => {
        const updated = [...exercises];
        updated[exIndex].sets.splice(setIndex, 1);
        setExercises(updated);
    };

    // 5. Lägg till en helt ny övning
    const addExercise = () => {
        setExercises([...exercises, { name: "", sets: [{ reps: 10, kgs: 0 }] }]);
    };

    // 6. Ta bort en hel övning
    const removeExercise = (exIndex) => {
        const updated = exercises.filter((_, index) => index !== exIndex);
        setExercises(updated);
    };

    // --- SUBMIT ---
    // 1. Skickar ändringarna till backend
    const editWorkout = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/workouts/${workoutId}/update`,
                { title, day, exercises },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Workout updated:", response.data);
            const updatedWorkout = response.data.workout;

            // 2. Anropar förälderns funktion med det nya passet
            handleEditWorkout(updatedWorkout);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Could not update workout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 text-left max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Edit Workout Routine</h3>

            <form onSubmit={editWorkout} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xs text-gray-800 border border-zinc-200 rounded-lg p-2.5 bg-gray-50/30 focus:outline-none focus:border-zinc-400"
                        required
                    />
                </div>

                {/* Day Dropdown (Matchar din Mongoose Enum) */}
                <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Day</label>
                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="w-full text-xs text-gray-800 border border-zinc-200 rounded-lg p-2.5 bg-gray-50/30 focus:outline-none focus:border-zinc-400"
                    >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Exercises Section */}
                <div className="pt-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Exercises</label>

                    <div className="space-y-4">
                        {exercises.map((ex, exIndex) => (
                            <div key={ex._id || exIndex} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60">

                                {/* Exercise Header */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Exercise Name (e.g. Bench Press)"
                                        value={ex.name}
                                        onChange={(e) => handleExerciseNameChange(exIndex, e.target.value)}
                                        className="flex-1 text-xs font-semibold bg-white border border-zinc-200 rounded-md p-1.5 focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(exIndex)}
                                        className="text-zinc-400 hover:text-red-500 p-1 rounded-md"
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>

                                {/* Sets List */}
                                <div className="space-y-1.5 pl-2">
                                    {ex.sets?.map((set, setIndex) => (
                                        <div key={set._id || setIndex} className="flex items-center gap-2 text-xs">
                                            <span className="text-zinc-400 font-medium w-10">Set {setIndex + 1}</span>

                                            {/* Reps */}
                                            <input
                                                type="number"
                                                min="1"
                                                value={set.reps}
                                                onChange={(e) => handleSetChange(exIndex, setIndex, "reps", e.target.value)}
                                                className="w-16 bg-white border border-zinc-200 rounded p-1 text-center"
                                            />
                                            <span className="text-zinc-400 text-[10px]">reps</span>

                                            {/* Weight (kgs) */}
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={set.kgs}
                                                onChange={(e) => handleSetChange(exIndex, setIndex, "kgs", e.target.value)}
                                                className="w-16 bg-white border border-zinc-200 rounded p-1 text-center"
                                            />
                                            <span className="text-zinc-400 text-[10px]">kg</span>

                                            {/* Remove Set */}
                                            {ex.sets.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSet(exIndex, setIndex)}
                                                    className="text-zinc-300 hover:text-red-500 ml-auto"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add Set Button */}
                                <button
                                    type="button"
                                    onClick={() => addSet(exIndex)}
                                    className="mt-2 text-[10px] text-zinc-600 font-semibold hover:text-black flex items-center gap-1"
                                >
                                    <FiPlus size={11} /> Add Set
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Exercise Button */}
                    <button
                        type="button"
                        onClick={addExercise}
                        className="mt-3 w-full py-2 border border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <FiPlus size={13} /> Add Exercise
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 px-3 rounded-lg text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-3.5 rounded-lg text-xs shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? "Updating..." : "Update Workout"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditWorkoutModal;