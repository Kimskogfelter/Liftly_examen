import React from "react";
import { Link } from "react-router-dom";

function CreatePost({ currentUser, onClose }) {

  // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
  // ? is there to prevent errors if currentUser is null or undefined
  const token = currentUser?.token;
  const profileImage = currentUser?.profileImage;
  const userId = currentUser?.id;

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