import { Request, Response } from "express";
import mongoose from "mongoose";
import { Attendance } from "../models/attendance.model";
import { Student } from "../models/student.model";

// CREATE attendance
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const { classId, section, date, present, absent } = req.body;

    if (!classId || !section || !date) {
      return res.status(400).json({
        success: false,
        message: "Class, section and date are required",
      });
    }

    const total = await Student.countDocuments({
      class: classId,
      section,
    });

    if (total === 0) {
      return res.status(400).json({
        success: false,
        message: "No students found in selected class/section",
      });
    }

    if (present + absent > total) {
      return res.status(400).json({
        success: false,
        message: "Present + Absent cannot exceed total students",
      });
    }

    const attendance = await Attendance.create({
      class: classId,
      section,
      date,
      present,
      absent,
      total,
    });

    const populated = await attendance.populate("class", "className");

    res.status(201).json({ success: true, data: populated });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already exists for this date",
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL attendance
export const getAttendance = async (_req: Request, res: Response) => {
  const data = await Attendance.find()
    .populate("class", "className")
    .sort({ date: -1 });

  res.json({ success: true, data });
};

// UPDATE attendance
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { classId, section, date, present, absent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    // Get existing attendance to find original class/section if not provided
    const existing = await Attendance.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    const useClass = classId || existing.class;
    const useSection = section || existing.section;

    const total = await Student.countDocuments({
      class: useClass,
      section: useSection,
    });

    if (present + absent > total) {
      return res.status(400).json({
        success: false,
        message: "Present + Absent cannot exceed total students",
      });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      {
        class: useClass,
        section: useSection,
        date: date || existing.date,
        present,
        absent,
        total,
      },
      { new: true }
    ).populate("class", "className");

    res.json({ success: true, data: attendance });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE attendance
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    res.json({ success: true, message: "Attendance deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};