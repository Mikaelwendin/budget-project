import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IRecurringTransaction extends Document {
  user: Types.ObjectId;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description?: string;
  frequency: 'monthly';
  startDate: Date;
  endDate?: Date;
}

const recurringTransactionSchema: Schema<IRecurringTransaction> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  frequency: { type: String, default: 'monthly' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const RecurringTransaction: Model<IRecurringTransaction> = mongoose.models.RecurringTransaction || mongoose.model<IRecurringTransaction>('RecurringTransaction', recurringTransactionSchema);

export default RecurringTransaction;
