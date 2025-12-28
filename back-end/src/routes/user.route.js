import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js';
import {registerUser,loginUser,getUserProfile,logoutUser} from '../controllers/user.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(authMiddleware,getUserProfile);
router.route('/logout').post(authMiddleware,logoutUser);

export default router;
