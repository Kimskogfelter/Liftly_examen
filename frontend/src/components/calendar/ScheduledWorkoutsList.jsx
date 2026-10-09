import React from 'react';
import { FiCheck } from "react-icons/fi";

const ScheduledWorkoutsList = ({
    loading,
    logsForSelectedDate,
    navigate,
    handleToggleComplete,
    handleDeleteLog
}) => {
    return (
        <div className="space-y-3">
            <h2 className="font-semibold text-zinc-900 text-xs">Scheduled Workouts</h2>
            {loading ? (
                <p className="text-xs text-zinc-400">Loading...</p>
            ) : logsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-zinc-500 text-xs font-medium">No workouts scheduled for this date.</p>
                </div>
            ) : (
                logsForSelectedDate.map((log) => (
                    <div key={log._id} className="border border-gray-100 p-4 rounded-lg flex flex-row justify-between items-center gap-3 bg-white shadow-sm">
                        <div className="min-w-0 flex-1">
                            <p
                                onClick={() => {
                                    const workoutId = log.workout?._id || log.workout;
                                    if (workoutId) {
                                        navigate(`/workouts/${workoutId}`);
                                    }
                                }}
                                className={`font-semibold text-xs truncate cursor-pointer hover:underline hover:text-blue-600 transition ${
                                    log.completed ? "line-through text-zinc-400" : "text-zinc-900"
                                }`}
                                title={log.title}
                            >
                                {log.title}
                            </p>
                            {log.notes && <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{log.notes}</p>}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleToggleComplete(log._id, log.completed)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                    log.completed
                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                        : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                                }`}
                            >
                                <FiCheck size={14} className={log.completed ? "text-green-700" : "text-zinc-600"} />
                                <span>{log.completed ? "Completed" : "Mark as Done"}</span>
                            </button>

                            <button
                                onClick={() => handleDeleteLog(log._id)}
                                className="text-zinc-400 hover:text-red-600 text-xs font-medium transition cursor-pointer px-2 py-1.5"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScheduledWorkoutsList;