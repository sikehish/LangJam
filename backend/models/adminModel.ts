import mongoose, { Schema, Document } from 'mongoose';
import { isEmail, isStrongPassword } from 'validator';

interface AdminSchema extends Document {
  email: string;
  password: string;
}

const adminSchema: Schema<AdminSchema> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail, 'Entered email address not valid!'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [isStrongPassword, 'Password not strong enough'],
  },
}, {
  timestamps: true,
});


const Admin = mongoose.model<AdminSchema>('Admin', adminSchema);

export default Admin;
