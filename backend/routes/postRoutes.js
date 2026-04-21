import { Router } from 'express';
import { updatePost, likePost, getPost, getPosts, deletePost } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const postRouter = Router();


// ---------------------------- post routes --------------------------- 

postRouter.get('/',authMiddleware, getPosts)
postRouter.get('/:id',authMiddleware, getPost)
postRouter.patch('/:id/update', authMiddleware, updatePost) // authMiddleware behövs för att kolla att en användare är inloggad innan den uppdaterar sin profil
postRouter.post('/:id/like',authMiddleware, likePost)
postRouter.delete('/:id/delete',authMiddleware, deletePost)