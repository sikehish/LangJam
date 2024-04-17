import mongoose, { Document, Schema, Types } from 'mongoose';

interface NoteDocument extends Document {
  title: string;
  description: string;
  userId: Types.ObjectId;
}

const noteSchema = new Schema<NoteDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [50, 'Title cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Note = mongoose.model<NoteDocument>('Note', noteSchema);

export default Note;
