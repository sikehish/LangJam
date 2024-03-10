import mongoose, { Document } from 'mongoose';

export interface LanguageModel extends Document {
  name: string;
  exercises: mongoose.Types.ObjectId[];
}

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
});

const Language = mongoose.model<LanguageModel>('Language', languageSchema);

export default Language;
