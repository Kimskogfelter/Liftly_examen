import { Router } from 'express';
import { createPost, getPost, getPosts, getUserPosts, getFollowingPosts, getSavedPosts, savePost, unsavePost, likePost, unlikePost, updatePost, deletePost } from '../controllers/postController.js';
import { createComment, getComment, getComments, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/cloudinaryUpload.js'

// create router
export const postRouter = Router();


// ---------------------------- post routes --------------------------- 
postRouter.post('/create', authMiddleware, upload.single("media"), createPost)

postRouter.get('/',authMiddleware, getPosts)
postRouter.get('/:postId',authMiddleware, getPost)
postRouter.get('/users/:userId', getUserPosts)
postRouter.get('/following', getFollowingPosts)
postRouter.get('/saved', authMiddleware, getSavedPosts)

postRouter.post('/:postId/save', authMiddleware, savePost)
postRouter.delete('/:postId/unsave', authMiddleware, unsavePost)

postRouter.post('/:postId/like',authMiddleware, likePost)
postRouter.delete('/:postId/unlike',authMiddleware, unlikePost)

postRouter.patch('/:postId/update', authMiddleware, updatePost) 

postRouter.delete('/:postId',authMiddleware, deletePost)





// ---------------------------- comment routes ---------------------------

postRouter.post('/:postId/comments/create', authMiddleware, createComment)
postRouter.get('/:postId/comments',authMiddleware, getComments)
postRouter.get('/comments/:commentId',authMiddleware, getComment)
postRouter.delete('/comments/:commentId',authMiddleware, deleteComment)