import { Schema, model, Document, Types } from 'mongoose';
import Subject, { ISubject } from './subjectModel'; // Assuming the Subject model file is in the same directory

export interface ITopic extends Document {
  name: string;
  subject: Types.ObjectId | ISubject;
}

const topicSchema = new Schema<ITopic>({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
});

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;
