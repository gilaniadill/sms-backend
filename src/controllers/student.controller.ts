import { Request, Response } from "express";
import { Student } from "../models/student.model";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Define upload directory (consistent with multer config)
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "students");

// Create new Student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;

    console.log("FILE:", req.file);

    if (req.file && (req.file as any).path) {
      studentData.photo = (req.file as any).path; // ✅ Cloudinary URL
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      data: student
    });

  } catch (error: any) {
    console.error("CREATE ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// Get ALL
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    console.log("API Called: getAllStudents");
    console.log("Query params:", req.query);

    const { className, section, search } = req.query;
    const query: any = {};

    if (className) {
      console.log("Filtering by class:", className);
      query.class = className;
    }
    if (section) {
      console.log("Filtering by section:", section);
      query.section = section;
    }

    // Handle search parameter
    if (search && typeof search === "string") {
      const searchTerm = search.trim();
      console.log("Search term:", searchTerm);

      if (searchTerm) {
        const words = searchTerm.split(/\s+/);
        console.log("Search words:", words);

        // Create search conditions
        const searchConditions = words.map((word) => ({
          $or: [
            { firstName: new RegExp(word, "i") },
            { lastName: new RegExp(word, "i") },
            { fatherName: new RegExp(word, "i") },
            { admissionNo: new RegExp(word, "i") },
          ],
        }));

        query.$and = searchConditions;
      }
    }

    console.log("Final query:", JSON.stringify(query));
    const students = await Student.find(query)
      .populate("class", "className sections") // ✅ IMPORTANT LINE
      .sort({ createdAt: -1 });
    console.log(`Found ${students.length} students`);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error: any) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Student By ID (GET BY ID API)
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "class",
      "className sections",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    console.log("FILE:", req.file);

    // ✅ Handle image
    if (req.file && (req.file as any).path) {
      req.body.photo = (req.file as any).path;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedStudent
    });

  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
// Delete Student (DELETE API) - Fixed
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete photo if exists
    if (student.photo) {
      const photoPath = path.join(UPLOAD_DIR, student.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }
};

// Delete Selected Records (API) - Fixed
export const deleteSelectedStudents = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of student IDs",
      });
    }

    // Validate IDs
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    // Find students
    const students = await Student.find({ _id: { $in: validIds } });
    students.forEach((student) => {
      if (student.photo) {
        const photoPath = path.join(UPLOAD_DIR, student.photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }
    });

    // Delete students
    const result = await Student.deleteMany({ _id: { $in: validIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} student(s) deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentsByClass = async (req: Request, res: Response) => {
  try {
    const { className } = req.params;

    // filter by class name (since Student.class is a string)
    const students = await Student.find({ class: className }).sort({
      firstName: 1,
    });

    res.json({ success: true, data: students });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch students" });
  }
};

// Get student count by class section and optional section
export const countByClassSection = async (req: Request, res: Response) => {
  try {
    const { classId, section } = req.query;

    // ✅ HARD SAFETY
    if (
      !classId ||
      typeof classId !== "string" ||
      !mongoose.Types.ObjectId.isValid(classId)
    ) {
      return res.json({ success: true, total: 0 }); // 👈 IMPORTANT
    }

    if (!section) {
      return res.json({ success: true, total: 0 });
    }

    const total = await Student.countDocuments({
      class: classId,
      section,
    });

    res.json({ success: true, total });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
