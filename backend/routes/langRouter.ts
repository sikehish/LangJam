import express, { Router } from 'express';
const langRouter = express.Router();
import { createLanguage, getAllLanguages } from '../controllers/languageController';
import { checkAdminAuth, checkAuth } from '../middleware/authMiddleware';

langRouter.route('/create-lang').post(checkAdminAuth, createLanguage);
langRouter.route('/all-lang').get(getAllLanguages);

export { langRouter };
