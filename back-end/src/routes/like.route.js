import { Router } from "express";

const router = Router();


router.route('/likePost/:id').post(isLoggedIn, likePost);
router.route('/unlikePost/:id').post(isLoggedIn, unlikePost);
router.route('/getLikes/:id').get(getLikes);

router.route('/likeComment/:id').post(isLoggedIn, likeComment);
router.route('/unlikeComment/:id').post(isLoggedIn, unlikeComment);
router.route('/getCommentLikes/:id').get(getCommentLikes);

export default router;