import { Schema, model, Document, Types } from 'mongoose';
import Topic, { ITopic } from './topicModel';

interface IQuestion extends Document {
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

export interface IQuiz extends Document {
  questions: IQuestion[];
  topic: Types.ObjectId | ITopic;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  numberOfQuestions: number;
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
  topic: {
    type: Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  difficultyLevel: {
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
