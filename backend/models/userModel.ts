import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { isEmail, isStrongPassword } from "validator"

interface Attempt {
  quizId: Types.ObjectId; 
  questionId: Types.ObjectId; 
  chosenOption: number; 
  isCorrect: boolean; 
}


interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createToken(verify?: boolean): string;
  attempts: Attempt[];
}


const attemptSchema = new Schema<Attempt>({
  quizId: { type: Schema.Types.ObjectId, ref:"Quiz" ,required: true }, // Use Schema.Types.ObjectId here
  questionId: { type: Schema.Types.ObjectId,ref:"Question", required: true }, // Use Schema.Types.ObjectId here
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
  attempts: [attemptSchema] // Array of attempts
},{
  timestamps: true
});


// Method to record a user's attempt at answering a question
userSchema.methods.recordAttempt = async function (
  this: UserDocument,
  quizId: Types.ObjectId,
  questionId: Types.ObjectId,
  chosenOption: number,
  isCorrect: boolean
) {
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
