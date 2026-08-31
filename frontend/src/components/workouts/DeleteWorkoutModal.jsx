import React, { useState } from "react";
import axios from "axios";

function DeleteWorkoutModal({ workout, currentUser, onClose, handleDeleteWorkout }) {

    const token = currentUser?.token;
    const [isDeleting, setIsDeleting] = useState(false);

    const removeWorkout = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/workouts/${workout._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            handleDeleteWorkout(workout._id);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-2xl max-w-sm w-full">
                <h3 className="font-bold text-sm">Delete Workout?</h3>
                <p className="text-xs text-zinc-500 my-2">
                    Are you sure you want to delete "{workout.title}"?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-3 py-1.5 text-xs bg-zinc-100 rounded-lg cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={removeWorkout}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg cursor-pointer"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteWorkoutModal;