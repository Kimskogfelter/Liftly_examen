import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();

    // function to fetch single post details and comments
    const fetchPostDetails = async () => {
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
            const errorResponse = err.response?.data;
            setError(errorResponse?.message || "Your post details could not be fetched. Please try again.");

            setPost(null);
            setComments([]);
        }
    };

    // call fetchPostDetails function
    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    // function to handle post editing and update the posts state
    const handleEditPost = (updatedPost) => {
        setPost(updatedPost);
    };

    // function to handle post deletion and update UI/redirect
    const handleDeletePost = (postId) => {
        navigate("/home");
    };  

    return (
        <>
            {error && (
                <div className="max-w-2xl mx-auto mt-20 px-4">
                    <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</p>
                </div>
            )}

            {/* if post exist execute below code */}
            {post && (
                <section className="flex-1 max-w-2xl mx-auto px-4 pt-16 xl:pt-6 pb-24 font-sans text-gray-800">
                    <PostCard 
                        post={post} 
                        currentUser={currentUser} 
                        setCurrentUser={setCurrentUser} 
                        handleEditPost={handleEditPost}
                        handleDeletePost={handleDeletePost} 
                        isDetailView={true} 
                    />

                    <CreateCommentForm
                        currentUser={currentUser}
                        comments={comments}
                        setComments={setComments}
                        postId={postId}
                    />

                    <CommentList currentUser={currentUser} comments={comments} />
                </section>
            )}
        </>
    );
}

export default SinglePostPage;