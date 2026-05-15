import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { SlPicture } from "react-icons/sl";

function CreatePost({ currentUser, onClose, setPosts, posts }) {

  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  // ? is there to prevent errors if currentUser is null or undefined
  const token = currentUser?.token;
  const profileImage = currentUser?.profileImage;
  const userId = currentUser?.id;
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
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Post created successfully:", response.data);

      // add the new post to the posts state to update the UI
      const newPost = response.data;
      setPosts([newPost, ...posts]);

      // redirect to home page after successful post creation
      if (response.status === 201) {
        navigate('/home');
      }

      // reset form fields and error message
      setContent("");
      setMedia(null);
      setError("");

      // close the CreatePost component after successful post creation
      onClose();

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message || "Your post could not be created. Please try again.");
    }
  };

  return (
    <>
      <form action="POST" method="post" onSubmit={createPost}>
        {/* Content textarea */}
        <textarea name="content" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        {/* Media input */}
        <label htmlFor="media"><SlPicture/></label>
        <input className="hidden" type="file" name="media" id="media" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} />
        {/* Error message */}
        {error && <p>{error}</p>}
        {/* Submit button */}
        <button type="submit">Post</button>
        {/* Cancel button */}
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </>
  );
}

export default CreatePost;