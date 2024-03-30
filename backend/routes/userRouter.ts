import express, { Router } from 'express';
const userRouter: Router = express.Router();
import { userLogin, userVerify, userSignup, deleteAccount, updateUser, resetRequestController, resetPasswordController, adminLogin, attemptQuiz } from '../controllers/userController';
import { checkAuth } from '../middleware/authMiddleware';

userRouter.route('/login').post(userLogin);
userRouter.route('/signup').post(userSignup);
userRouter.route('/verify/:token').get(userVerify);
userRouter.route('/delete').delete(checkAuth, deleteAccount);
userRouter.route('/update').patch(checkAuth, updateUser);
userRouter.route('/request-reset').post(resetRequestController);
userRouter.route('/reset-password').patch(resetPasswordController);
userRouter.route("/attempt-quiz").post(checkAuth,attemptQuiz)

// Admin route
userRouter.route('/admin-login').post(adminLogin);

export default userRouter 
