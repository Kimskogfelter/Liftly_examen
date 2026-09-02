import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditPostModal({ onClose, handleEditPost, post, currentUser }) {

  const postId = post._id;
  const navigate = useNavigate();
  const [content, setContent] = useState(post.content);
  const [error, setError] = useState("");

  // Function to edit post
  const editPost = async (e) => {

    e.preventDefault();

    try {
      
      // Send updated post data to backend
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${postId}/update`, { content }, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      });

      console.log("Post update request sent successfully:", response.data);

      // Add the updated post to the posts state to update the UI
      const updatedPost = response.data.updatedPost;
      handleEditPost(updatedPost);
      console.log("handleEditPost function executed", updatedPost);

      // Redirect to home page after successful post editing
      if (response.status === 200) {
        navigate('/home');
      }

      // Close the EditPostModal component after successful post editing
      onClose();

    } catch (err) {
      // Handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be updated. Please try again.");
    }
  };

  return (
    <>
      {/* Outer card wrapper - Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">

        {/* Edit container - The actual white modal box containing the form */}
        <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 text-left">

          <h3 className="text-sm font-bold text-gray-900 mb-3">Edit Post</h3>

          <form onSubmit={editPost} className="space-y-3">
            {/* Content textarea */}
            <div className="relative">
              <textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-27.5 text-xs text-gray-800 placeholder-gray-400 border border-zinc-200 rounded-lg p-3 resize-none focus:outline-none focus:border-zinc-400 bg-gray-50/30 transition-colors"
              ></textarea>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
                {error}
              </div>
            )}

            {/* Footer Row: Action buttons */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100">

              {/* Buttons (Cancel & Update) */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer text-xs shadow-sm"
                >
                  Update Post
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPostModal;