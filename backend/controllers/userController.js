import { HttpError } from "../models/errorModel.js"
import { User } from "../models/userModel.js"
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Ladda miljövariabler från .env
import 'dotenv/config';


// ---------------------------- registrera användare --------------------------- 
// POST req: api/users/register
// UNPROTECTED

export const registerUser = async (req, res, next) => {

    try {

        // hämtar input från frontend
        const { username, email, password, confirmPassword } = req.body;

        // kollar ifall alla fält är ifyllda, om inte skickar error
        if (!username || !email || !password || !confirmPassword) {

            return next(new HttpError("Fill in all fields", 422))
        }

        // --------- username ----------
        // tar bort ledande och avslutande mellanslag i användarnamnet
        const trimUsername = username.trim();

        // kollar ifall användarnamnet är för kort
        if (trimUsername.length < 5) {
            return next(new HttpError("Username is too short, should be at least 5 characters long", 422))
        }

        // kollar ifall användarnamnet är för långt
        if (trimUsername.length > 20) {
            return next(new HttpError("Username is too long, should be a maximum of 20 characters", 422))
        }

        // skapar regex för att kontrollera att användarnamnet använder giltiga tecken
        const regex = /^[a-zA-Z0-9_]+$/

        // kontrollerar att username matchar tillåtet regex-format, om INTE kasta error
        if (!regex.test(trimUsername)) {
            return next(new HttpError("Invalid username", 422))
        }

        // kollar ifall användarnamnet redan finns i databasen
        const usernameExists = await User.findOne({ username: trimUsername })
        if (usernameExists) {
            return next(new HttpError("Username already exists", 422))
        }

        // --------- email ----------
        // gör email till endast små bokstäver
        const emailLowerCase = email.toLowerCase();

        // kolla ifall email är korrekt skriven med hjälp av validator, om inte skicka error
        if (!validator.isEmail(emailLowerCase)) {
            return next(new HttpError("Invalid email", 422))
        }

        // kollar ifall email redan finns i databasen
        const emailExists = await User.findOne({ email: emailLowerCase })
        if (emailExists) {
            return next(new HttpError("Email already exists", 422))
        }

        // --------- lösenord ----------
        // kolla ifall password och confirmPassword matchar
        if (password != confirmPassword) {
            return next(new HttpError("Password do not match", 422))
        }

        // kolla längden på lösenordet, ska vara minst 10 bokstäver/siffror
        if (password.length < 10) {
            return next(new HttpError("Password must be at least 10 characters long", 422))
        }

        // hasha lösenordet med verktyget bcrypt
        const saltPassword = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPassword);


        // --------- lägger till användare till databasen ----------
        const newUser = await User.create({ username: trimUsername, email: emailLowerCase, password: hashedPassword })
        res.status(201).json(newUser);


    } catch (error) {
        // Om något går fel när vi försöker registrera användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- logga in användare --------------------------- 
// POST req: api/users/login
// UNPROTECTED

export const loginUser = async (req, res, next) => {

    try {

        // hämtar input från frontend
        const { username, password } = req.body;

        // kollar ifall alla fält är ifyllda, om inte skickar error
        if (!username || !password) {

            return next(new HttpError("Fill in all fields", 422))
        }

        // hämtar EN specifik användare baserat på username från databasen
        const getUserFromDB = await User.findOne({ username: username })
        // kollar om användarnamnet finns registrerat, om inte skickar error
        if (!getUserFromDB) {

            return next(new HttpError("Username doesnt exist", 422))
        }

        // vad gör denna delen för nytta??
        // const {userPassword, ...userInfo} = getUserFromDB;

        // jämför lösenord via bcrypt - Matchar det inskrivna lösenordet hash:en för JUST DEN användaren?
        const correctPassword = await bcrypt.compare(password, getUserFromDB.password);
        if (!correctPassword) {

            return next(new HttpError("Incorrect password", 422))

        }

        // json web token för login
        const token = await jwt.sign({ id: getUserFromDB._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // skickar token och användar id till klienten
        res.status(200).json({ token, id: getUserFromDB._id })


    } catch (error) {
        // Om något går fel när vi försöker logga in användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- hämta användare --------------------------- 
// GET req: api/users/:ID
// PROTECTED

export const getUser = async (req, res, next) => {

    try {

        // :id i route(URL) blir värdet i {id} = req.params
        const { id } = req.params;

        // hämtar användaren från databasen med id
        const findUser = await User.findById(id);

        // error ifall man inte hittar användaren
        if(!findUser) {

            return next(new HttpError("No user could be found with that id", 404))
        }

        // skickar tillbaka användaren
        res.status(200).json({message: 'User found: ', findUser});

    } catch (error) {
        // Om något går fel när vi försöker hämta en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- hämta flera användare --------------------------- 
// GET req: api/users
// PROTECTED

export const getUsers = async (req, res, next) => {

    try {

        // hämta alla användare från databasen, visar endast 20 st
        const getAllUsers = await User.find().limit(20);

        // error ifall användarna ej kan hämtas
        if(!getAllUsers) {

            return next(new HttpError("No users could be found", 404))
        }

        // skickar tillbaka lista med alla användare
        res.status(200).json({message: "Users found: ", getAllUsers})

    } catch (error) {
        // Om något går fel när vi försöker hämta flera användare:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}


// ---------------------------- uppdatera användare --------------------------- 
// ... inget :id behövs då det endast är den inloggade användare som ska kunna göra detta
// PATCH req: api/users/update
// PROTECTED

export const updateUser = async (req, res, next) => {



    try {

        res.json("User updated")

    } catch (error) {
        // Om något går fel när vi försöker uppdatera en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- följ användare --------------------------- 
// GET req: api/users/:id/follow ... ÄNDRA till POST senare
// PROTECTED

export const followUser = async (req, res, next) => {

    try {

        res.json("User followed")

    } catch (error) {
        // Om något går fel när vi försöker följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- sluta följ användare --------------------------- 
// GET req: api/users/:id/unfollow ... ÄNDRA till DELETE senare
// PROTECTED

export const unfollowUser = async (req, res, next) => {

    try {

        res.json("User unfollowed")

    } catch (error) {
        // Om något går fel när vi försöker sluta följa en användaren:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- ändra profil bild --------------------------- 
// ... inget :id behövs då det endast är den inloggade användare som ska kunna göra detta
// POST req: api/users/profile-image ... ÄNDRA till PATCH senare
// PROTECTED

export const changeProfileImage = async (req, res, next) => {

    // KOM IHÅG: fixa JWT middleware för att få userID

    try {

        res.json("Profile image changed")

    } catch (error) {
        // Om något går fel när vi försöker uppdatera profilbilden:
        // 1. Vi tar det fel som fångas upp i 'catch' (det som kallas 'error')
        // 2. Vi skapar ett nytt fel-objekt av typen HttpError med det här felmeddelandet
        // 3. Vi skickar det nya fel-objektet vidare till Express med 'next()'
        //    → Express vet då att något gick fel och kan skicka tillbaka ett HTTP-fel till klienten
        return next(new HttpError(error))
    }

}

// ---------------------------- radera användare --------------------------- 
// DELETE req: api/users/:ID
// PROTECTED

export const deleteUser = async (req, res, next) => {

    const { id } = req.params;

    try {

        // hitta användare 
        const findUser = await User.findById(id);

        // om användare ej kan hittas meddela det
        if (!findUser) {

            return res.status(404).json({ message: 'User not found' });

        } else {

            // Radera användaren
            await User.findByIdAndDelete(id);
            return res.json("User deleted")

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
