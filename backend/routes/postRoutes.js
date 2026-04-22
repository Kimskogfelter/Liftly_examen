import { Router } from 'express';
import { createPost, updatePost, likePost, unlikePost, getPost, getPosts, deletePost } from '../controllers/postController.js';
import { createComment, getComment, getComments, deleteComment } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const postRouter = Router();


// ---------------------------- post routes --------------------------- 

postRouter.post('/create', authMiddleware, upload.single("media"), createPost)
postRouter.get('/',authMiddleware, getPosts)
postRouter.get('/:id',authMiddleware, getPost)
postRouter.patch('/:id/update', authMiddleware, updatePost) // authMiddleware behövs för att kolla att en användare är inloggad innan den uppdaterar sin profil
postRouter.post('/:id/like',authMiddleware, likePost)
postRouter.delete('/:id/unlike',authMiddleware, unlikePost)
postRouter.delete('/:id',authMiddleware, deletePost)


// ---------------------------- comment routes ---------------------------

postRouter.post('/:postId/comments/create', authMiddleware, upload.single("media"), createComment)
postRouter.get('/:postId/comments',authMiddleware, getComments)
postRouter.get('/:postId/comments/:commentId',authMiddleware, getComment)
postRouter.delete('/:postId/comments/:commentId',authMiddleware, deleteComment)