import { Router } from 'express';
import { createPost, getPost, getPosts, getUserPosts, getFollowingPosts, savePost, unsavePost, likePost, unlikePost, updatePost, deletePost } from '../controllers/postController.js';
import { createComment, getComment, getComments, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const postRouter = Router();


// ---------------------------- post routes SUBROUTES --------------------------- 
postRouter.post('/create', authMiddleware, upload.single("media"), createPost)
postRouter.get('/users/:userId/posts', authMiddleware, getUserPosts)
postRouter.get('/following',authMiddleware, getFollowingPosts)
postRouter.get('/', getPosts) // Public route so home page can fetch and display all posts for visitors

postRouter.post('/:postId/save', authMiddleware, savePost)
postRouter.delete('/:postId/unsave', authMiddleware, unsavePost)

postRouter.post('/:postId/like',authMiddleware, likePost)
postRouter.delete('/:postId/unlike',authMiddleware, unlikePost)

postRouter.patch('/:postId/update', authMiddleware, updatePost) 


// ---------------------------- comment routes ---------------------------

postRouter.post('/:postId/comments/create', authMiddleware, createComment)
postRouter.get('/:postId/comments',authMiddleware, getComments)
postRouter.get('/comments/:commentId',authMiddleware, getComment)
postRouter.delete('/comments/:commentId',authMiddleware, deleteComment)

// ---------------------------- post routes GENERIC ---------------------------

postRouter.get('/:postId',authMiddleware, getPost)
postRouter.delete('/:postId',authMiddleware, deletePost)