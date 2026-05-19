import { useState, React } from "react";
import GetPosts from "../functions/GetPosts";
import Feed from "../components/Feed";
import { useParams } from "react-router-dom";
import SearchBar from "../components/layout/SearchBar";

function Home({ currentUser }) {

  const [posts, setPosts] = useState([]);

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
      <SearchBar/>
      <section className="flex-1 p-4">
        {/* render GetPosts component to fetch all posts */}
        <GetPosts
          currentUser={currentUser}
          setPosts={setPosts}
          posts={posts}
        />
        {/* render Feed component to display posts */}
        <Feed
          posts={posts}
          currentUser={currentUser}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
        />
      </section>

    </>
  );
}

export default Home;