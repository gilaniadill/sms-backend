import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {

  name: string;
  email: string;
  password: string;

  resetToken?: string;
  resetExpire?: Date;

}

const AdminSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  resetToken: String,

  resetExpire: Date

},{timestamps:true})

export default mongoose.model<IAdmin>("Admin",AdminSchema)