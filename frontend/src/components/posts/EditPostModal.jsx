import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SlPicture } from "react-icons/sl";

function EditPostModal({ onClose, setPosts, posts, post, currentUser }) {

  const postId = post._id;
  const navigate = useNavigate();
  const [content, setContent] = useState("");
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
      setPosts([updatedPost, ...posts]);
      console.log("Updated post in EditPostModal:", updatedPost);

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
      <form action="POST" method="post" onSubmit={editPost}>
        {/* Content textarea */}
        <textarea name="content" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        {/* Media input */}
        {/* <label htmlFor="media"><SlPicture/></label>
        <input className="hidden" type="file" name="media" id="media" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} /> */}
        {/* Error message */}
        {error && <p>{error}</p>}
        {/* Submit button */}
        <button type="submit">Update Post</button>
        {/* Cancel button */}
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </>
  );
}

export default EditPostModal;