import express from 'express';
import {
  getAllCategories,
  getAllSubjects,
  getAllTopics,
  getAllQuizzes,

} from '../controllers/entityController'; // Import your controllers

import { checkAdminAuth, checkAuth, checkMixedAuth } from '../middleware/authMiddleware'; // Import your auth middleware

const entityRouter = express.Router();

// Getting entities
entityRouter.get('/categories', getAllCategories); //Categories can be viewed by non auth users
entityRouter.get('/subjects', checkMixedAuth, getAllSubjects);
entityRouter.get('/topics', checkMixedAuth, getAllTopics);
entityRouter.get('/quizzes', checkMixedAuth, getAllQuizzes);

export default entityRouter;
