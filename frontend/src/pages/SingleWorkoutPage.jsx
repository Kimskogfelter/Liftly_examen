import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import WorkoutCard from "../components/workouts/WorkoutCard";

function SingleWorkoutPage({ currentUser }) {
    const { workoutId } = useParams(); // get workout ID from URL parameters
    const [workout, setWorkout] = useState(null); // Workout is an object -> null as initial state
    const [error, setError] = useState("");
    const token = currentUser?.token;
    const navigate = useNavigate();

    // Function to fetch workout details from backend
    const getWorkout = async () => {
        try {
            const response = await api.get(`/workouts/${workoutId}`);
            setWorkout(response.data.workout || response.data);
        } catch (err) {
            setError("Could not fetch workout details.");
        }
    };

    // Call getWorkout when component loads or when workoutId/token changes
    useEffect(() => {
        if (token && workoutId) {
            getWorkout();
        }
    }, [workoutId, token]);

    // Function to finish workout and update calendar
    const handleFinishWorkout = async () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

            // Call backend endpoint
            await api.post('/workouts/finish', {
                workoutId,
                date: todayStr
            });

            // Navigate to calendar so user immediately sees the completed workout
            navigate('/calendar');
        } catch (err) {
            console.error("Error finishing workout:", err);
            setError("Could not save finished workout.");
        }
    };

    return (
        <section className="flex-1 px-2 md:px-6 max-w-2xl mx-auto pt-16 md:pt-24 xl:pt-8 pb-24 font-sans text-gray-800">
            {error && (
                <div className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl mb-6 text-xs font-medium">
                    {error}
                </div>
            )}

            {/* if workout exists execute below code */}
            {workout && (
                <div className="mt-8 py-6 flex flex-col items-center">
                    <div className="w-full max-w-lg">
                        <WorkoutCard
                            workout={workout}
                            currentUser={currentUser}
                        />

                        {/* Finish Workout button matched to container width */}
                        <button
                            onClick={handleFinishWorkout}
                            className="w-full mt-6 bg-black text-white py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition shadow-sm cursor-pointer"
                        >
                            Finish Workout
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SingleWorkoutPage;