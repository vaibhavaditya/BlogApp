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

//need to convert to like a foryou page later
router.route('/')
.get(authMiddleware,getAllPosts)
//

router.route('/create-post')
.post(authMiddleware,
    upload.fields([
        {name: 'images', maxCount: 5},
        {name: 'videos', maxCount: 2}
    ]),createPost);

router.route('/post/:id')
.get(authMiddleware,getPostById)
.put(authMiddleware,
    upload.fields([
        {name: 'images', maxCount: 5},
        {name: 'videos', maxCount: 2}
    ]),updatePost)
.delete(authMiddleware,deletePost);


export default router;