import React from "react";
import { LuDumbbell } from "react-icons/lu";
import { FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";

function WorkoutGridItem({ workout, onEdit, onDelete, onStart }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group">
      <div>
        {/* Top row: Dag & Action-knappar */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-md">
            {workout.day}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(workout)}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Edit routine"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(workout._id)}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete routine"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>

        {/* Titel & Antal övningar */}
        <h3 className="text-base font-bold text-zinc-900 tracking-wide mb-1">
          {workout.title}
        </h3>
        <p className="text-xs text-zinc-400 font-medium mb-4 flex items-center gap-1.5">
          <LuDumbbell size={13} className="text-zinc-500" />
          <span>{workout.exercises?.length || 0} exercises</span>
        </p>
      </div>

      {/* Starta pass-knapp */}
      <button
        onClick={() => onStart(workout)}
        className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        <FiPlay size={13} className="fill-white" />
        <span>Start Workout</span>
      </button>
    </div>
  );
}

export default WorkoutGridItem;