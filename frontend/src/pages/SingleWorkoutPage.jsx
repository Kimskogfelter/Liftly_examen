import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import WorkoutCard from "../components/workouts/WorkoutCard";

function SingleWorkoutPage({ currentUser }) {
    const { workoutId } = useParams(); // get workout ID from URL parameters
    const [workout, setWorkout] = useState(null); // Ett pass är ett objekt -> null som initial state
    const [error, setError] = useState("");
    const token = currentUser?.token;
    const navigate = useNavigate();

    // Funktion för att hämta passets detaljer från backend
    const getWorkout = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/workouts/${workoutId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setWorkout(response.data.workout || response.data);

            console.log("Fetched workout details:", response.data);
            
        } catch (err) {
            setError("Could not fetch workout details.");
        }
    };

    // Anropa getWorkout när komponenten laddas eller när workoutId/token ändras
    useEffect(() => {
        if (token && workoutId) {
            getWorkout();
        }
    }, [workoutId, token]);

    // Hantera redigering lokalt i statet
    const handleEditWorkout = (updatedWorkout) => {
        setWorkout(updatedWorkout);
    };

    // Hantera radering genom att skicka användaren tillbaka till alla träningspass
    const handleDeleteWorkout = () => {
        navigate("/workouts");
    };

    return (
        <section className="flex-1 p-6 max-w-2xl mx-auto pt-16 md:pt-6 font-sans text-gray-800">
            {error && (
                <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium">
                    {error}
                </div>
            )}

            {/* if workout exist execute below code */}
            {workout && (
                <div className="mt-8 py-6">
                    <WorkoutCard
                        workout={workout}
                        currentUser={currentUser}
                        handleEditWorkout={handleEditWorkout}
                        handleDeleteWorkout={handleDeleteWorkout}
                    />
                </div>
            )}
        </section>
    );
}

export default SingleWorkoutPage;