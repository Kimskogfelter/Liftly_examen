import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { SlPicture } from "react-icons/sl";

function CreatePostForm({ currentUser, onClose }) {

  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  // ? is there to prevent errors if currentUser is null or undefined
  const token = currentUser?.token;
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // function to create post
  const createPost = async (e) => {
    e.preventDefault();
    try {

      // send post data to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, { content, media }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Post created successfully:", response.data);

      // reset form fields and error message
      setContent("");
      setMedia(null);
      setError("");


      // redirect to home page after successful creation of post
      if (response.status === 201) {
        navigate('/home');
      }
      // close the CreatePost component after successful post creation
      onClose();

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be created. Please try again.");
    }
  };

  return (
    <>
      {/* Outer card wrapper - Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">

        {/* Create container - The actual white modal box containing the form */}
        <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 text-left">

          <h3 className="text-sm font-bold text-gray-900 mb-3">Create Post</h3>

          <form action="POST" method="post" onSubmit={createPost} className="space-y-3">
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
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Footer Row: Media input + Actions buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">

              {/* Media input (picture icon button) */}
              <div className="flex items-center text-gray-500 hover:text-black transition-colors">
                <label htmlFor="media" className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
                  <SlPicture size={16} />
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="media"
                  id="media"
                  accept="image/*"
                  onChange={(e) => setMedia(e.target.files[0])}
                />
              </div>

              {/* Buttons (Cancel & Post) */}
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
                  Post
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostForm;