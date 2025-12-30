import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js';
import {
    registerUser,
    loginUser,
    getUserProfile,
    getUserProfileById,
    logoutUser,
    changeCurrentPassword,
    getAllFollowers,
    getAllFollowing,
    getAllFollowersById,
    getAllFollowingById
} from '../controllers/user.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(authMiddleware,getUserProfile);
router.route('/profile/:id').get(getUserProfileById);
router.route('/change-password').post(authMiddleware,changeCurrentPassword);
router.route('/logout').post(authMiddleware,logoutUser);
router.route('/followers').get(authMiddleware,getAllFollowers);
router.route('/following').get(authMiddleware,getAllFollowing);
router.route('/followers/:id').get(authMiddleware,getAllFollowersById)
router.route('/following/:id').get(authMiddleware,getAllFollowingById)


export default router;
