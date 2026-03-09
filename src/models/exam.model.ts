import mongoose, { Schema, Document } from 'mongoose';

export interface IExamSubject {
  name: string;
  maxMarks: number;
}

export interface IExam extends Document {
  name: string;
  class: mongoose.Types.ObjectId;
  group?: string;
  subjects: IExamSubject[];
  academicYear: string;
}

const ExamSubjectSchema = new Schema({
  name: { type: String, required: true },
  maxMarks: { type: Number, required: true }
});

const ExamSchema = new Schema({
  name: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  group: { type: String },
  subjects: [ExamSubjectSchema],
  academicYear: { type: String, required: true }
}, { timestamps: true });

export const Exam = mongoose.model<IExam>('Exam', ExamSchema);