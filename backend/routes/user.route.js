import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();


router.post("/register", 
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    userController.createUserController);

router.post('/login',
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    userController.loginUserController);

router.get('/profile', authMiddleware.authUser, userController.profileController);

router.get('/find', authMiddleware.authUser, userController.findUserByEmail);

router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsers);


export default router;
