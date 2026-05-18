import React from "react";
import Navbar from "../components/layout/Navbar";

function SavedPosts({currentUser}) {
  return (
    <>
      <div className="flex">
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Welcome to the Saved Posts Page</h1>
        </section>
      </div>
    </>
  );
}

export default SavedPosts;