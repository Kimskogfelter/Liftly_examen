import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Importera useLocation
import api from "../../api/axios";
import { FiImage, FiChevronDown } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { BsSpotify } from "react-icons/bs";
import { TagsInput } from "react-tag-input-component";

function CreatePostModal({ currentUser, onClose }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [spotifyUrl, setSpotifyUrl] = useState(null);
  const [showSpotifyInput, setShowSpotifyInput] = useState(false);
  
  const [category, setCategory] = useState("General");
  const [subCategory, setSubCategory] = useState("");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // <-- Håll koll på var användaren befinner sig

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setExpandedCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeMediaFile = (indexToRemove) => {
    setMedia(media.filter((_, index) => index !== indexToRemove));
  };

  const createPost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('spotifyUrl', spotifyUrl || "");
      formData.append('hashtags', JSON.stringify(hashtags));

      if (media.length > 0) {
        media.forEach((file) => {
          formData.append('media', file);
        });
      }

      const response = await api.post(`/posts/create`, formData);

      if (response.status === 201) {
        window.dispatchEvent(new Event("postCreated"));
        onClose();

        // Om vi INTE är på startsidan, navigera dit så inlägget syns direkt i flödet
        if (location.pathname !== "/") {
          navigate("/");
        }
      }

    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your post could not be created. Please try again.");
      setIsSubmitting(false); // Återställ endast vid fel
    }
  };

  const getDisplayCategoryText = () => {
    if (subCategory && subCategory !== category) {
      return `Category: ${category} → ${subCategory}`;
    }
    return `Category: ${category}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-lg p-5 shadow-2xl border border-gray-100 text-left">

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

            {/* MEDIA preview box */}
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
                  const formatted = newTags.map((tag) => {
                    const cleanTag = tag.trim().replace(/^#+/, "");
                    return cleanTag ? `#${cleanTag.toLowerCase()}` : "";
                  }).filter(Boolean);
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

            {/* SPOTIFY INPUT FIELD */}
            {showSpotifyInput && (
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <BsSpotify size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    placeholder="Paste Spotify track, playlist or album URL..."
                    value={spotifyUrl || ""}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-gray-50/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSpotifyUrl(null);
                    setShowSpotifyInput(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <IoCloseCircle size={18} />
                </button>
              </div>
            )}

            {/* MEDIA & CUSTOM DROPDOWN OPTIONS ROW */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
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

              <button
                type="button"
                onClick={() => setShowSpotifyInput((prev) => !prev)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  spotifyUrl || showSpotifyInput
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                <BsSpotify size={15} className={spotifyUrl || showSpotifyInput ? "text-emerald-500" : "text-zinc-800"} />
                <span>Spotify</span>
              </button>

              {/* MOBILANPASSAD ACCORDION-DROPDOWN */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg inline-flex items-center gap-1.5 cursor-pointer outline-none transition-colors relative"
                >
                  <span>{getDisplayCategoryText()}</span>
                  <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 text-xs font-medium text-zinc-700 max-h-64 overflow-y-auto">
                    
                    <button
                      type="button"
                      onClick={() => { setCategory("General"); setSubCategory(""); setIsDropdownOpen(false); setExpandedCategory(null); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors ${category === "General" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                    >
                      General
                    </button>

                    <div>
                      <div 
                        onClick={() => setExpandedCategory(expandedCategory === "Food" ? null : "Food")}
                        className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors flex items-center justify-between cursor-pointer ${category === "Food" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); setCategory("Food"); setSubCategory("Food"); setIsDropdownOpen(false); setExpandedCategory(null); }}>Food</span>
                        <FiChevronDown size={12} className={`text-zinc-400 transition-transform ${expandedCategory === "Food" ? "rotate-180" : ""}`} />
                      </div>

                      {expandedCategory === "Food" && (
                        <div className="bg-zinc-50/80 py-1 border-y border-zinc-100">
                          {["Breakfast", "Lunch & Dinner", "Desserts", "Candy", "Snacks"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => { setCategory("Food"); setSubCategory(sub); setIsDropdownOpen(false); setExpandedCategory(null); }}
                              className={`w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-200/50 transition-colors text-zinc-600 ${subCategory === sub ? "font-semibold text-black bg-zinc-200/40" : ""}`}
                            >
                              └ {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => { setCategory("Supplements"); setSubCategory(""); setIsDropdownOpen(false); setExpandedCategory(null); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors ${category === "Supplements" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                    >
                      Supplements
                    </button>

                    <div>
                      <div 
                        onClick={() => setExpandedCategory(expandedCategory === "Training" ? null : "Training")}
                        className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors flex items-center justify-between cursor-pointer ${category === "Training" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); setCategory("Training"); setSubCategory("Training"); setIsDropdownOpen(false); setExpandedCategory(null); }}>Training</span>
                        <FiChevronDown size={12} className={`text-zinc-400 transition-transform ${expandedCategory === "Training" ? "rotate-180" : ""}`} />
                      </div>

                      {expandedCategory === "Training" && (
                        <div className="bg-zinc-50/80 py-1 border-y border-zinc-100">
                          {["Cardio", "Lifting", "CrossFit", "Powerlifting", "Running", "Other"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => { setCategory("Training"); setSubCategory(sub); setIsDropdownOpen(false); setExpandedCategory(null); }}
                              className={`w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-200/50 transition-colors text-zinc-600 ${subCategory === sub ? "font-semibold text-black bg-zinc-200/40" : ""}`}
                            >
                              └ {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div 
                        onClick={() => setExpandedCategory(expandedCategory === "Music" ? null : "Music")}
                        className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors flex items-center justify-between cursor-pointer ${category === "Music" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); setCategory("Music"); setSubCategory("Music"); setIsDropdownOpen(false); setExpandedCategory(null); }}>Music</span>
                        <FiChevronDown size={12} className={`text-zinc-400 transition-transform ${expandedCategory === "Music" ? "rotate-180" : ""}`} />
                      </div>

                      {expandedCategory === "Music" && (
                        <div className="bg-zinc-50/80 py-1 border-y border-zinc-100">
                          {["Electronic", "Rock", "HipHop", "Pop", "R&B", "Reggaeton", "Other"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => { setCategory("Music"); setSubCategory(sub); setIsDropdownOpen(false); setExpandedCategory(null); }}
                              className={`w-full text-left pl-7 pr-3.5 py-1.5 hover:bg-zinc-200/50 transition-colors text-zinc-600 ${subCategory === sub ? "font-semibold text-black bg-zinc-200/40" : ""}`}
                            >
                              └ {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => { setCategory("Activewear"); setSubCategory(""); setIsDropdownOpen(false); setExpandedCategory(null); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors ${category === "Activewear" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                    >
                      Activewear
                    </button>

                    <button
                      type="button"
                      onClick={() => { setCategory("Mindset & Recovery"); setSubCategory(""); setIsDropdownOpen(false); setExpandedCategory(null); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors ${category === "Mindset & Recovery" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                    >
                      Mindset & Recovery
                    </button>

                    <button
                      type="button"
                      onClick={() => { setCategory("Helpme"); setSubCategory(""); setIsDropdownOpen(false); setExpandedCategory(null); }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-zinc-100 transition-colors ${category === "Helpme" ? "bg-zinc-50 font-semibold text-black" : ""}`}
                    >
                      Helpme
                    </button>

                  </div>
                )}
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer text-xs disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-xs shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostModal;