import {Router} from 'express';
import {
    getAllPosts, 
    createPost, 
    getPostById, 
    updatePost, 
    deletePost
} from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/posts')
.get(authMiddleware,getAllPosts)
.post(authMiddleware,createPost)


router.route('/posts/:id')
.get(authMiddleware,getPostById)
.put(authMiddleware,updatePost)
.delete(authMiddleware,deletePost);


export default router;