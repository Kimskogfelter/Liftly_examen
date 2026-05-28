import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SlPicture } from "react-icons/sl";
import { IoCloseCircle } from "react-icons/io5";

function EditPostForm({ onClose, handleEditPost, post, currentUser }) {

  const postId = post._id;
  const navigate = useNavigate();
  const [content, setContent] = useState(post.content);
  // Initialize media state with a flat copy of the existing post media array
  const [media, setMedia] = useState([...post.media]);
  const [error, setError] = useState("");

  // function to edit post
  const editPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);

      // Only append media to formData if the first element is a newly selected File
      if (media.length > 0 && media[0] instanceof File) {
        formData.append('media', media[0]);
        console.log("New media file appended to FormData:", media[0]);
      }

      // send updated post data to backend
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${postId}/update`, formData, {
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

            {/* Image preview box */}
            {/* Check if there is an item in the array before rendering the box */}
            {media.length > 0 && media[0] && (
              <div className="relative w-full max-h-60 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                <img
                  // FIX 3: Safe check! If media[0] is a File object, create object URL. Otherwise, use the raw text string (Cloudinary URL).
                  src={media[0] instanceof File ? URL.createObjectURL(media[0]) : media[0]}
                  alt="Preview"
                  className="w-full max-h-60 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setMedia([])} // Clear array if image is removed
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 bg-white/80 rounded-full backdrop-blur-sm"
                  title="Remove image"
                >
                  <IoCloseCircle size={22} />
                </button>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
                {error}
              </div>
            )}

            {/* Footer Row: Media input + Actions buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">

              {/* Media input (picture icon button) */}
              <div className="flex items-center text-gray-500 hover:text-black transition-colors">
                <label htmlFor="edit-media" className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
                  <SlPicture size={16} />
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="media"
                  id="edit-media"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      // Save the file inside an array to preserve the structure
                      setMedia([e.target.files[0]]);
                      setError("");
                    }
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
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

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPostForm;