import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IBudget extends Document {
  name: string;
  user: Types.ObjectId;
  amount: number;
  createdAt: Date;
  expenses: Types.ObjectId[];
  incomes: Types.ObjectId[];
}

const budgetSchema: Schema<IBudget> = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
  incomes: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
});

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;

