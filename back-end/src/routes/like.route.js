import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import{likePost,unlikePost,getLikes, likeComment, unlikeComment, getCommentLikes} from '../controllers/like.controller.js';
const router = Router();


router.route('/likePost/:id').post(authMiddleware, likePost);
router.route('/unlikePost/:id').post(authMiddleware, unlikePost);
router.route('/getLikes/:id').get(getLikes);

router.route('/likeComment/:id').post(authMiddleware, likeComment);
router.route('/unlikeComment/:id').post(authMiddleware, unlikeComment);
router.route('/getCommentLikes/:id').get(getCommentLikes);

export default router;