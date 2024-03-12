import { Schema, model, Document, Types } from 'mongoose';
import Category, { ICategory } from './categoryModel'; // Assuming the Category model file is in the same directory

export interface ISubject extends Document {
  name: string;
  category: Types.ObjectId | ICategory;
}

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const Subject = model<ISubject>('Subject', subjectSchema);

export default Subject;
