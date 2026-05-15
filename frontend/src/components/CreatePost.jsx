import React from "react";
import { Link } from "react-router-dom";

function CreatePost({ currentUser, onClose }) {

  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  // ? is there to prevent errors if currentUser is null or undefined
  const token = currentUser?.token;
  const profileImage = currentUser?.profileImage;
  const userId = currentUser?.id;

   // function to create post
  const createPost = async (e) => {
    e.preventDefault();     
    try {

      // send post data to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, { content, media }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Post created successfully:", response.data);
      // redirect to home page after successful post creation
      if (response.status === 201) {
        navigate('/home');
      }

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message || "Your post could not be created. Please try again.");
    }
  };

  return (
    <>
    <form action="POST" method="post">
        <textarea name="content" placeholder="What's on your mind?"></textarea>
        <input type="file" name="media" accept="image/*" />
        <button type="submit">Post</button>
        <button type="button" onClick={onClose}>Cancel</button>
    </form>
    </>
  );
}

export default CreatePost;