"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countByClassSection = exports.getStudentsByClass = exports.deleteSelectedStudents = exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const student_model_1 = require("../models/student.model");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create new Student (POST API)
const createStudent = async (req, res) => {
    try {
        const studentData = req.body;
        if (req.file) {
            studentData.photo = req.file.path;
        }
        const student = await student_model_1.Student.create(req.body);
        res.status(201).json({
            success: true,
            data: student
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            data: error.message
        });
    }
};
exports.createStudent = createStudent;
// Get ALL
const getAllStudents = async (req, res) => {
    try {
        console.log('API Called: getAllStudents');
        console.log('Query params:', req.query);
        const { className, section, search } = req.query;
        const query = {};
        if (className) {
            console.log('Filtering by class:', className);
            query.class = className;
        }
        if (section) {
            console.log('Filtering by section:', section);
            query.section = section;
        }
        // Handle search parameter
        if (search && typeof search === 'string') {
            const searchTerm = search.trim();
            console.log('Search term:', searchTerm);
            if (searchTerm) {
                const words = searchTerm.split(/\s+/);
                console.log('Search words:', words);
                // Create search conditions
                const searchConditions = words.map((word) => ({
                    $or: [
                        { firstName: new RegExp(word, 'i') },
                        { lastName: new RegExp(word, 'i') },
                        { fatherName: new RegExp(word, 'i') },
                        { admissionNo: new RegExp(word, 'i') }
                    ]
                }));
                query.$and = searchConditions;
            }
        }
        console.log('Final query:', JSON.stringify(query));
        const students = await student_model_1.Student.find(query)
            .populate('class', 'className sections') // ✅ IMPORTANT LINE
            .sort({ createdAt: -1 });
        console.log(`Found ${students.length} students`);
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    }
    catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllStudents = getAllStudents;
// Get Student By ID (GET BY ID API)
const getStudentById = async (req, res) => {
    try {
        const student = await student_model_1.Student.findById(req.params.id)
            .populate('class', 'className sections');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            data: student
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID'
        });
    }
};
exports.getStudentById = getStudentById;
// Update student (PUT API) - Fixed
const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Find student first
        const student = await student_model_1.Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        // Handle photo replacement
        if (req.file) {
            // Delete old photo if exists
            if (student.photo) {
                const oldPhotoPath = path_1.default.join(__dirname, '../../', student.photo);
                if (fs_1.default.existsSync(oldPhotoPath)) {
                    fs_1.default.unlinkSync(oldPhotoPath);
                }
            }
            req.body.photo = req.file.path;
        }
        const updatedStudent = await student_model_1.Student.findByIdAndUpdate(studentId, req.body, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: updatedStudent
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateStudent = updateStudent;
// Delete Student (DELETE API) - Fixed
const deleteStudent = async (req, res) => {
    try {
        const student = await student_model_1.Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        // Delete photo if exists
        if (student.photo) {
            const photoPath = path_1.default.join(__dirname, '../../', student.photo);
            if (fs_1.default.existsSync(photoPath)) {
                fs_1.default.unlinkSync(photoPath);
            }
        }
        await student.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID'
        });
    }
};
exports.deleteStudent = deleteStudent;
// Delete Selected Records (API) - Fixed
const deleteSelectedStudents = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of student IDs'
            });
        }
        // Validate IDs
        const validIds = ids.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
        // Find students
        const students = await student_model_1.Student.find({ _id: { $in: validIds } });
        // Delete photos
        students.forEach((student) => {
            if (student.photo) {
                const photoPath = path_1.default.join(__dirname, '../../', student.photo);
                if (fs_1.default.existsSync(photoPath)) {
                    fs_1.default.unlinkSync(photoPath);
                }
            }
        });
        // Delete students
        const result = await student_model_1.Student.deleteMany({ _id: { $in: validIds } });
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} student(s) deleted successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteSelectedStudents = deleteSelectedStudents;
const getStudentsByClass = async (req, res) => {
    try {
        const { className } = req.params;
        // filter by class name (since Student.class is a string)
        const students = await student_model_1.Student.find({ class: className })
            .sort({ firstName: 1 });
        res.json({ success: true, data: students });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
};
exports.getStudentsByClass = getStudentsByClass;
// Get student count by class section and optional section
const countByClassSection = async (req, res) => {
    try {
        const { classId, section } = req.query;
        // ✅ HARD SAFETY
        if (!classId ||
            typeof classId !== "string" ||
            !mongoose_1.default.Types.ObjectId.isValid(classId)) {
            return res.json({ success: true, total: 0 }); // 👈 IMPORTANT
        }
        if (!section) {
            return res.json({ success: true, total: 0 });
        }
        const total = await student_model_1.Student.countDocuments({
            class: classId,
            section,
        });
        res.json({ success: true, total });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.countByClassSection = countByClassSection;
