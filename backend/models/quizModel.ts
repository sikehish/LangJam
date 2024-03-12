import { Schema, model, Document, Types } from 'mongoose';
import Topic, { ITopic } from './topicModel'; // Assuming the Topic model file is in the same directory

interface IQuiz extends Document {
  question: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  choices: string[];
  correctOption: number;
  explanation: string;
  topic: Types.ObjectId | ITopic;
}

const quizSchema = new Schema<IQuiz>({
  question: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
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
  topic: {
    type: Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
});

const Quiz = model<IQuiz>('Quiz', quizSchema);

export default Quiz;
