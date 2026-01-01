import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.route('/getCommentsByPost/:postId').get(getCommentsByPost);
router.route('/addComment/:postId').post(authMiddleware, addComment);
router.route('/deleteComment/:id').delete(authMiddleware, deleteComment);
router.route('/updateComment/:id').put(authMiddleware, updateComment);

export default router;