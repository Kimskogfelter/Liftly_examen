import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CreateCommentForm({ currentUser, comments, setComments, postId }) {

  // states and variables
  const token = currentUser?.token;
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // function to create comment
  const createComment = async (e) => {
    e.preventDefault();
    try {

      // send comment data to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments/create`, { content, postId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Comment created successfully:", response.data);

      // add the new comment to the posts state to update the UI
      const newComment = response.data.comments;
      setComments([newComment, ...comments]);

      // reset form fields and error message
      setContent("");
      setError("");

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message || "Your comment could not be created. Please try again.");
    }
  };

  return (
    <>
      <form
        action="POST"
        method="post"
        onSubmit={createComment}
        className="w-full max-w-md mx-auto bg-white border border-gray-100 rounded-xl p-2 flex items-center gap-2 shadow-sm font-sans my-3"
      >
        {/* Content input */}
        <input
          type="text"
          name="content"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none px-2 py-1"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="text-xs font-bold text-red-500 hover:text-red-600 disabled:text-gray-300 transition-colors cursor-pointer px-2 py-1 shrink-0"
          disabled={!content.trim()}
        >
          Post
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