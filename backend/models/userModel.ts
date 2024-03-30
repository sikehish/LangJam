import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { isEmail, isStrongPassword } from "validator"

export interface Attempt {
  quizId: Types.ObjectId; 
  questionId: Types.ObjectId; 
  chosenOption: number; 
  isCorrect: boolean; 
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createToken(verify?: boolean): string;
  attempts: Attempt[];
  xp: number; 
  recordAttempt(quizId: Types.ObjectId, questionId: Types.ObjectId, chosenOption: number, isCorrect: boolean, difficulty: "Easy" | "Medium" | "Hard"): void;
}

const attemptSchema = new Schema<Attempt>({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  chosenOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
});

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Your name cannot be less than 3 characters'],
    maxlength: [20,'Your name cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail,'Entered email address not valid!']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [isStrongPassword, 'Password not strong enough']
  },
  isAdmin:{
    type: Boolean,
    default: true
  },
  attempts: [attemptSchema],
  xp: {
    type: Number,
    default: 0 
  }
},{
  timestamps: true
});

// Method to record a user's attempt at answering a question and update XP
userSchema.methods.recordAttempt = async function (
  this: UserDocument,
  quizId: Types.ObjectId,
  questionId: Types.ObjectId,
  chosenOption: number,
  isCorrect: boolean,
  difficulty: 'Easy' | 'Medium' | 'Hard' // Add difficulty parameter
) {
  let xpEarned = 0;
  if (isCorrect) {
    switch (difficulty) {
      case 'Easy':
        xpEarned = 5;
        break;
      case 'Medium':
        xpEarned = 10;
        break;
      case 'Hard':
        xpEarned = 20;
        break;
    }
  }
  this.xp += xpEarned;
  this.attempts.push({ quizId, questionId, chosenOption, isCorrect });
  await this.save();
};

//Using pre middleware function to utilise the data validation used in the schema https://mongoosejs.com/docs/validation.html
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.createToken = function (this: UserDocument, verify = false): string {
  return verify
    ? jwt.sign({ id: this.id }, process.env.JWT_VERIFY_KEY as jwt.Secret, { expiresIn: '2d' })
    : jwt.sign({ id: this.id }, process.env.JWT_KEY as jwt.Secret, { expiresIn: '2d' });
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
