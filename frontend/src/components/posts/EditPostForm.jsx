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
      {/* Outer card wrapper */}
      <div className="bg-white p-6 rounded-xl max-w-md mx-auto shadow-md border border-gray-100 font-sans">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Post</h3>
        
        <form onSubmit={editPost} className="space-y-4">
          {/* Content textarea */}
          <div className="relative">
            <textarea 
              name="content" 
              placeholder="What's on your mind?" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-30 p-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50 transition-all"
            ></textarea>
          </div>

          {/* Media input (commented out for now, but pre-styled for later!) */}
          {/* <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <label htmlFor="media" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
              <SlPicture className="text-xl text-blue-500" />
              <span>Change media</span>
            </label>
            <input className="hidden" type="file" name="media" id="media" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} />
          </div> 
          */}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-lg font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Buttons footer */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-50">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm shadow-sm"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPostForm;