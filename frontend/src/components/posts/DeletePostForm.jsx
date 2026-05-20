import { useState } from "react";
import axios from "axios";

function DeletePostForm({ post, onClose, currentUser, handleDeletePost }) {

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
      <div className="bg-white p-6 rounded-lg max-w-sm mx-auto shadow-md">
        <p className="text-gray-800 font-medium mb-4">Are you sure you want to delete this post?</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={deletePost}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded transition-colors cursor-pointer text-sm"
          >
            Yes, delete
          </button>
          <button
            onClick={onClose}
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-semibold py-1.5 px-4 rounded transition-colors cursor-pointer text-sm"
          >
            No, cancel
          </button>
        </div>
        {error && <p className="text-red-600 text-xs mt-3 font-medium">{error}</p>}
      </div>
    </>
  )
}

export default DeletePostForm;