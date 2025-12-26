import {Router} from 'express';

const router = Router();

router.route('/posts')
.get(getAllPosts)
.post(isLoggedIn,createPost);


router.route('/posts/:id')
.get(getPostById)
.put(isLoggedIn,updatePost)
.delete(isLoggedIn,deletePost);


export default router;