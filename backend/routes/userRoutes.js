import { Router } from 'express';
import { registerUser, loginUser, getUser, getUsers, updateUser, followUser, unfollowUser, changeProfileImage, deleteUser } from '../controllers/userController';

// skapar router
export const userRouter = Router();

// ---------------------------- user routes --------------------------- 
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/:id', getUser)
userRouter.get('/', getUsers)
userRouter.patch('/:id', updateUser)
userRouter.get('/:id/follow', followUser)
userRouter.get('/:id/unfollow', unfollowUser)
userRouter.post('/profile-image', changeProfileImage)
userRouter.delete('/:id', deleteUser)

