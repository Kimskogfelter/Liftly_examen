import React from "react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EditPostForm from "./EditPostForm";
import DeletePostForm from "./DeletePostForm";

function PostActionsMenu({ post, handleDeletePost, handleEditPost, currentUser }) {

    const [showEditPostForm, setShowEditPostForm] = useState(false);
    const [showDeletePostForm, setShowDeletePostForm] = useState(false);


    return (
        <div className="flex items-center gap-1.5 rounded-md bg-[#161618] p-1 shadow-sm border border-zinc-800/50">
            {/* Redigera-knapp */}
            <button
                onClick={() => setShowEditPostForm(true)}
                title="Redigera inlägg"
                className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
                <FiEdit2 size={14} />
            </button>

            {/* Radera-knapp */}
            <button
                onClick={() => setShowDeletePostForm(true)}
                title="Radera inlägg"
                className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-red-950/40 hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
                <FiTrash2 size={14} />
            </button>

            {/* edit and delete forms */}
            {showEditPostForm && <EditPostForm currentUser={currentUser} post={post} handleEditPost={handleEditPost} onClose={() => setShowEditPostForm(false)} />}
            {showDeletePostForm && <DeletePostForm currentUser={currentUser} post={post} handleDeletePost={handleDeletePost} onClose={() => setShowDeletePostForm(false)} />}
        </div>
    )

}

export default PostActionsMenu;