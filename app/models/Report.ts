import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IReport extends Document {
  user: Types.ObjectId;
  budget: Types.ObjectId;
  type: 'monthly' | 'yearly' | 'custom';
  startDate: Date;
  endDate: Date;
  data: object;
}

const reportSchema: Schema<IReport> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },
  type: { type: String, required: true, enum: ['monthly', 'yearly', 'custom'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  data: { type: Schema.Types.Mixed, required: true },
});

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;
