import React from "react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

function PostActionsMenu({ post, onEditPost, onDeletePost, currentUser }) {

    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);


    return (
        <div>
            <button onClick={() => setShowEditPostModal(true)}><FiEdit2 /></button>
            <button onClick={() => setShowDeletePostModal(true)}><FiTrash2 /></button>
            {showEditPostModal && <EditPostModal currentUser={currentUser} post={post} onEditPost={onEditPost} onClose={() => setShowEditPostModal(false)} />}
            {showDeletePostModal && <DeletePostModal currentUser={currentUser} post={post} onDeletePost={onDeletePost} onClose={() => setShowDeletePostModal(false)} />}
        </div>
     )  

}

export default PostActionsMenu;