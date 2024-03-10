import { NextFunction } from "express";
;
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { Jwt } from 'jsonwebtoken';
import validator from 'validator';
import { isEmail, isStrongPassword } from "validator"

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createToken(verify?: boolean): string;
}

// export interface UserModel extends Model<UserDocument> {
//   createToken(verify?: boolean): string;
// }

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
  },isAdmin:{
    type: Boolean,
    default: true
  }
  
  //NOTE: Will be implemented later
//   verified: {
//     type: Boolean,
//     required: true,
//     default: false
// }
},{
  timestamps: true
});

//Using pre middleware function to utilise the data validation used in the schema https://mongoosejs.com/docs/validation.html

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.createToken = function (verify = false): string {
  return verify
    ? jwt.sign({ id: this.id }, process.env.JWT_VERIFY_KEY as jwt.Secret, { expiresIn: '2d' })
    : jwt.sign({ id: this.id }, process.env.JWT_KEY as jwt.Secret, { expiresIn: '2d' });
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;