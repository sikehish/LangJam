import express, { Router } from 'express';
const langRouter = express.Router();
import { createLanguage, getAllLanguages } from '../controllers/languageController';
import { checkAuth } from '../middleware/checkAuth';

langRouter.route('/create-lang').post(checkAuth, createLanguage);
langRouter.route('/all-lang').get(getAllLanguages);

export { langRouter };
