import express from 'express';
import {
  createCategory,
  createSubject,
  createTopic,
  createQuiz,
  getAllCategories,
  getAllSubjects,
  getAllTopics,
  getAllQuizzes,
  deleteCategory,
  deleteSubject,
  deleteTopic,
  deleteQuiz,
  updateCategory,
  updateSubject,
  updateTopic,
  updateQuiz,
} from '../controllers/adminController'; // Import your controllers

import { checkAdminAuth, checkAuth, checkMixedAuth } from '../middleware/authMiddleware'; // Import your auth middleware

const adminRouter = express.Router();

// Creating entities
adminRouter.post('/categories', checkAdminAuth, createCategory);
adminRouter.post('/subjects', checkAdminAuth, createSubject);
adminRouter.post('/topics', checkAdminAuth, createTopic);
adminRouter.post('/quizzes', checkAdminAuth, createQuiz);

// Getting entities
adminRouter.get('/categories', checkMixedAuth, getAllCategories);
adminRouter.get('/subjects', checkMixedAuth, getAllSubjects);
adminRouter.get('/topics', checkMixedAuth, getAllTopics);
adminRouter.get('/quizzes', checkMixedAuth, getAllQuizzes);

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

export default adminRouter;
