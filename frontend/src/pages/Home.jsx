import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <div className="flex">
        <Navbar />
        <section className="flex-1 p-4">
          <h1 className="items-center flex justify-center text-center">Welcome to the Home Page</h1>
        </section>
      </div>
    </>
  );
}

export default Home;