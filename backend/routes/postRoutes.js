import { Router } from 'express';
import { createPost, updatePost, likePost, unlikePost, getPost, getPosts, deletePost } from '../controllers/postController.js';
import { createComment, getComment, getComments, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const postRouter = Router();


// ---------------------------- post routes --------------------------- 

postRouter.post('/create', authMiddleware, upload.single("media"), createPost)
postRouter.get('/',authMiddleware, getPosts)
postRouter.get('/:postId',authMiddleware, getPost)
postRouter.patch('/:postId/update', authMiddleware, updatePost) // authMiddleware behövs för att kolla att en användare är inloggad innan den uppdaterar sin profil
postRouter.post('/:postId/like',authMiddleware, likePost)
postRouter.delete('/:postId/unlike',authMiddleware, unlikePost)
postRouter.delete('/:postId',authMiddleware, deletePost)


// ---------------------------- comment routes ---------------------------

postRouter.post('/:postId/comments/create', authMiddleware, createComment)
postRouter.get('/:postId/comments',authMiddleware, getComments)
postRouter.get('/comments/:commentId',authMiddleware, getComment)
postRouter.delete('/comments/:commentId',authMiddleware, deleteComment)