import mongoose, { Schema, Document } from 'mongoose';

interface IToken extends Document {
  uid: mongoose.Types.ObjectId;
  token: string;
  expireAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      expires: 3600, // expires after 1 hour
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
