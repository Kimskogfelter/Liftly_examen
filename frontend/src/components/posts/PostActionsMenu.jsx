import React from "react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EditPostForm from "./EditPostForm";
import DeletePostForm from "./DeletePostForm";

function PostActionsMenu({ post, handleDeletePost, handleEditPost, currentUser }) {
    const [showEditPostForm, setShowEditPostForm] = useState(false);
    const [showDeletePostForm, setShowDeletePostForm] = useState(false);

    return (
        <div className="flex items-center gap-1">
            {/* edit button */}
            <button
                onClick={() => setShowEditPostForm(true)}
                title="Redigera inlägg"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
            >
                <FiEdit2 size={14} />
            </button>

            {/* delete button */}
            <button
                onClick={() => setShowDeletePostForm(true)}
                title="Radera inlägg"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-300 cursor-pointer"
            >
                <FiTrash2 size={14} />
            </button>

            {/* edit and delete forms */}
            {showEditPostForm && <EditPostForm currentUser={currentUser} post={post} handleEditPost={handleEditPost} onClose={() => setShowEditPostForm(false)} />}
            {showDeletePostForm && <DeletePostForm currentUser={currentUser} post={post} handleDeletePost={handleDeletePost} onClose={() => setShowDeletePostForm(false)} />}
        </div>
    );
}

export default PostActionsMenu;