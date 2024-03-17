import express from 'express';
import {
  createCategory,
  createSubject,
  createTopic,
  createQuiz,
  deleteCategory,
  deleteSubject,
  deleteTopic,
  deleteQuiz,
  updateCategory,
  updateSubject,
  updateTopic,
  updateQuiz,
  getAdminStats,
  generateQuiz,
} from '../controllers/adminController'; // Import your controllers

import { checkAdminAuth, checkAuth, checkMixedAuth } from '../middleware/authMiddleware'; // Import your auth middleware

const adminRouter = express.Router();

// Creating entities
adminRouter.post('/categories', checkAdminAuth, createCategory);
adminRouter.post('/subjects/:id', checkAdminAuth, createSubject);
adminRouter.post('/topics/:id', checkAdminAuth, createTopic);
adminRouter.post('/quizzes/', checkAdminAuth, createQuiz);

// Deleting entities
adminRouter.delete('/categories/:categoryId', checkAdminAuth, deleteCategory);
adminRouter.delete('/subjects/:subjectId', checkAdminAuth, deleteSubject);
adminRouter.delete('/topics/:topicId', checkAdminAuth, deleteTopic);
adminRouter.delete('/quizzes/:quizId', checkAdminAuth, deleteQuiz);

// Updating entities
adminRouter.patch('/categories/:categoryId', checkAdminAuth, updateCategory);
adminRouter.patch('/subjects/:subjectId', checkAdminAuth, updateSubject);
adminRouter.patch('/topics/:topicId', checkAdminAuth, updateTopic);
adminRouter.patch('/quizzes/:quizId', checkAdminAuth, updateQuiz);

//Stats data
adminRouter.get('/stats', checkAdminAuth, getAdminStats)

//Quiz generation
adminRouter.post('/ai-quiz-gen', checkAdminAuth, generateQuiz)

export default adminRouter;
