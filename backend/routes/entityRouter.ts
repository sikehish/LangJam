import express from 'express';
import {
  getAllCategories,
  getAllSubjects,
  getAllTopics,
  getAllQuizzes,
  getQuiz,

} from '../controllers/entityController'; // Import your controllers

import { checkAdminAuth, checkAuth, checkMixedAuth } from '../middleware/authMiddleware'; // Import your auth middleware

const entityRouter = express.Router();

// Getting entities
entityRouter.get('/categories', getAllCategories); //Categories can be viewed by non auth users
entityRouter.get('/subjects/:id', checkMixedAuth, getAllSubjects);
entityRouter.get('/topics/:id', checkMixedAuth, getAllTopics);
entityRouter.get('/quizzes/:id', checkMixedAuth, getAllQuizzes);
entityRouter.get('/quiz/:id', checkMixedAuth, getQuiz);

export default entityRouter;
