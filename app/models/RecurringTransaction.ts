import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IRecurringTransaction extends Document {
  user: Types.ObjectId;
  budget: Types.ObjectId;
  category: string;
  amount: number;
  description?: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextOccurrence: Date;
  type: 'expense' | 'income';
}

const recurringTransactionSchema: Schema<IRecurringTransaction> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  interval: { type: String, required: true, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
  nextOccurrence: { type: Date, required: true },
  type: { type: String, required: true, enum: ['expense', 'income'] },
});

const RecurringTransaction: Model<IRecurringTransaction> = mongoose.models.RecurringTransaction || mongoose.model<IRecurringTransaction>('RecurringTransaction', recurringTransactionSchema);

export default RecurringTransaction;
