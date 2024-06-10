import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IExpense extends Document {
  user: Types.ObjectId;
  budget: Types.ObjectId;
  category: string;
  amount: number;
  description?: string;
  date: Date;
}

const expenseSchema: Schema<IExpense> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense;

