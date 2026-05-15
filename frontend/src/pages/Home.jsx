import { useState, React } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import GetPosts from "../components/GetPosts";
import Feed from "../components/Feed";

function Home({ currentUser }) {

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = currentUser?.token;
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <>
      <div className="flex">
        {/* Navbar */}
        {/* onOpenCreatePost prop passed to Navbar */}
        <Navbar currentUser={currentUser} onOpenCreatePost={() => setShowCreatePost(true)} />
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Welcome to the Home Page</h1>
          {/* render CreatePost component when showCreatePost is true */}
          {
            showCreatePost && (
              <CreatePost
                setPosts={setPosts}
                posts={posts}
                currentUser={currentUser}
                onClose={() => setShowCreatePost(false)}
              />
            )
          }
          {/* render GetPosts component to fetch all posts */}
          <GetPosts
            currentUser={currentUser}
            setPosts={setPosts}
            posts={posts}
          />
          {/* render Feed component to display posts */}
          <Feed
            posts={posts}
            onSetPosts={setPosts}
          />
        </section>
      </div>
    </>
  );
}

export default Home;