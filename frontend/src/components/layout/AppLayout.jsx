import Navbar from "./Navbar";
import CreatePostModal from "../posts/CreatePostModal";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function AppLayout({ currentUser, setCurrentUser }) {

    const [showCreatePost, setShowCreatePost] = useState(false);

    return (

        <div className="flex">
            {/* Navbar */}
            {/* onOpenCreatePost function passed as prop to Navbar */}
            <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} onOpenCreatePost={() => setShowCreatePost(true)} />
            {/* render CreatePost component when showCreatePost is true */}
            {
                showCreatePost && (
                    <CreatePostModal
                        currentUser={currentUser}
                        onClose={() => setShowCreatePost(false)}
                    />
                )
            }
            <main className="flex-1 p-4">
                {/* Outlet helps render the active route component */}
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;