"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.getAttendance = exports.createAttendance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_model_1 = require("../models/attendance.model");
const student_model_1 = require("../models/student.model");
// CREATE attendance
const createAttendance = async (req, res) => {
    try {
        const { classId, section, date, present, absent } = req.body;
        if (!classId || !section || !date) {
            return res.status(400).json({
                success: false,
                message: "Class, section and date are required",
            });
        }
        const total = await student_model_1.Student.countDocuments({
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
        const attendance = await attendance_model_1.Attendance.create({
            class: classId,
            section,
            date,
            present,
            absent,
            total,
        });
        const populated = await attendance.populate("class", "className");
        res.status(201).json({ success: true, data: populated });
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Attendance already exists for this date",
            });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.createAttendance = createAttendance;
// GET ALL attendance
const getAttendance = async (_req, res) => {
    const data = await attendance_model_1.Attendance.find()
        .populate("class", "className")
        .sort({ date: -1 });
    res.json({ success: true, data });
};
exports.getAttendance = getAttendance;
// UPDATE attendance
const updateAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        const { classId, section, date, present, absent } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }
        // Get existing attendance to find original class/section if not provided
        const existing = await attendance_model_1.Attendance.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Attendance not found" });
        }
        const useClass = classId || existing.class;
        const useSection = section || existing.section;
        const total = await student_model_1.Student.countDocuments({
            class: useClass,
            section: useSection,
        });
        if (present + absent > total) {
            return res.status(400).json({
                success: false,
                message: "Present + Absent cannot exceed total students",
            });
        }
        const attendance = await attendance_model_1.Attendance.findByIdAndUpdate(id, {
            class: useClass,
            section: useSection,
            date: date || existing.date,
            present,
            absent,
            total,
        }, { new: true }).populate("class", "className");
        res.json({ success: true, data: attendance });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateAttendance = updateAttendance;
// DELETE attendance
const deleteAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }
        const deleted = await attendance_model_1.Attendance.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Attendance not found" });
        }
        res.json({ success: true, message: "Attendance deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteAttendance = deleteAttendance;
