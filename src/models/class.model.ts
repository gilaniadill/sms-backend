import mongoose, { Schema, Document } from 'mongoose';

// Subject subdocument interface
export interface ISubject {
  name: string;
  maxMarks: number;
}

// Group subdocument interface
export interface IGroup {
  _id?: mongoose.Types.ObjectId; // optional for Mongoose
  name: string;
  subjects: ISubject[];
}

// Main Class document interface
export interface IClass extends Document {
  className: string;
  sections: string[];
  groups: mongoose.Types.DocumentArray<IGroup & Document>; // Mongoose subdocument array
}

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  maxMarks: { type: Number, required: true, default: 100 }
});

const GroupSchema = new Schema({
  name: { type: String, required: true },
  subjects: [SubjectSchema]
});

const ClassSchema: Schema = new Schema({
  className: { type: String, required: true, unique: true },
  sections: [{ type: String, required: true }],
  groups: [GroupSchema]
}, { timestamps: true });

export const Class = mongoose.model<IClass>('Class', ClassSchema);