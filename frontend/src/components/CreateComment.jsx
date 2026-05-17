import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CreateComment({ currentUser, comments, setComments, postId }) {

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
      <form action="POST" method="post" onSubmit={createComment}>
        {/* Content textarea */}
        <textarea name="content" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        {/* Error message */}
        {error && <p>{error}</p>}
        {/* Submit button */}
        <button type="submit">Comment</button>
      </form>
    </>
  );
}

export default CreateComment;