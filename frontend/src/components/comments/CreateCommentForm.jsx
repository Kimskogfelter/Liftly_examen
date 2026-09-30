import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function CreateCommentForm({ currentUser, comments, setComments, postId }) {

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createComment = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post(`/posts/${postId}/comments/create`, { content, postId });
      const newComment = response.data.newComment;
      
      setComments([newComment, ...comments]);
      setContent("");
      // Trigga ett globalt event så att PostCard-komponenter i flödet direkt kan uppdatera sin kommentarsräknare
      window.dispatchEvent(new Event("commentCreated"));

    } catch (err) {
      const errorResponse = err.response?.data;
      setError(errorResponse?.message || "Your comment could not be created. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        action="POST"
        method="post"
        onSubmit={createComment}
        className="w-full max-w-lg mx-auto bg-white border rounded-lg border-gray-100 p-2 flex items-center gap-2 shadow-sm font-sans my-3 relative"
      >
        {/* Content input */}
        <input
          type="text"
          name="content"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none px-2 py-1 disabled:opacity-50"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="text-xs font-bold text-gray-800 hover:text-gray-800 disabled:text-gray-300 transition-colors cursor-pointer px-2 py-1 shrink-0"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>

        {/* Error message */}
        {error && (
          <p className="absolute left-2 -bottom-5 text-[10px] text-red-500 font-medium">
            {error}
          </p>
        )}
      </form>
    </>
  );
}

export default CreateCommentForm;