import {Router} from 'express';
import {
    getAllPosts, 
    createPost, 
    getPostById, 
    updatePost, 
    deletePost
} from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/posts')
.get(authMiddleware,getAllPosts)
.post(authMiddleware,
    upload.fields([
        {name: 'images', maxCount: 5},
        {name: 'videos', maxCount: 2}
    ]),createPost)


router.route('/posts/:id')
.get(authMiddleware,getPostById)
.put(authMiddleware,
    upload.fields([
        {name: 'images', maxCount: 5},
        {name: 'videos', maxCount: 2}
    ]),updatePost)
.delete(authMiddleware,deletePost);


export default router;