import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/posts/PostCard";
import CreateCommentForm from "../components/comments/CreateCommentForm";
import CommentList from "../components/comments/CommentList";


function SinglePostPage({ currentUser, setCurrentUser }) {

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
            const errorResponse = err.response?.data;
            setError(errorResponse?.message || "Your post details could not be fetched. Please try again.");

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
               <div className="mt-8 py-6">
                    <PostCard post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} isDetailView={true} />

                    <CreateCommentForm
                        currentUser={currentUser}
                        comments={comments}
                        setComments={setComments}
                        postId={postId}
                    />

                    <CommentList currentUser={currentUser} comments={comments} />
                </div>
                </>
            )}
        </>
    );
}

export default SinglePostPage;