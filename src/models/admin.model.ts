import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin';
  resetToken?: string;
  resetExpire?: Date;
}

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  resetToken: String,
  resetExpire: Date,
}, { timestamps: true });

export default mongoose.model<IAdmin>("Admin", AdminSchema);