import { HttpError } from "../models/errorModel.js"
import { User } from "../models/userModel.js"
import { Post } from "../models/postModel.js";
import mongoose from "mongoose";

// loading env var from .env
import 'dotenv/config';


// ---------------------------- CREATE POST --------------------------- 
// POST req: api/posts/create
// PROTECTED

export const createPost = async (req, res, next) => {

    try {

        // get input from frontend
        const { username, email, password, confirmPassword } = req.body;

        // validate required fields
        if (!username || !email || !password || !confirmPassword) {

            return next(new HttpError("Fill in all fields", 422))
        }

        // --------- username ----------
        // remove leading and trailing whitespace from username
        const trimUsername = username.trim();

        // validate if username length is too short
        if (trimUsername.length < 5) {
            return next(new HttpError("Username is too short, should be at least 5 characters long", 422))
        }

        // validate if username length is too long
        if (trimUsername.length > 20) {
            return next(new HttpError("Username is too long, should be a maximum of 20 characters", 422))
        }

        // ensure username contains only valid characters thru regex
        const regex = /^[a-zA-Z0-9_]+$/

        if (!regex.test(trimUsername)) {
            return next(new HttpError("Invalid username", 422))
        }

        // check if username already exists in database
        const usernameExists = await User.findOne({ username: trimUsername })
        if (usernameExists) {
            return next(new HttpError("Username already exists", 422))
        }

        // --------- email ----------
        // normalize email to lowercase
        const emailLowerCase = email.toLowerCase();

        // validate email format with validator
        if (!validator.isEmail(emailLowerCase)) {
            return next(new HttpError("Invalid email", 422))
        }

        // check if email already exists in database
        const emailExists = await User.findOne({ email: emailLowerCase })
        if (emailExists) {
            return next(new HttpError("Email already exists", 422))
        }

        // --------- password----------
        // ensure passwords match
        if (password != confirmPassword) {
            return next(new HttpError("Password do not match", 422))
        }

        // validate password length requirement
        if (password.length < 10) {
            return next(new HttpError("Password must be at least 10 characters long", 422))
        }

        // hash password with bcrypt before storing in database
        const saltPassword = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPassword);


        // --------- create new user to database ----------
        const newUser = await User.create({ username: trimUsername, email: emailLowerCase, password: hashedPassword })
        return res.status(201).json(newUser);


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

        // extract user id from route parameters
        const { id } = req.params;

        // fetch user from database
        const findUser = await User.findById(id);

        // check if user doesnt exists
        if (!findUser) {

            return next(new HttpError("No user could be found with that id", 404))
        }

        // return user data
        return res.status(200).json({ message: 'User found: ', findUser });

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

        // fetch all users from database, limited to 20
        const getAllUsers = await User.find().limit(20);

        // check if users doesnt exists
        if (!getAllUsers) {

            return next(new HttpError("No users could be found", 404))
        }

        // return list of users
        return res.status(200).json({ message: "Users found: ", getAllUsers })

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

        // hämta username/bio för användare som ska uppdateras
        const { username, profileBio } = req.body;

        // uppdatera endast de fält som användaren skickat med i req.body
        // dubbelkollar att rätt användare är inloggad/gör ändringen  via req.user.id och auth middleware
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { username, profileBio }, { new: true })

        // error om användaren ej hittas
        if (!updatedUser) {

            return next(new HttpError("User not found", 404))
        }

        // skicka tillbaka uppdaterade användaren
        return res.status(200).json({ message: "User updated: ", updatedUser })


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

        // hämta id från användarens profil vi besöker via url(routes)
        const targetUserId = req.params.id;

        // hämta inloggade användarens objekt via id
        const loggedInUser = await User.findById(req.user.id);
        // hämta endast inloggande användarens id och gör om till sträng
        const loggedInUserId = loggedInUser._id.toString();

        // kolla ifall det är den inloggade användarens profil
        // ... om samma, meddela att man inte kan följa sig själv
        if (loggedInUserId === targetUserId) {

            return next(new HttpError("You cant follow yourself.", 422))

        }

        // kolla ifall användaren man vill följa redan finns i ens "following" lista i databasen
        // 1. Konvertera sträng-ID från URL:en till ett Mongoose ObjectId. med hjälp av mongoose ...
        // Detta krävs eftersom 'loggedInUser.following' i databasen innehåller objekt, inte rena strängar.
        // .includes() fungerar nu korrekt eftersom båda sidorna av jämförelsen är av typen ObjectId.
        const alreadyFollowingUser = loggedInUser.following.includes(new mongoose.Types.ObjectId(targetUserId));

        // om man redan FÖLJER användaren
        if (alreadyFollowingUser) {
            return next(new HttpError("You are already following this user.", 422));
        }

        // om man INTE FÖLJER användaren, 
        // 1. lägg till användaren man vill följa i inloggade användarens "following" lista i databasen
        // 2. lägg till den inloggade användaren som följare i användarens "followers" lista i databasen
        if (!alreadyFollowingUser) {

            // 1
            await User.findByIdAndUpdate(loggedInUserId, { $push: { following: targetUserId } }, { new: true })
            // 2
            await User.findByIdAndUpdate(targetUserId, { $push: { followers: loggedInUserId } }, { new: true })

            // meddela att det gick att börja följa användaren
            return res.status(200).json({ message: "You started to follow: ", targetUserId })

        }



    } catch (error) {
        // Om något går fel när vi försöker följa en användaren:
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
