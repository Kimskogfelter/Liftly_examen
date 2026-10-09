import React from 'react';
import { FiPlus } from "react-icons/fi";

const AssignWorkoutForm = ({
    selectedDate,
    selectedWorkoutId,
    setSelectedWorkoutId,
    notes,
    setNotes,
    workouts,
    handleAssignWorkout
}) => {
    return (
        <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6">
            <div className="mb-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Selected Date</span>
                    <h2 className="text-base font-bold text-zinc-900 mt-0.5 font-mono">{selectedDate}</h2>
                </div>
            </div>

            <form onSubmit={handleAssignWorkout} className="space-y-3">
                <h2 className="font-semibold text-zinc-900 text-xs">Assign Workout</h2>
                <select
                    value={selectedWorkoutId}
                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                    className="w-full border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                    <option value="">Select from your workouts...</option>
                    {workouts.map((w) => (
                        <option key={w._id} value={w._id}>
                            {w.title}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Notes (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                    type="submit"
                    disabled={!selectedWorkoutId}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 disabled:bg-zinc-300 transition text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                    <FiPlus size={16} />
                    <span>Add to Calendar</span>
                </button>
            </form>
        </div>
    );
};

export default AssignWorkoutForm;