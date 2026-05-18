import { useState, React } from "react";
import GetPosts from "../functions/GetPosts";
import Feed from "../components/Feed";

function Home({ currentUser }) {

  const [posts, setPosts] = useState([]);

  return (
    <>
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Welcome to the Home Page</h1>
        
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
            currentUser={currentUser}
          />
        </section>
     
    </>
  );
}

export default Home;