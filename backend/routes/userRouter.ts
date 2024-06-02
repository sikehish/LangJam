import express, { Router } from 'express';
const userRouter: Router = express.Router();
import { userLogin, userVerify, userSignup, deleteAccount, updateUser, resetRequestController, resetPasswordController, adminLogin, attemptQuestion, getAttemptedQuestions, getAttemptedQuizDetails, getFilteredQuizzes, getLeaderboard, getRank, getCurrentUser, uploadImage, handleOptionalFields, createNote, getNotes, deleteNote, chatAiController, userCheck, logout } from '../controllers/userController';
import { checkAuth, checkMixedAuth } from '../middleware/authMiddleware';
import { dpMiddleware } from '../middleware/multerMiddleware';

userRouter.route('/login').post(userLogin);
userRouter.route('/check').get(checkMixedAuth,userCheck);
userRouter.route('/signup').post(userSignup);
userRouter.route('/logout').post(logout);

userRouter.route('/verify/:token').get(userVerify);
userRouter.route('/delete').delete(checkAuth, deleteAccount);
userRouter.route('/update').patch(checkAuth, updateUser);
userRouter.route('/request-reset').post(resetRequestController);
userRouter.route('/reset-password').patch(resetPasswordController);
userRouter.route("/attempt-question").post(checkAuth,attemptQuestion)
userRouter.route("/attempted-questions").get(checkAuth,getAttemptedQuestions)
userRouter.route("/attempted-quiz-details/:quizId").get(checkAuth,getAttemptedQuizDetails)
userRouter.route("/quiz-filter/:topicId").get(checkAuth,getFilteredQuizzes)
userRouter.route("/leaderboard").get(getLeaderboard)
userRouter.route("/user-rank").get(checkAuth, getRank)
userRouter.route("/current-user").get(checkAuth,getCurrentUser)
userRouter.route("/upload-dp").patch(checkAuth, dpMiddleware, uploadImage);
userRouter.route("/optional-fields").patch(dpMiddleware, handleOptionalFields);
userRouter.route("/create-note").post(checkAuth, createNote);
userRouter.route("/notes").get(checkAuth, getNotes);
userRouter.route("/notes/:id").delete(checkAuth, deleteNote);
userRouter.route("/notes/:id").delete(checkAuth, deleteNote);
userRouter.route("/chat-with-ai").post(checkMixedAuth, chatAiController);

// Admin route
userRouter.route('/admin-login').post(adminLogin);

export default userRouter 
