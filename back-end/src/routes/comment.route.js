import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getCommentsByPost, addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
const router = Router();

router.route('/post/:postId')
    .get(getCommentsByPost)
    .post(authMiddleware, addComment);


router.route('/:id')
  .delete(authMiddleware, deleteComment)
  .put(authMiddleware, updateComment);

export default router;