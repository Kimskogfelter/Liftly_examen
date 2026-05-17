import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import DisplayPost from "../components/DisplayPost";
import CreateComment from "../components/CreateComment";
import CommentList from "../components/CommentList";
import { useParams } from "react-router-dom";

function SinglePost({ currentUser }) {

    // states and variables
    const token = currentUser?.token;
    const { postId } = useParams(); // get post ID from URL parameters
    const [post, setPost] = useState(null); // state to hold post details
    const [comments, setComments] = useState([]); // state to hold comments for the post
    const [error, setError] = useState("");


    // function to fetch single post details and comments
    const fetchPostDetails = async (e) => {
        
        try {

            // fetch post data from backend
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Post details fetched successfully:", response.data);
            // update the post and comments state with the fetched data from the backend
            setPost(response.data.post);
            setComments(response.data.post.comments);

        } catch (err) {

            console.log(err.response);
            // handle errors and display error message to user
            const errorResponse = err.response.data;
            setError(errorResponse.message || "Your post details could not be fetched. Please try again.");

            // reset post and comments state to null
            setPost(null);
            setComments([]);
        }
    };

    // call fetchPostDetails function
    useEffect(() => {
        fetchPostDetails();
    }, []);

    console.log("Post in SinglePost page:", post);

    return (
        <>  
            {/* if post exist execute below code */}
            {post && (
                <>
                    <DisplayPost post={post} />

                    <CreateComment
                        currentUser={currentUser}
                        comments={comments}
                        setComments={setComments}
                        postId={postId}
                    />

                    <CommentList comments={comments} />
                </>
            )}
        </>
    );
}

export default SinglePost;