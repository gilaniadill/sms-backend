"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintData = exports.deleteResults = exports.bulkUpsertResults = exports.getResults = void 0;
const result_model_1 = require("../models/result.model");
const student_model_1 = require("../models/student.model");
const exam_model_1 = require("../models/exam.model");
const getResults = async (req, res) => {
    try {
        const { examId, classId, section } = req.query;
        const studentFilter = {};
        if (classId)
            studentFilter.class = classId;
        if (section)
            studentFilter.section = section;
        const students = await student_model_1.Student.find(studentFilter).select('_id');
        const studentIds = students.map(s => s._id);
        const resultFilter = { exam: examId };
        if (studentIds.length)
            resultFilter.student = { $in: studentIds };
        const results = await result_model_1.Result.find(resultFilter)
            .populate('student', 'admissionNo firstName lastName photo class section')
            .populate('exam', 'name group class'); // not populating full class yet
        // For each result, we need to attach subjects from the exam's group
        // But we'll handle that in the frontend by also fetching the exam details separately.
        res.json({ success: true, data: results });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getResults = getResults;
const bulkUpsertResults = async (req, res) => {
    try {
        const { examId, results } = req.body; // [{ studentId, marks }]
        const operations = results.map((item) => ({
            updateOne: {
                filter: { exam: examId, student: item.studentId },
                update: { $set: { marks: item.marks } },
                upsert: true
            }
        }));
        const bulkResult = await result_model_1.Result.bulkWrite(operations);
        res.json({ success: true, data: bulkResult });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.bulkUpsertResults = bulkUpsertResults;
const deleteResults = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await result_model_1.Result.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, deletedCount: result.deletedCount });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteResults = deleteResults;
const getPrintData = async (req, res) => {
    try {
        const { examId, studentIds } = req.body;
        // Use .lean() to get plain objects – no .toObject() needed
        const results = await result_model_1.Result.find({ exam: examId, student: { $in: studentIds } })
            .populate({
            path: 'student',
            populate: { path: 'class', select: 'className sections groups' }
        })
            .populate('exam')
            .lean();
        // Fetch exam separately to extract subjects from its group
        const exam = await exam_model_1.Exam.findById(examId).populate('class').lean();
        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }
        // Extract subjects from the exam's group
        const classDoc = exam.class; // You can define a proper interface here
        const group = classDoc.groups?.find((g) => g.name === exam.group);
        const subjects = group ? group.subjects : [];
        // Enrich each result with the exam subjects
        const enrichedResults = results.map(r => ({
            ...r,
            exam: {
                ...r.exam,
                subjects
            }
        }));
        res.json({ success: true, data: enrichedResults });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPrintData = getPrintData;
