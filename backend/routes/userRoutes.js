import { Router } from 'express';
import { registerUser, loginUser, getUser, getUsers, updateUser, followUser, unfollowUser, changeProfileImage, deleteUser, getUserPosts, savePost, unsavePost } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const userRouter = Router();


// ---------------------------- user routes --------------------------- 
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/:userId', getUser)
userRouter.get('/', getUsers)
userRouter.patch('/update', authMiddleware, updateUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den uppdaterar sin profil
userRouter.post('/:userId/follow',authMiddleware, followUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den följer 
userRouter.delete('/:userId/unfollow',authMiddleware, unfollowUser) // authMiddleware behövs för att kolla att en användare är inloggad innan den avföljer
userRouter.post('/profile-image',authMiddleware, upload.single("profileImage"), changeProfileImage) // authMiddleware behövs för att kolla att en användare är inloggad innan den byter profilbild
userRouter.delete('/:userId', deleteUser)


// ---------------------------- user post routes --------------------------- 
userRouter.get('/:userId/posts', getUserPosts)
userRouter.post('/posts/:postId/save', authMiddleware, savePost)
userRouter.delete('/posts/:postId/unsave', authMiddleware, unsavePost)