import { Router } from 'express';
import { registerUser, loginUser, getUser, getUsers, updateUser, followUser, unfollowUser, changeProfileImage, deleteUser } from '../controllers/userController';

// skapar router
const router = Router();


// ---------------------------- user routes --------------------------- 
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getUsers)
router.patch('/:id', updateUser)
router.get('/:id/follow', followUser)
router.get('/:id/unfollow', unfollowUser)
router.post('/profile-image', changeProfileImage)
router.delete('/:id', deleteUser)

export default router;