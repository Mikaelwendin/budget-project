import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface ICategory extends Document {
  name: string;
  user: Types.ObjectId;
  type: 'expense' | 'income';
}

const categorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['expense', 'income'] },
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
