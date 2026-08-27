import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileImage from "../components/users/ProfileImage";
import CreateWorkoutForm from "../components/workouts/CreateWorkoutForm"; // 1. Importera modalen
import { LuDumbbell } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";

function WorkoutPage({ currentUser, setCurrentUser }) {
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState("");
    const token = currentUser?.token;
    const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useState(false);

    // Hämta användarens träningspass
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
            setError("Kunde inte hämta dina träningspass.");
        }
    };

    useEffect(() => {
        if (token) getWorkouts();
    }, [token]);

    // 2. Funktion som lägger till det nyss skapade passet direkt i state
    const handleWorkoutCreated = (newWorkout) => {
        setWorkouts([newWorkout, ...workouts]);
    };

    return (
        <section className="flex-1 p-6 max-w-4xl mx-auto pt-16 md:pt-6 md:ml-32 font-sans text-gray-800">

            {/* 1. Användar-Header (Kombination av Profil & Titel) */}
            <div className="w-full max-w-2xl mx-auto mb-8 flex items-center justify-between border-b border-zinc-200 pb-5">

                {/* Vänster: Titel & Ikon */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-black text-white rounded-xl shadow-sm">
                        <LuDumbbell size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-black tracking-wide leading-tight">
                            My Workouts
                        </h1>
                        <p className="text-xs text-zinc-500 font-medium">
                            Log & track your daily routines
                        </p>
                    </div>
                </div>

                {/* Höger: Liten profil-badge för den inloggade användaren */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-800">
                        {currentUser?.username}
                    </span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 shrink-0 shadow-sm">
                        <ProfileImage currentUser={currentUser} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-2xl mx-auto bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={() => setError("")}
                        className="text-red-400 hover:text-red-700 font-bold ml-2 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* 2. Innehålls-container (Knapp + Lista) */}
            <div className="w-full max-w-2xl mx-auto space-y-4">

                {/* Knapp för att skapa nytt pass */}
                <button onClick={() => setShowCreateWorkoutForm(true)}
                    className="w-full py-3 px-4 bg-black hover:bg-zinc-800 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                    <FiPlus size={16} />
                    <span>Create New Routine</span>
                </button>

                {/* Pass-lista */}
                {workouts.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-500 text-sm">No workout routines added yet.</p>
                        <p className="text-zinc-400 text-xs mt-1">Create your first routine above to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Här mappar du ut dina WorkoutCard-komponenter sen */}
                    </div>
                )}

            </div>

            {/* 3. Rendera CreateWorkoutForm som modal när showCreateWorkoutForm är true */}
            {showCreateWorkoutForm && (
                <CreateWorkoutForm
                    currentUser={currentUser}
                    onClose={() => setShowCreateWorkoutForm(false)}
                    onWorkoutCreated={handleWorkoutCreated}
                />
            )}

        </section>
    );
}

export default WorkoutPage;