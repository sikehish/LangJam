import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel';
import Category from '../models/categoryModel';
import Subject from '../models/subjectModel';
import Topic from '../models/topicModel';
import Quiz, { IQuiz } from '../models/quizModel';
import asyncWrapper from 'express-async-handler';
import { AuthReq } from '../typings';


//Creating entities
// --------------------------------------------------------------------

// Create a new category
export const createCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const checkCategory = await Category.findOne({ name });
  if (checkCategory) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const data = await Category.create({ name });
  res.status(201).json({ status: 'success', data });
});

// Create a new subject under a category
export const createSubject = asyncWrapper(async (req: Request, res: Response) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    res.status(400);
    throw new Error('Subject name and categoryId are required');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const checkSubject = await Subject.findOne({ name, category: categoryId });
  if (checkSubject) {
    res.status(400);
    throw new Error('Subject already exists under this category');
  }

  const data = await Subject.create({ name, category: categoryId });
  res.status(201).json({ status: 'success', data });
});

// Create a new topic under a subject
export const createTopic = asyncWrapper(async (req: Request, res: Response) => {
  const { name, subjectId } = req.body;

  if (!name || !subjectId) {
    res.status(400);
    throw new Error('Topic name and subjectId are required');
  }

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  const checkTopic = await Topic.findOne({ name, subject: subjectId });
  if (checkTopic) {
    res.status(400);
    throw new Error('Topic already exists under this subject');
  }

  const data = await Topic.create({ name, subject: subjectId });
  res.status(201).json({ status: 'success', data });
});

// Create a new quiz under a topic
export const createQuiz = asyncWrapper(async (req: Request, res: Response) => {
  const id = ((req as unknown) as AuthReq).user;
  const user = await Admin.findById(id); // Assuming you have an Admin model

  if (!user) {
    res.status(404);
    throw new Error("User isn't authorized");
  }

  const { topic, difficultyLevel, numberOfQuestions, questions }: IQuiz= req.body;

  // Check if the topic exists
  const checkTopic = await Topic.findById(topic);
  if (!checkTopic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // Validate the number of questions
  if (questions.length !== numberOfQuestions) {
    res.status(400);
    throw new Error('Number of questions does not match the specified count');
  }

  // Create the quiz
  const quizData = {
    questions,
    topic,
    difficultyLevel,
    numberOfQuestions,
  };

  const quiz = await Quiz.create(quizData);
  res.status(201).json({ status: 'success', data: quiz });
});

//Getting entities
// --------------------------------------------
export const getAllCategories = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Category.find();
  res.status(200).json({ status: 'success', data });
});

export const getAllSubjects = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Subject.find();
  res.status(200).json({ status: 'success', data });
});

export const getAllTopics = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Topic.find();
  res.status(200).json({ status: 'success', data });
});

export const getAllQuizzes = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Quiz.find();
  res.status(200).json({ status: 'success', data });
});

//Deleting entities
// ----------------------

//Deleting a category
export const deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const subjects = await Subject.find({ category: categoryId });
  for (const subject of subjects) {
    const topics = await Topic.find({ subject: subject._id });
    for (const topic of topics) {
      const quizzes = await Quiz.find({ topic: topic._id });
      for (const quiz of quizzes) {
        await Quiz.findByIdAndDelete(quiz._id);
      }
      await Topic.findByIdAndDelete(topic._id);
    }
    await Subject.findByIdAndDelete(subject._id);
  }
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  res.status(200).json({ status: 'success', data: deletedCategory });
});

//Deleting a subject
export const deleteSubject = asyncWrapper(async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const topics = await Topic.find({ subject: subjectId });

  for (const topic of topics) {
    const quizzes = await Quiz.find({ topic: topic._id });
    for (const quiz of quizzes) await Quiz.findByIdAndDelete(quiz._id);
    await Topic.findByIdAndDelete(topic._id);
  }
  const deletedSubject = await Subject.findByIdAndDelete(subjectId);

  res.status(200).json({ status: 'success', data: deletedSubject });
});

// Delete a topic and its associated quizzes
export const deleteTopic = asyncWrapper(async (req: Request, res: Response) => {
  const { topicId } = req.params;

  // Delete the topic
  const deletedTopic = await Topic.findByIdAndDelete(topicId);
  
  // Delete all quizzes under the deleted topic
  await Quiz.deleteMany({ topic: topicId });

  res.status(200).json({ status: 'success', data: deletedTopic });
});

// Delete a quiz
export const deleteQuiz = asyncWrapper(async (req: Request, res: Response) => {
  const { quizId } = req.params;

  // Delete the quiz
  const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

  res.status(200).json({ status: 'success', data: deletedQuiz });
});
