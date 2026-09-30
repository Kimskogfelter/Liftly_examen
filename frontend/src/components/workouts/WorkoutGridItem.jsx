import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { LuDumbbell } from "react-icons/lu";
import { FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";

import DeleteWorkoutModal from "./DeleteWorkoutModal";
import EditWorkoutModal from "./EditWorkoutModal";

function WorkoutGridItem({ workout, handleDeleteWorkout, handleEditWorkout, currentUser }) {
  const [showEditWorkoutModal, setShowEditWorkoutModal] = useState(false);
  const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between text-left group">
        
        {/* Header-sektion med titel till vänster och knappar till höger */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-wide">
              {workout.title}
            </h3>
            <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5">
              <LuDumbbell size={13} className="text-zinc-500" />
              <span>{workout.exercises?.length || 0} exercises</span>
            </p>
          </div>

          {/* Action-knappar (Redigera / Ta bort) till höger */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setShowEditWorkoutModal(true)}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Edit routine"
            >
              <FiEdit2 size={14} />
            </button>

            <button
              onClick={() => setShowDeleteWorkoutModal(true)}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete routine"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>

        {/* Starta pass-knapp */}
        <Link to={`/workouts/${workout._id}`} className="w-full">
          <button className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs">
            <FiPlay size={13} className="fill-white" />
            <span>Start Workout</span>
          </button>
        </Link>
      </div>

      {/* --- EDIT WORKOUT MODAL PORTAL --- */}
      {showEditWorkoutModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
            <EditWorkoutModal
              currentUser={currentUser}
              workout={workout}
              handleEditWorkout={handleEditWorkout}
              onClose={() => setShowEditWorkoutModal(false)}
            />
          </div>,
          document.body
        )}

      {/* --- DELETE WORKOUT MODAL PORTAL --- */}
      {showDeleteWorkoutModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
            <DeleteWorkoutModal
              currentUser={currentUser}
              workout={workout}
              handleDeleteWorkout={handleDeleteWorkout}
              onClose={() => setShowDeleteWorkoutModal(false)}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default WorkoutGridItem;