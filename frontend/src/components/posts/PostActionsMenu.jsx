import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

function PostActionsMenu({ post, handleDeletePost, handleEditPost, currentUser, closeMenu }) {
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);

    return (
        <>
            {createPortal(
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={closeMenu}
                >
                    <div 
                        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-gray-800 relative animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header med kryss */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                                    Post Options
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Choose an action for this post
                                </p>
                            </div>
                            <button 
                                onClick={closeMenu}
                                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Vertikala knappar */}
                        <div className="flex flex-col gap-2 my-2">
                            {/* Edit */}
                            <button
                                type="button"
                                onClick={() => setShowEditPostModal(true)}
                                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-gray-700 group-hover:scale-105 transition-transform">
                                        <FiEdit2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Edit Post</p>
                                        <p className="text-[10px] text-gray-400">Update caption</p>
                                    </div>
                                </div>
                            </button>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() => setShowDeletePostModal(true)}
                                className="w-full flex items-center justify-between p-3.5 bg-red-50/60 hover:bg-red-50 rounded-2xl transition-colors text-left cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-red-500 group-hover:scale-105 transition-transform">
                                        <FiTrash2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-red-600">Delete Post</p>
                                        <p className="text-[10px] text-red-400">Permanently remove this post</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit Post Modal */}
            {showEditPostModal && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 whitespace-normal">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-gray-800 relative" onClick={(e) => e.stopPropagation()}>
                        <EditPostModal 
                            currentUser={currentUser} 
                            post={post} 
                            handleEditPost={handleEditPost} 
                            onClose={() => {
                                setShowEditPostModal(false);
                                closeMenu();
                            }} 
                        />
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Post Modal */}
            {showDeletePostModal && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 whitespace-normal">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-gray-800 relative" onClick={(e) => e.stopPropagation()}>
                        <DeletePostModal 
                            currentUser={currentUser} 
                            post={post} 
                            handleDeletePost={handleDeletePost} 
                            onClose={() => {
                                setShowDeletePostModal(false);
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