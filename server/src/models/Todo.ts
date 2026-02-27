import mongoose, { Document } from 'mongoose';

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  date: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

todoSchema.index({ userId: 1, date: 1 });

export default mongoose.model<ITodo>('Todo', todoSchema);
