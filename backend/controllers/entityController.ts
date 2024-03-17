import { Request, Response } from 'express';
import Category from '../models/categoryModel';
import Subject from '../models/subjectModel';
import Topic from '../models/topicModel';
import Quiz, { IQuiz } from '../models/quizModel';
import asyncWrapper from 'express-async-handler';
import { AuthReq } from '../typings';


//Getting entities
// --------------------------------------------
export const getAllCategories = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Category.find();
  res.status(200).json({ status: 'success', data });
});

export const getAllSubjects = asyncWrapper(async (req: Request, res: Response) => {
  const {id: categoryId}= req.params
  const data = await Subject.find({category:categoryId});
  res.status(200).json({ status: 'success', data });
});

export const getAllTopics = asyncWrapper(async (req: Request, res: Response) => {
  const {id: subjectId}= req.params
  const data = await Topic.find({subject: subjectId});
  res.status(200).json({ status: 'success', data });
});

export const getAllQuizzes = asyncWrapper(async (req: Request, res: Response) => {
  const {id: topicId}= req.params
  const data = await Quiz.find({topic: topicId});
  res.status(200).json({ status: 'success', data });
});

export const getQuiz = asyncWrapper(async (req: Request, res: Response) => {
  const {id: quizId}= req.params
  const data = await Quiz.findById(quizId);
  res.status(200).json({ status: 'success', data });
});
