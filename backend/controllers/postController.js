import { HttpError } from "../models/errorModel.js"
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import mongoose from "mongoose";
import { upload } from "../middleware/cloudinaryUpload.js";
// loading env var from .env
import 'dotenv/config';
import path from "path";


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

        // get inputs from frontend
        // --------- content, hashtags -----------
        const { content, hashtags } = req.body;

        // --------- media -----------
        let mediaFile = req.file;

        // validate required fields
        // if theres NO text OR empty spaces, 
        // AND theres NO picture... throw an error!
        if ((!content || content.trim().length === 0) && !mediaFile) {
            return next(new HttpError("You can't create an empty post. Add some text or an image!", 422));
        }

        // --------- create new post to database ----------

        // 1. Remake HASHTAGS from JSON-string to real array (becuase its sent via FormData)
        // If hashtags is missing or empty, set empty arrah [] as fallback
        let parsedHashtags = [];
        if (hashtags) {
            parsedHashtags = JSON.parse(hashtags);
        }

        // 2. Build post object with fields that ALWAYS should be there
        const postObject = {
            createdBy: user._id,
            hashtags: parsedHashtags
        };

        // 3. Add CONTENT only if user have written text
        if (content && content.trim().length > 0) {
            postObject.content = content;
        }

        // 4. Add MEDIA only if user have choosen a image/video
        if (mediaFile) {
            postObject.media = mediaFile.path;
        }

        // 5. Create post once in database with finished post object
        const newPost = await Post.create(postObject);

        // 6. Update users database information with new post
        await User.findByIdAndUpdate(newPost.createdBy, { $push: { posts: newPost._id } });

        return res.status(201).json({ message: 'Post created successfully', newPost });



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
        const { postId } = req.params;

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

        // populate replaces createdBy ObjectId with user data (username + profileImage)
        const post = await Post.findById(postId)
            .populate("createdBy", "username profileImage")
            // first populate replaces comment ObjectIds with full comment documents
            // path is needed because we use the sorting option, if not path would not be required
            // second nested populate replaces the createdBy ObjectId with username and profile image
            .populate({
                path: "comments", options: { sort: { createdAt: -1 } },
                populate: { path: "createdBy", select: "username profileImage" }
            });

        // check if post doesnt exists
        if (!post) {

            return next(new HttpError("No post could be found with that id", 404))

        }

        // return post data
        return res.status(200).json({ message: 'Post found: ', post });

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

        // check id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User Id is not valid' });
        }

        // fetch user from database 
        const user = await User.findById(userId);

        if (!user) {

            return next(new HttpError("User not found", 404))
        }

        // fetch all posts from one user from database
        const getPosts = await Post.find({ "createdBy": userId })
            .populate("createdBy", "username profileImage") // populates createdBy field with user data (username and profile image)
            .sort({ createdAt: -1 }) // sort by newest first


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
        const followingPosts = await Post.find({ createdBy: { $in: loggedInUser.following } })
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
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedPosts: postId } }, { new: true })


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

        // remake postId string from frontend to objectID
        const postObjectId = new mongoose.Types.ObjectId(postId);

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

        // check if post exists
        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({ message: "Post does not exist", postId })
        }


        const user = await User.findById(req.user.id);

        // check if post is saved be the req user
        const alreadySavedPost = user.savedPosts.includes(postObjectId);

        // if NOT saved 
        if (!alreadySavedPost) {

            return next(new HttpError("You havent saved this post.", 422));

        }

        // unsave post
        await User.findByIdAndUpdate(req.user.id, { $pull: { savedPosts: postId } }, { new: true })

        // show response
        return res.status(200).json({ message: "Post removed from saved posts", postId })


    } catch (error) {
        // Om något går fel när vi försöker följa en användaren:
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

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

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

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

        // fetch post from db
        const post = await Post.findById(postId);
        // check if post exists
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        // check if post is liked be the req user
        const alreadyLikedPost = post.likes.includes(req.user.id);

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

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

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

        // PREPARE UPDATE OBJECT: Start with updating the text content
        const updateData = { content };

        // Check if Multer received a new file in req.file (uploaded to Cloudinary)
        if (req.file) {
            // Put the Cloudinary URL path inside an array to match your schema!
            updateData.media = [req.file.path];
            console.log("New file found in backend req.file, updating media array with:", req.file.path);
        }

        // update post and populate user info
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("createdBy");


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

        // check id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ message: 'Post Id is not valid' });
        }

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
        await User.findByIdAndUpdate(req.user.id, { $pull: { posts: postId } })

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
