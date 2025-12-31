import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js';
import {
    registerUser,
    loginUser,
    getUserProfile,
    getUserProfileById,
    logoutUser,
    changeCurrentPassword,
    changeCurrentUsername,
    getAllFollowers,
    getAllFollowing,
    getAllFollowersById,
    getAllFollowingById,
    changeAvatar,
    followAUser,
    removeFollower,
    removeFollowing

} from '../controllers/user.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(authMiddleware,logoutUser);
router.route('/change-password').post(authMiddleware,changeCurrentPassword);
router.route('/change-username').post(authMiddleware,changeCurrentUsername)
router.route('/change-avatar').post(authMiddleware,changeAvatar);
router.route('/profile').get(authMiddleware,getUserProfile);
router.route('/profile/:id').get(getUserProfileById);

router.route('/followers').get(authMiddleware,getAllFollowers);
router.route('/following').get(authMiddleware,getAllFollowing);
router.route('/followers/:id').get(authMiddleware,getAllFollowersById);
router.route('/following/:id').get(authMiddleware,getAllFollowingById);

router.route('/add-following/:id').post(authMiddleware,followAUser);
router.route('/remove-follower/:id').patch(authMiddleware,removeFollower);
router.route('/remove-following/:id').patch(authMiddleware,removeFollowing);


export default router;
