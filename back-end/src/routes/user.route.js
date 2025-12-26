import { Router } from "express";

const router = Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(getUserProfile);
router.route('/logout').post(isLoggedIn,logoutUser);

export default router;
