import { use } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DeletePost ({ post, onClose }) {

    const token = localStorage.getItem("token");
    const [error, setError] = useState(""); 
    const { postId } = useParams();


    const deletePost = async (e) => {
   
    try {

      // delete post data from backend
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Post deleted successfully:", response.data);

    
      // close the deletePost component after successful post deletion
      onClose();

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message || "Your post could not be deleted. Please try again.");
    }
  };



    return (
        <>
            <div>
                <p>Are you sure you want to delete this post?</p>
                <button onClick={deletePost}>Yes, delete</button>
                <button onClick={onClose}>No, cancel</button>
                {error && <p>{error}</p>}
            </div>
        </>
    )
}   

export default DeletePost;