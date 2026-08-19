import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SlPicture } from "react-icons/sl";
import { IoCloseCircle } from "react-icons/io5";

function CreatePostForm({ currentUser, onClose }) {
  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  const token = currentUser?.token;
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to remove a specific file from the preview list before uploading
  const removeMediaFile = (indexToRemove) => {
    setMedia(media.filter((_, index) => index !== indexToRemove));
  };

  // Function to create a post
  const createPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // CONTENT
      // Always append content, an empty string is perfectly fine for the backend
      formData.append('content', content);

      // CATEGORY
      // Always append category because backend needs it to add post to correct category IF choosen
      formData.append('category', category);

      // HASHTAGS
      let hashtagsArray = [];
      // Check if hashtags exists and is a valid string/array before splitting
      if (hashtags && typeof hashtags === "string" && hashtags.trim().length > 0) {
        hashtagsArray = hashtags.trim().split(/\s+/);
      } else if (Array.isArray(hashtags)) {
        hashtagsArray = hashtags;
      }

      // FormData only accepts strings or files. We use JSON.stringify to convert 
      // the hashtags array into a JSON string so it can be sent over the backend.
      formData.append('hashtags', JSON.stringify(hashtagsArray));

      // MEDIA
      // Loop through all media files and append them to the same 'media' key.
      // This allows Multer on the backend (upload.array('media')) to capture all of them.
      if (media.length > 0) {
        media.forEach((file) => {
          formData.append('media', file);
        });
      }

      // Send post data to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Post created successfully:", response.data);

      // Reset form fields and error message
      setContent("");
      setMedia([]);
      setHashtags([]);
      setCategory("General");
      setError("");

      // Redirect to home page after successful creation of post
      if (response.status === 201) {
        navigate('/home');
      }
      // Close the CreatePost component after successful post creation
      onClose();

    } catch (err) {
      // Handle errors and display error message to user
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

          <form onSubmit={createPost} className="space-y-3">
            {/* CONTENT textarea */}
            <div className="relative">
              <textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-30 p-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none text-xs bg-gray-50/50 transition-all focus:border-zinc-400"
              ></textarea>
            </div>

            {/* METADATA ROW: Category & Hashtags */}
            <div className="flex items-center gap-3 pt-1">
              {/* Category Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 px-2.5 focus:outline-none focus:border-zinc-400 cursor-pointer text-gray-700 font-medium transition-colors hover:bg-gray-100/70"
                >
                  <option value="General">General</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch & Dinner">Lunch & Dinner</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Candy">Candy</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Training">Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Lifting">Lifting</option>
                  <option value="Music">Music</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Mindset & Recovery">Mindset & Recovery</option>
                  <option value="Helpme">Helpme</option>
                </select>
              </div>

              {/* Hashtags Input */}
              <input
                type="text"
                placeholder="#hashtags (space-separated)"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="flex-1 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-zinc-300 transition-all"
              />
            </div>

            {/* MEDIA preview box (Supports both images and videos) */}
            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border border-gray-100 rounded-lg bg-gray-50">
                {media.map((file, index) => {
                  const isVideoFile = file.type.startsWith("video/");
                  const fileUrl = URL.createObjectURL(file);

                  return (
                    <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center">
                      {isVideoFile ? (
                        <video src={fileUrl} className="w-full h-full object-cover" controls={false} muted />
                      ) : (
                        <img src={fileUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}

                      {/* Remove file button */}
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="absolute top-1 right-1 text-white/80 hover:text-white drop-shadow-md transition-colors cursor-pointer"
                      >
                        <IoCloseCircle size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Footer Row: Media input, Hashtags input + Actions buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">

              {/* MEDIA input (picture icon button) */}
              <div className="flex items-center text-gray-500 hover:text-black transition-colors">
                <label htmlFor="media" className="cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
                  <SlPicture size={16} />
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="media"
                  id="media"
                  accept="image/*,video/*" // Allows both images and videos in the browser picker
                  multiple // Allows selecting multiple files at once
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      // Convert FileList into a regular array and merge with any existing selected files
                      const chosenFiles = Array.from(e.target.files);
                      setMedia([...media, ...chosenFiles]);
                      setError("");
                    }
                  }}
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