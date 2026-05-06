import { HttpError } from "../models/errorModel.js"
import { User } from "../models/userModel.js"
import { Post } from "../models/postModel.js"
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { cloudinaryService } from "../config/cloudinaryConfig.js";

// loading env var from .env
import 'dotenv/config';


// ---------------------------- REGISTER USER --------------------------- 
// POST req: api/users/register
// UNPROTECTED

export const registerUser = async (req, res, next) => {

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


// ---------------------------- LOG IN USER --------------------------- 
// POST req: api/users/login
// UNPROTECTED

export const loginUser = async (req, res, next) => {

    try {

        // get input from frontend
        const { username, password } = req.body;

        // validate required fields
        if (!username || !password) {

            return next(new HttpError("Fill in all fields", 422))
        }

        // ensure user exists before proceeding
        const getUserFromDB = await User.findOne({ username: username })

        if (!getUserFromDB) {

            return next(new HttpError("Username doesnt exist", 422))
        }


        // compare password with hashed password
        const correctPassword = await bcrypt.compare(password, getUserFromDB.password);
        if (!correctPassword) {

            return next(new HttpError("Incorrect password", 422))

        }

        // generate authentication token for login
        const token = await jwt.sign({ id: getUserFromDB._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // sends token and user id to client
        return res.status(200).json({ token, id: getUserFromDB._id })


    } catch (error) {
        // Om något går fel när vi försöker logga in användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- GET USER --------------------------- 
// GET req: api/users/:userId
// PROTECTED

export const getUser = async (req, res, next) => {

    try {

        // extract user id from route parameters
        const { userId } = req.params;

        // check id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User Id is not valid' });
        }

        // fetch user from database
        const findUser = await User.findById(userId);

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


// ---------------------------- GET USERS --------------------------- 
// GET req: api/users
// PROTECTED

export const getUsers = async (req, res, next) => {

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


// ---------------------------- UPDATE USER --------------------------- 
// ... inget :id behövs då det endast är den inloggade användare som ska kunna göra detta
// PATCH req: api/users/update
// PROTECTED

export const updateUser = async (req, res, next) => {

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

// ---------------------------- FOLLOW USER --------------------------- 
// POST req: api/users/:userId/follow 
// PROTECTED

export const followUser = async (req, res, next) => {

    try {

        // hämta id från användarens profil vi besöker via url(routes)
        const { userId } = req.params;

        // check id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User Id is not valid' });
        }

        // hämta inloggade användarens objekt via id
        const loggedInUser = await User.findById(req.user.id);
        // hämta endast inloggande användarens id och gör om till sträng
        const loggedInUserId = loggedInUser._id.toString();

        // kolla ifall det är den inloggade användarens profil
        // ... om samma, meddela att man inte kan följa sig själv
        if (loggedInUserId === userId) {

            return next(new HttpError("You cant follow yourself.", 422))

        }

        // kolla ifall användaren man vill följa redan finns i ens "following" lista i databasen
        // 1. Konvertera sträng-ID från URL:en till ett Mongoose ObjectId. med hjälp av mongoose ...
        // Detta krävs eftersom 'loggedInUser.following' i databasen innehåller objekt, inte rena strängar.
        // .includes() fungerar nu korrekt eftersom båda sidorna av jämförelsen är av typen ObjectId.
        const alreadyFollowingUser = loggedInUser.following.includes(new mongoose.Types.ObjectId(userId));

        // om man redan FÖLJER användaren
        if (alreadyFollowingUser) {
            return next(new HttpError("You are already following this user.", 422));
        }

        // om man INTE FÖLJER användaren, 
        // 1. lägg till användaren man vill följa i inloggade användarens "following" lista i databasen
        // 2. lägg till den inloggade användaren som följare i användarens "followers" lista i databasen
        if (!alreadyFollowingUser) {

            // 1
            await User.findByIdAndUpdate(loggedInUserId, { $push: { following: userId } }, { new: true })
            // 2
            await User.findByIdAndUpdate(userId, { $push: { followers: loggedInUserId } }, { new: true })

            // meddela att det gick att börja följa användaren
            return res.status(200).json({ message: "You started to follow: ", userId })

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

// ---------------------------- UNFOLLOW USER --------------------------- 
// DELETE req: api/users/:userId/unfollow 
// PROTECTED

export const unfollowUser = async (req, res, next) => {

    try {

        // hämta id från användarens profil vi besöker via url(routes)
        const { userId } = req.params;

        // check id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User Id is not valid' });
        }

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

// ---------------------------- CHANGE PROFILE PICTURE --------------------------- 
// no id required, only logged in user should be able to do this, verified thru auth middleware
// POST req: api/users/profile-image
// PROTECTED

export const changeProfileImage = async (req, res, next) => {


    try {


        // check if a file is selected
        if (!req.file) {

            return next(new HttpError("Please choose an image", 422))

        }

        // profile image cloudinary url
        const cloudinaryImagePath = req.file.path;

        // uploads profile image to database
        // fetch logged in user id through "req.user.id" and authMiddleware
        await User.findByIdAndUpdate(req.user.id, { profileImage: cloudinaryImagePath }, { new: true })

        // send response that upload was successfull
        return res.status(200).json({ success: true, message: "You added a new profile picture ", cloudinaryImagePath })


    } catch (error) {
        // Om något går fel när vi försöker uppdatera profilbilden:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- DELETE USER --------------------------- 
// DELETE req: api/users/:userId
// PROTECTED

export const deleteUser = async (req, res, next) => {

    const { userId } = req.params;

    // check id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: 'User Id is not valid' });
    }

    try {

        // find user 
        const findUser = await User.findById(userId);

        // if user cant be found 
        if (!findUser) {

            return res.status(404).json({ message: 'User not found' });

        } else {

            // remove user from followers and following lists
            await User.updateMany(
                {}, // all users
                {
                    $pull: {
                        followers: userId,
                        following: userId
                    }
                }
            );

            // delete user
            await User.findByIdAndDelete(userId);
            return res.status(200).json(`User with id: ${userId} was successfully removed from followers and following lists and deleted from database`)

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