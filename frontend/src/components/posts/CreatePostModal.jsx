import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiImage } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
// Import the tag-input component
import { TagsInput } from "react-tag-input-component";

function CreatePostModal({ currentUser, onClose }) {
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
      // Always append category because backend needs it to add post to correct category IF chosen
      formData.append('category', category);

      // HASHTAGS
      // FormData only accepts strings or files. We use JSON.stringify to convert 
      // the hashtags array into a JSON string so it can be sent over the backend.
      formData.append('hashtags', JSON.stringify(hashtags));

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
        <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 text-left">

          <h3 className="text-sm font-bold text-gray-900 mb-3">Create Post</h3>

          <form onSubmit={createPost} className="space-y-3">
            {/* CONTENT textarea */}
            <div className="relative">
              <textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-27.5 text-xs text-gray-800 placeholder-gray-400 border border-zinc-200 rounded-lg p-3 resize-none focus:outline-none focus:border-zinc-400 bg-gray-50/30 transition-colors"
              ></textarea>
            </div>

            {/* MEDIA preview box (Supports both images and videos) */}
            {media.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
                {media.map((file, index) => {
                  const isVideoFile = file.type.startsWith("video/");
                  const fileUrl = URL.createObjectURL(file);

                  return (
                    <div key={index} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      {isVideoFile ? (
                        <video src={fileUrl} className="w-full h-full object-cover" controls={false} muted />
                      ) : (
                        <img src={fileUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}

                      {/* Remove file button */}
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition-colors cursor-pointer"
                      >
                        <IoCloseCircle size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* HASHTAGS Input */}
            <div className="text-xs [&_.rti\--container]:border-zinc-200! [&_.rti\--container]:bg-gray-50/30 [&_.rti\--container]:rounded-lg [&_.rti\--container]:p-2.5 [&_.rti\--container]:transition-colors [&_.rti\--container]:focus-within:border-zinc-400! [&_.rti\--tag]:bg-zinc-200/60 [&_.rti\--tag]:text-zinc-800 [&_.rti\--tag]:text-[11px] [&_.rti\--tag]:font-medium [&_.rti\--tag]:py-0.5 [&_.rti\--tag]:px-2 [&_.rti\--tag]:rounded-md [&_.rti\--input]:bg-transparent [&_.rti\--input]:text-xs [&_.rti\--input]:text-gray-800 [&_.rti\--input]:placeholder-gray-400 [&_.rti\--input]:p-0 [&_.rti\--input]:m-0">
              <TagsInput
                value={hashtags}
                onChange={(newTags) => {
                  // 1. Format tags to always have a single '#'
                  const formatted = newTags.map((tag) => {
                    const cleanTag = tag.trim().replace(/^#+/, "");
                    return cleanTag ? `#${cleanTag.toLowerCase()}` : ""; // Make lowercase to prevent duplicates
                  }).filter(Boolean);

                  // 2. Remove duplicates
                  const uniqueTags = [...new Set(formatted)];

                  setHashtags(uniqueTags);
                }}
                name="hashtags"
                placeHolder="hashtags (Space/Enter to add)"
                separators={[" "]}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Footer Row: Media button, Category dropdown, and Action buttons */}
              {/* MEDIA & CATEGORY options row */}
              <div className="flex items-center gap-2 pt-2">
                {/* Media upload button */}
                <label htmlFor="media" className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                  <FiImage size={15} className="text-zinc-800" />
                  <span>Media</span>
                  <input
                    className="hidden"
                    type="file"
                    name="media"
                    id="media"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const chosenFiles = Array.from(e.target.files);
                        setMedia([...media, ...chosenFiles]);
                        setError("");
                      }
                    }}
                  />
                </label>

                {/* Category Dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg appearance-none cursor-pointer outline-none transition-colors"
                  >
                    <option value="General">Category: General</option>
                    <option value="Breakfast">Category: Breakfast</option>
                    <option value="Lunch & Dinner">Category: Lunch & Dinner</option>
                    <option value="Desserts">Category: Desserts</option>
                    <option value="Candy">Category: Candy</option>
                    <option value="Snacks">Category: Snacks</option>
                    <option value="Supplements">Category: Supplements</option>
                    <option value="Training">Category: Training</option>
                    <option value="Cardio">Category: Cardio</option>
                    <option value="Lifting">Category: Lifting</option>
                    <option value="Music">Category: Music</option>
                    <option value="Activewear">Category: Activewear</option>
                    <option value="Mindset & Recovery">Category: Mindset & Recovery</option>
                    <option value="Helpme">Category: Helpme</option>
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[8px]">▼</span>
                </div>
              </div>

              {/* Action buttons row (CANCEL & POST) */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-xs shadow-sm"
                >
                  Post
                </button>
              </div>

           
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostModal;