import { HttpError } from "../models/errorModel.js"
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import { upload } from "../middleware/cloudinaryUpload.js";
// loading env var from .env
import 'dotenv/config';


// ---------------------------- CREATE POST --------------------------- 
// POST req: api/posts/create
// PROTECTED

export const createPost = async (req, res, next) => {

    try {

        // get content input from frontend
        const { content } = req.body;

        // validate required field
        if (!content) {

            return next(new HttpError("Fill in content", 422))
        }

        // --------- content ----------

        // validate if content length is too short
        if (content.length < 5) {
            return next(new HttpError("Content should be at least 5 characters long", 422))
        }

        // --------- check if user exist in database ----------
        const user = await User.findById(req.user.id)

        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        // --------- create new post to database ----------

        let newPost;

        if (req.file) {

            newPost = await Post.create({ createdBy: user._id, content: content, media: req.file.path })
        } else {

            newPost = await Post.create({ createdBy: user._id, content: content })

        }

        return res.status(201).json({ message: 'Post created: ', newPost });


    } catch (error) {
        // Om något går fel när vi försöker registrera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- GET POST --------------------------- 
// GET req: api/posts/:ID
// PROTECTED

export const getPost = async (req, res, next) => {

    try {

        // fetch post from database using id from URL params
        // needed to display full post details on frontend
        // only shows username and profile image in "createdBy"
        const foundPost = await Post.findById(req.params.id).populate("createdBy", "username profileImage");

        // check if post doesnt exists
        if (!foundPost) {

            return next(new HttpError("No post could be found with that id", 404))
        }

        // return post data
        return res.status(200).json({ message: 'Post found: ', foundPost });

    } catch (error) {
        // Om något går fel när vi försöker hämta en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- GET POSTS --------------------------- 
// GET req: api/posts
// PROTECTED

export const getPosts = async (req, res, next) => {

    try {

        // fetch all posts from database
        const getAllPosts = await Post.find()
            .populate("createdBy", "username profileImage") // populates createdBy field with user data (username and profile image)
            .sort({ createdAt: -1 }) // sort by newest first
            .limit(20); // show only 20 at a time

        // check if posts doesnt exists
        if (getAllPosts.length === 0) {

            return next(new HttpError("No posts could be found", 404));
        }

        // return list of posts
        return res.status(200).json({ message: "Posts found: ", getAllPosts })

    } catch (error) {
        // Om något går fel när vi försöker hämta flera användare:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- UPDATE POST --------------------------- 
// PATCH req: api/posts/:id/update
// PROTECTED

export const updatePost = async (req, res, next) => {

    try {

        // fetch current post id
        const targetPostId = req.params.id;

        // fecth post from db
        const fetchPost = await Post.findById(targetPostId)


        // if post not found
        if (!fetchPost) {

            return next(new HttpError("Post not found", 404))
        }


        // check if post is created by req user
        // with mongoDB method "equals" that compare objectId with string
        // no need to convert
        if (!fetchPost.createdBy.equals(req.user.id)) {

            return res.status(403).json({ message: "You are not allowed to edit this post" })
        }

        // fetch content from frontend
        const { content } = req.body;


        // update post
        const updatedPost = await Post.findByIdAndUpdate(targetPostId, { content }, { new: true })


        // success message
        return res.status(200).json({ message: "Post updated: ", updatedPost })


    } catch (error) {
        // Om något går fel när vi försöker uppdatera en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- LIKE POST --------------------------- 
// POST req: api/posts/:id/like
// PROTECTED

export const likePost = async (req, res, next) => {

    try {

        // get post id
        const targetPostId = req.params.id;
        // fetch post from db
        const fetchPost = await Post.findById(targetPostId);
        // check if post exists
        if (!fetchPost) {
            return next(new HttpError("Post not found", 404));
        }

        // check if post is liked be the req user
        const alreadyLikedPost = fetchPost.likes.includes(req.user.id);

        // if LIKED 
        if (alreadyLikedPost) {

            return next(new HttpError("You already like this post.", 422));

        }

        // if NOt liked, add to likes list
        if (!alreadyLikedPost) {

            const likedPost = await Post.findByIdAndUpdate(targetPostId, { $push: { likes: req.user.id } }, { new: true })

            return res.status(200).json({
                message: "Post liked",
                likesCount: likedPost.likes.length,
                post: likedPost
            })


        }

    } catch (error) {
        // Om något går fel när vi försöker sluta följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- UNLIKE POST --------------------------- 
// DELETE req: api/posts/:id/unlike 
// PROTECTED

export const unlikePost = async (req, res, next) => {

    try {

        // get post id
        const targetPostId = req.params.id;
        // fetch post from db
        const fetchPost = await Post.findById(targetPostId);
        // check if post exists
        if (!fetchPost) {
            return next(new HttpError("Post not found", 404));
        }

        // check if post is liked be the req user
        const alreadyLikedPost = fetchPost.likes.includes(req.user.id);

        // if not LIKED 
        if (!alreadyLikedPost) {

            return next(new HttpError("You havent liked this post.", 422));

        }

        // if post is LIKED remove from liked list
        if (alreadyLikedPost) {

            const unlikedPost = await Post.findByIdAndUpdate(targetPostId, { $pull: { likes: req.user.id } }, { new: true })

            return res.status(200).json({
                message: "Post unliked",
                likesCount: unlikedPost.likes.length,
                post: unlikedPost
            })


        }

    } catch (error) {
        // Om något går fel när vi försöker sluta följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}



// ---------------------------- DELETE POST --------------------------- 
// DELETE req: api/posts/:ID
// PROTECTED

export const deletePost = async (req, res, next) => {

    const { id } = req.params;

    try {

        // find post 
        const findPost = await Post.findById(id);

        // if post cant be found 
        if (!findPost) {

            return res.status(404).json({ message: 'Post not found' });

        } else {

            // remove post from savedPosts list
            await User.updateMany(
                {}, // all users
                {
                    $pull: {
                        savedPosts: id,

                    }
                }
            );

            // delete post
            await Post.findByIdAndDelete(id);
            return res.status(200).json(`Post with id: ${id} was successfully removed from saved post lists and deleted from database`)

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
