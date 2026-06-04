import { useState, React, useEffect } from "react";
import axios from "axios";
import PostFeed from "../components/posts/PostFeed";
import { useParams } from "react-router-dom";

function SearchPage({ currentUser }) {

  const [posts, setPosts] = useState([]);
  const token = currentUser?.token;
  const [error, setError] = useState("");

  // function to fetch posts
    const getPosts = async () => {

        try {

            // fetched created posts data from backend
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);

             console.log("Posts fetched successfully:", response.data);
            // update the posts state with the fetched array of posts from the backend
            setPosts(response.data.getAllPosts);
           
        } catch (err) {

            // handle errors and display error message to user
            const errorResponse = err.response.data;
            setError(errorResponse.message || "Posts could not be fetched. Please try again.");
        }
    };

    // call getPosts function
    useEffect(() => {
        getPosts();
    }, []);

    console.log("Posts in search page:", posts);

  // function to handle post editing and update the posts state
  const handleEditPost = (updatedPost) => {
    // Map through the posts and update the edited post in the posts state
    const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
    setPosts(updatedPosts); // Update the posts state
  };

  // function to handle post deletion and update the posts state
  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts);
  };

 

  return (
    <>
      <section className="pt-24 flex-1 p-4">
        {/* render post feed component to display posts */}
        <PostFeed
          posts={posts}
          currentUser={currentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          layout="list"
        />
      </section>

    </>
  );
}

export default SearchPage;