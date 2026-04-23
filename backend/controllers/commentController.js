import { HttpError } from "../models/errorModel.js"
import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import mongoose from "mongoose";

// ---------------------------- CREATE COMMENT --------------------------- 
// POST req: api/posts/:postId/comments/create
// PROTECTED

export const createComment = async (req, res, next) => {

    try {

        // --------- content ----------

        // get content input from frontend
        const { content } = req.body;

            // validate required field
        if (!content) {

            return next(new HttpError("Fill in content", 422))
        }


        // validate if content length is too short
        if (content.length < 5) {
            return next(new HttpError("Content should be at least 5 characters long", 422))
        }

        // --------- post ----------

        // get postId from url
        const { postId } = req.params;

        // check if post exists
        const postExist = await Post.findById(postId);

        if(!postExist) {

            return next(new HttpError("Post not found", 404));

        }

        // --------- create new comment to database ----------

        const newComment = await Comment.create({ createdBy: req.user.id, content: content, post: postId })

        return res.status(201).json({ message: 'Comment created: ', newComment });


    } catch (error) {
        // Om något går fel när vi försöker registrera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- GET COMMENT --------------------------- 
// GET req: api/posts/comments/:commentId
// PROTECTED

export const getComment = async (req, res, next) => {

    try {

        // fetch comment from database using id from URL params
        const { commentId } = req.params;

        // use populate to display data from another model "User"
        // only shows username and profile image in "createdBy" insted of objectId
        const foundComment = await Comment.findById(commentId).populate("createdBy", "username profileImage");

        // check if comment doesnt exists
        if (!foundComment) {

            return next(new HttpError("No comment could be found with that id", 404))
        }

        // return comment data
        return res.status(200).json({ message: 'Comment found: ', foundComment });

    } catch (error) {
        // Om något går fel när vi försöker hämta en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- GET COMMENTS --------------------------- 
// GET req: api/posts/:postId/comments
// PROTECTED

export const getComments = async (req, res, next) => {

    try {

        // fetch id for current post
        const { postId } = req.params;

        // check if post exists in database
        const post = await Post.findById(postId);

        if(!post) {

            return next(new HttpError("Post not found", 404))

        }

        // fetch all comments from current postId
        const getAllComments = await Comment.find({ post: postId })
                                .populate("createdBy", "username profileImage")
                                .sort({ createdAt: -1 })
                                .limit(20);


        // return list of comments
        return res.status(200).json({ message: "Comments fetched", getAllComments })

    } catch (error) {
        // Om något går fel när vi försöker hämta flera användare:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}



// ---------------------------- DELETE COMMENT --------------------------- 
// DELETE req: api/posts/:postId/comments/:commentId
// PROTECTED

export const deleteComment = async (req, res, next) => {

    const { postId, commentId } = req.params;

    try {

        // find comment
        const findComment = await Comment.findById(commentId);

        // if comment cant be found 
        if (!findComment) {

            return res.status(404).json({ message: 'Comment not found' });

        } else {


            // remove comment from post
            await Post.findByIdAndUpdate(postId, {
                $pull: { comments: commentId }
            })

            // delete comment
            await Comment.findByIdAndDelete(commentId);
            return res.status(200).json(`Comment with id: ${commentId} was successfully removed from post: ${postId} and deleted from database`)

        }



    } catch (error) {
        // Om något går fel när vi försöker radera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}