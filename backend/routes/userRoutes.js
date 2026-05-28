import { Router } from 'express';
import { registerUser, loginUser, getUser, getUsers, updateUser, followUser, unfollowUser, changeProfileImage, deleteUser, getSavedPosts, } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const userRouter = Router();


// ---------------------------- user routes --------------------------- 
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/', authMiddleware, getUsers)

userRouter.patch('/update', authMiddleware, updateUser) 

userRouter.post('/profile-image',authMiddleware, upload.single("profileImage"), changeProfileImage) 

userRouter.post('/:userId/follow',authMiddleware, followUser) 
userRouter.delete('/:userId/unfollow',authMiddleware, unfollowUser) 

// ---------------------------- user saved posts --------------------------- 
userRouter.get('/savedposts', authMiddleware, getSavedPosts)

userRouter.get('/:userId', authMiddleware, getUser)
userRouter.delete('/:userId', authMiddleware, deleteUser)



