import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function GetPost({ currentUser, setPosts, posts }) {

    // Get token, profile photo, and user ID from localStorage through currentUser prop passed down from App.jsx
    // ? is there to prevent errors if currentUser is null or undefined
    const token = currentUser?.token;
    const [error, setError] = useState("");

    // function to create post
    const getPosts = async () => {

        try {

            // fetched created posts data from backend
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // update the posts state with the fetched posts data to update the UI
            setPosts(response.data);
            console.log("Posts fetched successfully:", response.data);

           

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

    console.log("Posts in GetPosts component:", posts);

    return (
        <>
            
        </>
    );
}

export default GetPost;