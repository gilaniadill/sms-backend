"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExam = exports.updateExam = exports.getExamById = exports.getExamsByClass = exports.createExam = void 0;
const exam_model_1 = require("../models/exam.model");
const class_model_1 = require("../models/class.model");
const result_model_1 = require("../models/result.model");
const createExam = async (req, res) => {
    try {
        const { class: classId, group, subjects, ...rest } = req.body;
        const classDoc = await class_model_1.Class.findById(classId);
        if (!classDoc)
            return res.status(400).json({ success: false, message: 'Class not found' });
        if (group) {
            const groupExists = classDoc.groups.some(g => g.name === group);
            if (!groupExists)
                return res.status(400).json({ success: false, message: 'Group not found in class' });
        }
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ success: false, message: 'Subjects are required' });
        }
        const exam = await exam_model_1.Exam.create({ ...rest, class: classId, group, subjects });
        res.status(201).json({ success: true, data: exam });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createExam = createExam;
const getExamsByClass = async (req, res) => {
    try {
        const { classId, group } = req.query;
        const filter = {};
        if (classId)
            filter.class = classId;
        if (group)
            filter.group = group;
        const exams = await exam_model_1.Exam.find(filter).populate('class', 'className groups');
        res.json({ success: true, data: exams });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getExamsByClass = getExamsByClass;
const getExamById = async (req, res) => {
    try {
        const exam = await exam_model_1.Exam.findById(req.params.id).populate('class');
        if (!exam)
            return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getExamById = getExamById;
const updateExam = async (req, res) => {
    try {
        const exam = await exam_model_1.Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam)
            return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateExam = updateExam;
const deleteExam = async (req, res) => {
    try {
        const exam = await exam_model_1.Exam.findByIdAndDelete(req.params.id);
        if (!exam)
            return res.status(404).json({ success: false, message: 'Exam not found' });
        await result_model_1.Result.deleteMany({ exam: req.params.id });
        res.json({ success: true, message: 'Exam deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteExam = deleteExam;
