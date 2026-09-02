import { useState } from "react";
import axios from "axios";

function DeletePostModal({ post, onClose, currentUser, handleDeletePost }) {

  const token = currentUser.token;
  const [error, setError] = useState("");


  const deletePost = async (e) => {

    try {

      // delete post data from backend
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Post deleted successfully from backend with id:", post._id);


      // Execute the function from Home/ProfilePage to update the UI instantly
      // pass the deleted post's ID down to the filter function
      handleDeletePost(post._id);
      console.log("handleDeletePost function executed successfully for ID:", post._id);

      // close the deletePost component after successful post deletion
      onClose();

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be deleted. Please try again.");
    }
  };



  return (
    <>
      {/* Outer card wrapper - Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
      
      {/* Delete container - The actual white modal box containing the confirmation */}
      <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 text-left">
        
        <h3 className="text-sm font-bold text-gray-900 mb-2">Delete Post</h3>
        <p className="text-gray-600 text-xs mb-4">Are you sure you want to delete this post?</p>
        
        {/* Buttons footer */}
        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            onClick={deletePost}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs shadow-sm"
          >
            Delete
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 mt-3">
            {error}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default DeletePostModal;