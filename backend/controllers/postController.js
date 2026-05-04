import { HttpError } from "../models/errorModel.js"
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import mongoose from "mongoose";
import { upload } from "../middleware/cloudinaryUpload.js";
// loading env var from .env
import 'dotenv/config';


// ---------------------------- CREATE POST --------------------------- 
// POST req: api/posts/create
// PROTECTED

export const createPost = async (req, res, next) => {

    try {


        // --------- check if user exist in database ----------
        const user = await User.findById(req.user.id)

        if (!user) {
            return next(new HttpError("User not found", 404));
        }

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

        // --------- create new post to database ----------

        let newPost;

        if (req.file) {

            // creates and adds post to "post" database
            newPost = await Post.create({ createdBy: user._id, content: content, media: req.file.path }) 
            // updates user database with created post in "user -> post"
            await User.findByIdAndUpdate(newPost.createdBy, {$push: {posts: newPost._id}}) 
        } else {

            newPost = await Post.create({ createdBy: user._id, content: content })
            await User.findByIdAndUpdate(newPost.createdBy, {$push: {posts: newPost._id}})

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
// GET req: api/posts/:postId
// PROTECTED

export const getPost = async (req, res, next) => {

    try {

        // fetch post from database using id from URL params
        // populate replaces createdBy ObjectId with user data (username + profileImage)
        const foundPost = await Post.findById(req.params.postId)
        .populate("createdBy", "username profileImage")
        // populate replaces comment ObjectIds with full comment documents
        // path is needed because we use the sorting option, if not path would not be required
        .populate({path: "comments", options: {sort: {createdAt: -1}}});

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


// ---------------------------- GET USER POSTS --------------------------- 
// GET req: api/posts/users/:userId/

export const getUserPosts = async (req, res, next) => {

    try {

        const { userId } = req.params;

        // fetch user from database 
        const fetchUser = await User.findById(userId);

        if (!fetchUser) {

            return next(new HttpError("User not found", 404))
        }

        // fetch all posts from one user from database
        const getPosts = await Post.find({ "createdBy": userId })
            .populate("createdBy", "username profileImage") // populates createdBy field with user data (username and profile image)
            .sort({ createdAt: -1 }) // sort by newest first
            .limit(20); // show only 20 at a time

        // check if posts doesnt exists
        if (getPosts.length === 0) {


            return next(new HttpError("No posts could be found", 404));
        }

        // return list of posts
        return res.status(200).json({ message: "Posts found: ", getPosts })

    } catch (error) {
        // Om något går fel när vi försöker hämta flera användare:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}



// ---------------------------- GET FOLLOWING POSTS --------------------------- 
// GET req: api/posts/following

export const getFollowingPosts = async (req, res, next) => {

    try {

        // fetch logged in user
        const loggedInUser = await User.findById(req.user.id);

        // fetch all posts from users you are following
        const followingPosts = await Post.find({createdBy: {$in: loggedInUser.following}})
            .populate("createdBy", "username profileImage") // populates createdBy field with user data (username and profile image)
            .sort({ createdAt: -1 }) // sort by newest first

        // check if posts doesnt exists
        if (followingPosts.length === 0) {


            return next(new HttpError("No posts could be found", 404));
        }

        // return list of posts
        return res.status(200).json({ message: "Posts found: ", followingPosts })

    } catch (error) {
        // Om något går fel när vi försöker hämta flera användare:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- GET SAVED POSTS --------------------------- 
// GET req: api/posts/saved
// PROTECTED

export const getSavedPosts = async (req, res, next) => {

    try {

           const savedPosts = await User.findById(req.user.id).populate({path: 'savedPosts', model: 'Post'})
           

            // meddela att det gick att sluta följa användaren
            return res.status(200).json({ message: "Saved posts: ", savedPosts })


        

    } catch (error) {
        // Om något går fel när vi försöker sluta följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- SAVE POST --------------------------- 
// POST req: api/posts/:postId/save
// PROTECTED

export const savePost = async (req, res, next) => {

    try {

        // fetch post id from params
        const { postId } = req.params;

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

        // check if post exists
        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({ message: "Post does not exist", postId })
        }

        // save post
        // addToSet adds the post to the savedPosts array only if it doesnt already exists 
        const savePost = await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedPosts: postId } }, { new: true })

        // check if savedPosts array is updated and show response
        if (savePost)
            return res.status(200).json({ message: "You saved post: ", postId })





    } catch (error) {
        // Om något går fel när vi försöker följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- UNSAVE POST --------------------------- 
// DELETE req: api/posts/:postId/unsave
// PROTECTED

export const unsavePost = async (req, res, next) => {

    try {

        // fetch post id from params
        const { postId } = req.params;

        // hämta inloggade användarens objekt via id
        const loggedInUser = await User.findById(req.user.id);
        // hämta endast inloggande användarens id och gör om till sträng
        const loggedInUserId = loggedInUser._id.toString();

        // error ifall man försöker avfölja sig själv
        if (userId === loggedInUserId) {

            return next(new HttpError("You cant unfollow yourself", 422))
        }

        // kolla om man följer användaren
        const alreadyFollowingUser = loggedInUser.following.includes(new mongoose.Types.ObjectId(userId));

        // om man INTE följer meddela det
        if (!alreadyFollowingUser) {

            return next(new HttpError("You are not following this user.", 422));

        }

        // 1. om man FÖLJER användaren ta bort den från "following"
        // 2. samt ta bort inloggade användaren som "follower"

        if (alreadyFollowingUser) {

            // 1
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { following: userId } }, { new: true })
            // 2
            await User.findByIdAndUpdate(userId, { $pull: { followers: loggedInUserId } }, { new: true })

            // meddela att det gick att sluta följa användaren
            return res.status(200).json({ message: "You unfollowed: ", userId })


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




// ---------------------------- LIKE POST --------------------------- 
// POST req: api/posts/:postId/like
// PROTECTED

export const likePost = async (req, res, next) => {

    try {

        // get post id
        const { postId } = req.params;
        // fetch post from db
        const post = await Post.findById(postId);
        // check if post exists
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        // check if post is liked be the req user
        const alreadyLikedPost = post.likes.includes(req.user.id);

        // if LIKED 
        if (alreadyLikedPost) {

            return next(new HttpError("You already like this post.", 422));

        }

        // if NOt liked, add to likes list
        if (!alreadyLikedPost) {

            const likedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: req.user.id } }, { new: true })

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
// DELETE req: api/posts/:postId/unlike 
// PROTECTED

export const unlikePost = async (req, res, next) => {

    try {

        // get post id
        const { postId } = req.params;
        // fetch post from db
        const fetchPost = await Post.findById(postId);
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

            const unlikedPost = await Post.findByIdAndUpdate(postId, { $pull: { likes: req.user.id } }, { new: true })

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



// ---------------------------- UPDATE POST --------------------------- 
// PATCH req: api/posts/:postId/update
// PROTECTED

export const updatePost = async (req, res, next) => {

    try {

        // fetch current post id
        const { postId } = req.params;

        // fecth post from db
        const fetchPost = await Post.findById(postId);


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
        const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true })


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





// ---------------------------- DELETE POST --------------------------- 
// DELETE req: api/posts/:postId
// PROTECTED

export const deletePost = async (req, res, next) => {


    try {

        // fetch post id from url params
        const { postId } = req.params;

        // find post in database
        const post = await Post.findById(postId);

        // if post cant be found 
        if (!post) {

            return res.status(404).json({ message: 'Post not found' });

        }

        // check user
        if (!post.createdBy.equals(req.user.id)) {

            return res.status(403).json({ message: "You are not allowed to delete this post" })
        }

        // remove post from savedPosts list
        await User.updateMany(
            {},
            {
                $pull: { savedPosts: postId }
            }
        );


        // remove all comments from the post
        await Comment.deleteMany({ post: postId });


        // remove post from user model
        await User.findByIdAndUpdate(req.user.id, {$pull: {posts: postId}})

        // delete post
        await Post.findByIdAndDelete(postId);

        return res.status(200).json(`Post with id: ${postId} was successfully removed from saved post lists and deleted from database`)


    } catch (error) {
        // Om något går fel när vi försöker radera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}
