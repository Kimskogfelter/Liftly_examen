import { HttpError } from "../models/errorModel.js"
import { User } from "../models/userModel.js"


// ---------------------------- registrera användare --------------------------- 
// POST req: api/users/register
// UNPROTECTED

export const registerUser = async (req, res, next) => {

    try {

       return res.json("User registered")
        
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

        return res.json("User logged in")
        
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

        return res.json("Get user")
        
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

        return res.json("Get users")
        
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
// ... inget :id behövs då det endast är den inloggade användare som ska kunna göra detta ???
// PATCH req: api/users/:id/update
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
// GET req: api/users/:id/follow
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
// GET req: api/users/:id/unfollow
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
// POST req: api/users/profile-image
// PROTECTED

export const changeProfileImage = async (req, res, next) => {

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
        if(!findUser) {

            return res.status(404).json({message: 'User not found'});

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
