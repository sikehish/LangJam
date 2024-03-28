import { Schema, model, Document, Types } from 'mongoose';
import Topic, { ITopic } from './topicModel';
import { ObjectId } from 'mongodb';

interface IQuestion extends Document {
  id?:ObjectId
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

export interface IQuiz extends Document {
  title: string,
  questions: IQuestion[];
  topic: Types.ObjectId | ITopic;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  numberOfQuestions: number;
  content: string
}

const questionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  choices: [String],
  correctOption: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const quizSchema = new Schema<IQuiz>({
  questions: [questionSchema],
  content:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true,
    unique: true
  },
  topic: {
    type: Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  numberOfQuestions: {
    type: Number,
    required: true,
  },
});

const Quiz = model<IQuiz>('Quiz', quizSchema);

export default Quiz;
