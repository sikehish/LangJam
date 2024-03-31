import express, { Router } from 'express';
const userRouter: Router = express.Router();
import { userLogin, userVerify, userSignup, deleteAccount, updateUser, resetRequestController, resetPasswordController, adminLogin, attemptQuestion, getAttemptedQuestions, getAttemptedQuizDetails, getFilteredQuizzes } from '../controllers/userController';
import { checkAuth } from '../middleware/authMiddleware';

userRouter.route('/login').post(userLogin);
userRouter.route('/signup').post(userSignup);
userRouter.route('/verify/:token').get(userVerify);
userRouter.route('/delete').delete(checkAuth, deleteAccount);
userRouter.route('/update').patch(checkAuth, updateUser);
userRouter.route('/request-reset').post(resetRequestController);
userRouter.route('/reset-password').patch(resetPasswordController);
userRouter.route("/attempt-question").post(checkAuth,attemptQuestion)
userRouter.route("/attempted-questions").get(checkAuth,getAttemptedQuestions)
userRouter.route("/attempted-quiz-details/:quizId").get(checkAuth,getAttemptedQuizDetails)
userRouter.route("/quiz-filter/:topicId").get(checkAuth,getFilteredQuizzes)

// Admin route
userRouter.route('/admin-login').post(adminLogin);

export default userRouter 
