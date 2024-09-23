import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IIncome extends Document {
  user: Types.ObjectId;
  budget: Types.ObjectId;
  source: string;
  amount: number;
  description?: string;
  date: Date;
  month: string;
  type: 'income';
}

const incomeSchema: Schema<IIncome> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  month: { type: String, required: true },
  type: { type: String, default: 'income' }
});

const Income: Model<IIncome> = mongoose.models.Income || mongoose.model<IIncome>('Income', incomeSchema);

export default Income;



