import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import{likePost,unlikePost, likeComment, unlikeComment} from '../controllers/like.controller.js';
const router = Router();


router.route('/likePost/:id').post(authMiddleware, likePost);
router.route('/unlikePost/:id').post(authMiddleware, unlikePost);

router.route('/likeComment/:id').post(authMiddleware, likeComment);
router.route('/unlikeComment/:id').post(authMiddleware, unlikeComment);

export default router;