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
  let { name } = req.body;
  name=name.trim()
  console.log(req.body)

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

//Update entities
// --------------------------------------

//Update Category
export const updateCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Name is required for update');
  }

  const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

  if (!updatedCategory) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({ status: 'success', data: updatedCategory });
});

//Update Subject
export const updateSubject = asyncWrapper(async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    res.status(400);
    throw new Error('Name and categoryId are required for update');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const updatedSubject = await Subject.findByIdAndUpdate(subjectId, { name /*, category: categoryId*/ }, { new: true });

  if (!updatedSubject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  res.status(200).json({ status: 'success', data: updatedSubject });
});

//Update Topic
export const updateTopic = asyncWrapper(async (req: Request, res: Response) => {
  const { topicId } = req.params;
  const { name, subjectId } = req.body;

  if (!name || !subjectId) {
    res.status(400);
    throw new Error('Name and subjectId are required for update');
  }

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  const updatedTopic = await Topic.findByIdAndUpdate(topicId, { name /*,subject: subjectId*/ }, { new: true });
  //

  if (!updatedTopic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  res.status(200).json({ status: 'success', data: updatedTopic });
});


//Update Quiz
export const updateQuiz = asyncWrapper(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { topic, difficultyLevel, numberOfQuestions, questions } = req.body;

  const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, {
    topic,
    difficultyLevel,
    numberOfQuestions,
    questions,
  }, { new: true });

  if (!updatedQuiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  res.status(200).json({ status: 'success', data: updatedQuiz });
});

// // Update a question in a quiz
// export const updateQuestion = asyncWrapper(async (req: Request, res: Response) => {
//   const { quizId, questionId } = req.params;
//   const { question, choices, correctOption, explanation } = req.body;

//   // Check if the quiz exists
//   const quiz = await Quiz.findById(quizId);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }

//   // Check if the question exists in the quiz
//   const existingQuestion = quiz.questions.find((question) => question._id.toString() === questionId);
//   if (!existingQuestion) {
//     res.status(404);
//     throw new Error('Question not found in the quiz');
//   }
  

//   // Update the question fields
//   existingQuestion.question = question || existingQuestion.question;
//   existingQuestion.choices = choices || existingQuestion.choices;
//   existingQuestion.correctOption = correctOption || existingQuestion.correctOption;
//   existingQuestion.explanation = explanation || existingQuestion.explanation;

//   // Save the updated quiz
//   const updatedQuiz = await quiz.save();

//   res.status(200).json({ status: 'success', data: updatedQuiz });
// });


// Update a question in a quiz
export const updateQuestion = asyncWrapper(async (req: Request, res: Response) => {
  const { quizId, questionId } = req.params;
  const { question, choices, correctOption, explanation } = req.body;

  // Check if the quiz exists
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // Use findByIdAndUpdate to update the question in the quiz
  const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    {
      $set: {
        'questions.$[element].question': question,
        'questions.$[element].choices': choices,
        'questions.$[element].correctOption': correctOption,
        'questions.$[element].explanation': explanation,
      },
    },
    { arrayFilters: [{ 'element._id': questionId }], new: true }
  );

  if (!updatedQuiz) {
    res.status(404);
    throw new Error('Question not found in the quiz');
  }

  res.status(200).json({ status: 'success', data: updatedQuiz });
});

