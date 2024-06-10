import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  budgets: Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budgets: [{ type: Schema.Types.ObjectId, ref: 'Budget' }],
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;


