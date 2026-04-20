import { Router } from 'express';
import { registerUser, loginUser, getUser, getUsers, updateUser, followUser, unfollowUser, changeProfileImage, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadFile } from '../config/fileUpload.js'

// create router
export const userRouter = Router();

// upload files folder
const upload = uploadFile("uploads");


// ---------------------------- user routes --------------------------- 
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/:id', getUser)
userRouter.get('/', getUsers)
userRouter.patch('/update', authMiddleware, updateUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den uppdaterar sin profil
userRouter.post('/:id/follow',authMiddleware, followUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den följer 
userRouter.delete('/:id/unfollow',authMiddleware, unfollowUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den avföljer
userRouter.post('/profile-image',authMiddleware, upload.single("profileImage"), changeProfileImage) // authMiddleware behövs för att kolla att en användare är inloggad innan den byter profilbild
userRouter.delete('/:id', deleteUser)