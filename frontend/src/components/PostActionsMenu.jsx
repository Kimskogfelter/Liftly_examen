import React from "react";
import { useState } from "react";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function PostActionsMenu({ post, onEditPost, onDeletePost }) {

    const [showEditPost, setShowEditPost] = useState(false);
    const [showDeletePost, setShowDeletePost] = useState(false);


    return (
        <div>
            <button onClick={() => setShowEditPost(true)}><FiEdit2 /></button>
            <button onClick={() => setShowDeletePost(true)}><FiTrash2 /></button>
            {showEditPost && <EditPost post={post} onEditPost={onEditPost} onClose={() => setShowEditPost(false)} />}
            {showDeletePost && <DeletePost post={post} onDeletePost={onDeletePost} onClose={() => setShowDeletePost(false)} />}
        </div>
     )  

}

export default PostActionsMenu;