import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  exam: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  marks: Map<string, number>; // subject -> marks
  total?: number;
  percentage?: number;
  grade?: string;
}

const ResultSchema = new Schema({
  exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  marks: { type: Map, of: Number, default: {} },
  total: { type: Number },
  percentage: { type: Number },
  grade: { type: String }
}, { timestamps: true });

ResultSchema.index({ exam: 1, student: 1 }, { unique: true });

// Pre-save hook to compute total, percentage, grade
ResultSchema.pre('save', async function(this: IResult) {
  const marksArray = Array.from(this.marks.values());
  const total = marksArray.reduce((acc, val) => acc + (val || 0), 0);
  this.total = total;
  const subjectCount = marksArray.length;
  if (subjectCount > 0) {
    // Assuming max marks per subject is stored in exam, but we need exam here.
    // For now, we assume maxMarks per subject is 100 (can be overridden by exam.maxMarks).
    // Better to fetch exam and use its maxMarks. We'll do that in the controller.
  }
});

export const Result = mongoose.model<IResult>('Result', ResultSchema);