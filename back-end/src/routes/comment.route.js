import { Router } from "express";

const router = Router();

router.route('/getCommentsByPost/:postId').get(getCommentsByPost);
router.route('/addComment').post(isLoggedIn, addComment);
router.route('/deleteComment/:id').delete(isLoggedIn, deleteComment);
router.route('/updateComment/:id').put(isLoggedIn, updateComment);
router.route('/commentcount/:postId').get(getCommentCount);

export default router;