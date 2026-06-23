import React from "react";
import { useState } from "react";
import { createPortal } from "react-dom"; // Import createPortal to break out of the DOM hierarchy
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EditPostForm from "./EditPostForm";
import DeletePostForm from "./DeletePostForm";

function PostActionsMenu({ post, handleDeletePost, handleEditPost, currentUser, closeMenu }) {
    const [showEditPostForm, setShowEditPostForm] = useState(false);
    const [showDeletePostForm, setShowDeletePostForm] = useState(false);

    return (
        <>
            <div className="flex items-center gap-1">
                {/* edit button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowEditPostForm(true);
                    }}
                    title="Edit post"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
                >
                    <FiEdit2 size={14} />
                </button>

                {/* delete button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDeletePostForm(true);
                    }}
                    title="Delete post"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-300 cursor-pointer"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>

            {/* Using React Portals to render the overlays directly into document.body */}
            {showEditPostForm && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 whitespace-normal">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-gray-800 relative" onClick={(e) => e.stopPropagation()}>
                        <EditPostForm 
                            currentUser={currentUser} 
                            post={post} 
                            handleEditPost={handleEditPost} 
                            onClose={() => {
                                setShowEditPostForm(false);
                                closeMenu();
                            }} 
                        />
                    </div>
                </div>,
                document.body
            )}

            {showDeletePostForm && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 whitespace-normal">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-gray-800 relative" onClick={(e) => e.stopPropagation()}>
                        <DeletePostForm 
                            currentUser={currentUser} 
                            post={post} 
                            handleDeletePost={handleDeletePost} 
                            onClose={() => {
                                setShowDeletePostForm(false);
                                closeMenu();
                            }} 
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default PostActionsMenu;