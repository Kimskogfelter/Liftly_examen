import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SlPicture } from "react-icons/sl";

function EditPostForm({ onClose, handleEditPost, post, currentUser }) {

  const postId = post._id;
  const navigate = useNavigate();
  const [content, setContent] = useState(post.content);
  // const [media, setMedia] = useState(null);
  const [error, setError] = useState("");

  // function to edit post
  const editPost = async (e) => {
    e.preventDefault();
    try {

      // send updated post data to backend
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${postId}/update`, { content }, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      });

      console.log("Post update request sent successfully:", response.data);

      // add the updated post to the posts state to update the UI
      const updatedPost = response.data.updatedPost;
      handleEditPost(updatedPost);
      console.log("handleEditPost function executed", updatedPost);

      // redirect to home page after successful post editing
      if (response.status === 200) {
        navigate('/home');
      }

      // close the EditPostModal component after successful post editing
      onClose();

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be updated. Please try again.");
    }
  };

  return (
    <>
      {/* Outer card wrapper - modal */}
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
      
      {/* edit container */}
      <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        
        <h3 className="text-sm font-bold text-gray-900 mb-3 text-left">Edit Post</h3>
        
        <form onSubmit={editPost} className="space-y-3">
          {/* Content textarea */}
          <div className="relative">
            <textarea 
              name="content" 
              placeholder="What's on your mind?" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-30 p-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none text-xs bg-gray-50/50 transition-all focus:border-zinc-400"
            ></textarea>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs shadow-sm"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default EditPostForm;