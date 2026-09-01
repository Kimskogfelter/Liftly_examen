import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateWorkoutModal from "../components/workouts/CreateWorkoutModal";
import WorkoutGridItem from "../components/workouts/WorkoutGridItem";
import { LuDumbbell } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";

function WorkoutPage({ currentUser }) {
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState("");
    const token = currentUser?.token;
    const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  

    const getWorkouts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/workouts/user`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setWorkouts(response.data.workouts);
        } catch (err) {
            setError("Couldnt fetch workouts.");
        }
    };

    useEffect(() => {
        if (token) getWorkouts();
    }, [token]);

    // Hantera skapande av nytt träningspass och uppdatera listan
    const handleWorkoutCreated = (newWorkout) => {
        setWorkouts([newWorkout, ...workouts]);
    };

    // Hantera redigering av träningspass och uppdatera listan
    const handleEditWorkout = (updatedWorkout) => {
        setWorkouts(workouts.map((workout) => workout._id === updatedWorkout._id ? updatedWorkout : workout));
    };

    // Hantera radering av träningspass och uppdatera listan
    const handleDeleteWorkout = (workoutId) => {
        setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
    }

    return (
        <section className="flex-1 p-6 max-w-2xl mx-auto pt-16 md:pt-6 font-sans text-gray-800">

            {/* Premium Dashboard Header (Ikon, Undertext & Profil-badge) */}

            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                    <div className="p-2 bg-black text-white rounded-xl shadow-xs shrink-0">
                        <LuDumbbell size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        My Workouts
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    Log & track your daily routines
                </p>
            </div>


            {error && (
                <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={() => setError("")}
                        className="text-red-400 hover:text-red-700 font-bold ml-2 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Innehåll (Create-knapp & Kort-lista) */}
            <div className="w-full space-y-4">

                <button
                    onClick={() => setShowCreateWorkoutModal(true)}
                    className="w-full py-3.5 px-4 bg-black hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Create New Routine</span>
                </button>

                {workouts.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-500 text-sm font-medium">No workout routines added yet.</p>
                        <p className="text-zinc-400 text-xs mt-1">Create your first routine above to get started!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pt-2">
                        {workouts.map((workout) => (
                            <WorkoutGridItem
                                key={workout._id}
                                workout={workout}
                                handleEditWorkout={handleEditWorkout}
                                handleDeleteWorkout={handleDeleteWorkout}
                                currentUser={currentUser}

                            />
                        ))}
                    </div>
                )}

            </div>

            {showCreateWorkoutModal && (
                <CreateWorkoutModal
                    currentUser={currentUser}
                    onClose={() => setShowCreateWorkoutModal(false)}
                    onWorkoutCreated={handleWorkoutCreated}
                />
            )}

        </section>
    );
}

export default WorkoutPage;