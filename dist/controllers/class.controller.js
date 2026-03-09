"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupsByClass = exports.deleteGroup = exports.updateGroup = exports.addGroup = exports.getClassStats = exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createClass = void 0;
const class_model_1 = require("../models/class.model");
const student_model_1 = require("../models/student.model");
// Create class
const createClass = async (req, res) => {
    try {
        const { className, sections } = req.body;
        const cls = await class_model_1.Class.create({ className, sections });
        res.status(201).json({ success: true, data: cls });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createClass = createClass;
// Get all classes
const getAllClasses = async (_req, res) => {
    try {
        const classes = await class_model_1.Class.find().sort({ className: 1 });
        res.status(200).json({ success: true, data: classes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllClasses = getAllClasses;
// Get class by ID
const getClassById = async (req, res) => {
    try {
        const classData = await class_model_1.Class.findById(req.params.id);
        if (!classData)
            return res.status(404).json({ message: "Class not found" });
        res.status(200).json(classData);
    }
    catch (error) {
        res.status(400).json({ message: "Invalid class ID" });
    }
};
exports.getClassById = getClassById;
// Update class (basic info)
const updateClass = async (req, res) => {
    try {
        const { className, sections } = req.body;
        const updated = await class_model_1.Class.findByIdAndUpdate(req.params.id, { className, sections }, { new: true, runValidators: true });
        if (!updated)
            return res.status(404).json({ success: false, message: 'Class not found' });
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateClass = updateClass;
// Delete class (only if no students)
const deleteClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const studentCount = await student_model_1.Student.countDocuments({ class: classId });
        if (studentCount > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete class. Students are assigned." });
        }
        const cls = await class_model_1.Class.findByIdAndDelete(classId);
        if (!cls)
            return res.status(404).json({ success: false, message: "Class not found" });
        res.status(200).json({ success: true, message: "Class deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteClass = deleteClass;
const getClassStats = async (_req, res) => {
    try {
        const stats = await class_model_1.Class.aggregate([
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: 'class',
                    as: 'students'
                }
            },
            {
                $project: {
                    className: 1,
                    sections: 1,
                    studentCount: { $size: '$students' }
                }
            },
            { $sort: { createdAt: 1 } } // or { _id: 1 } for insertion order
        ]);
        res.json({ success: true, data: stats });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getClassStats = getClassStats;
// Add a group to a class
const addGroup = async (req, res) => {
    try {
        console.log('=== addGroup called ===');
        console.log('params:', req.params);
        console.log('body:', JSON.stringify(req.body, null, 2));
        console.log('headers content-type:', req.headers['content-type']);
        const classId = String(req.params.classId);
        const { name, subjects } = req.body;
        // Validate input
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: 'Group name must be a string' });
        }
        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ success: false, message: 'Subjects must be a non-empty array' });
        }
        for (const subj of subjects) {
            if (!subj.name || typeof subj.name !== 'string') {
                return res.status(400).json({ success: false, message: 'Each subject must have a name' });
            }
            if (typeof subj.maxMarks !== 'number' || subj.maxMarks <= 0) {
                return res.status(400).json({ success: false, message: 'maxMarks must be a positive number' });
            }
        }
        const classDoc = await class_model_1.Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }
        // Check for duplicate group name
        const existing = classDoc.groups.find(g => g.name === name);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Group with this name already exists' });
        }
        classDoc.groups.push({ name, subjects });
        await classDoc.save();
        res.json({ success: true, data: classDoc });
    }
    catch (error) {
        console.error('Error in addGroup:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.addGroup = addGroup;
// Update a group
const updateGroup = async (req, res) => {
    try {
        const classId = String(req.params.classId);
        const groupId = String(req.params.groupId); // ✅ cast to string
        const { name, subjects } = req.body;
        const classDoc = await class_model_1.Class.findById(classId);
        if (!classDoc)
            return res.status(404).json({ success: false, message: 'Class not found' });
        const group = classDoc.groups.id(groupId);
        if (!group)
            return res.status(404).json({ success: false, message: 'Group not found' });
        // Check for duplicate name if changed
        if (name !== group.name) {
            const existing = classDoc.groups.find(g => g.name === name);
            if (existing) {
                return res.status(400).json({ success: false, message: 'Group with this name already exists' });
            }
        }
        group.name = name;
        group.subjects = subjects;
        await classDoc.save();
        res.json({ success: true, data: classDoc });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateGroup = updateGroup;
// Delete a group
const deleteGroup = async (req, res) => {
    try {
        const { classId, groupId } = req.params;
        const classDoc = await class_model_1.Class.findById(classId);
        if (!classDoc)
            return res.status(404).json({ success: false, message: 'Class not found' });
        // Cast groupId to string
        const gid = groupId;
        // Check if group exists
        const group = classDoc.groups.id(gid);
        if (!group)
            return res.status(404).json({ success: false, message: 'Group not found' });
        // Remove using pull (remove subdocument by its _id)
        classDoc.groups.pull({ _id: gid });
        await classDoc.save();
        res.json({ success: true, message: 'Group deleted' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteGroup = deleteGroup;
// Get all groups for a specific class
const getGroupsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const classDoc = await class_model_1.Class.findById(classId).select('groups');
        if (!classDoc) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }
        res.json({ success: true, data: classDoc.groups });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGroupsByClass = getGroupsByClass;
