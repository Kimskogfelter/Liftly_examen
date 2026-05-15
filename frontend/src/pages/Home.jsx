import { useState, React } from "react";
import Navbar from "../components/Navbar";

function Home({currentUser}) {

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = currentUser?.token;

  return (
    <>
      <div className="flex">
        <Navbar currentUser={currentUser} />
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Welcome to the Home Page</h1>
         
        </section>
      </div>
    </>
  );
}

export default Home;