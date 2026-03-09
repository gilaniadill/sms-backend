// models/attendance.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  class: mongoose.Types.ObjectId;
  section: string;
  date: string;
  present: number;
  absent: number;
  total: number;
}

const attendanceSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true },
    date: { type: String, required: true },
    present: { type: Number, required: true },
    absent: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

// prevent duplicate attendance
attendanceSchema.index({ class: 1, section: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);