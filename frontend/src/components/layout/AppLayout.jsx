import Navbar from "./Navbar";
import CreatePostForm from "../posts/CreatePostForm";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function AppLayout({ currentUser, setCurrentUser }) {

    // STATE FOR SHOW CREATE POST FORM
    // the state to controll if create post form should be visable or not must be in the app layout 
    // as we want the create post form to render in the overall layout, not in the navbar
    const [showCreatePost, setShowCreatePost] = useState(false);

    // state for selected category, so navbar and outlet can reach it
    const [selectedCategory, setSelectedCategory] = useState("All");

    return (

        <div className="flex">
            {/* Navbar */}
            {/* onOpenCreatePost function passed as prop to Navbar */}
            <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} onOpenCreatePost={() => setShowCreatePost(true)} selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory} />
            {/* render CreatePost component when showCreatePost is true */}
            {
                showCreatePost && (
                    <CreatePostForm
                        currentUser={currentUser}
                        onClose={() => setShowCreatePost(false)}
                    />
                )
            }
            <main className="flex-1 p-4">

                {/* Outlet helps render the active route component */}
                {/* context helps send selected category to category page to render selected posts */}
                <Outlet context={{ selectedCategory }} />
            </main>
        </div>
    );
}

export default AppLayout;