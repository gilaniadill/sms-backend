import { Request, Response } from 'express';
import { Class } from '../models/class.model';
import { Student } from '../models/student.model';

// Create class
export const createClass = async (req: Request, res: Response) => {
  try {
    const { className, sections } = req.body;
    const cls = await Class.create({ className, sections });
    res.status(201).json({ success: true, data: cls });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all classes
export const getAllClasses = async (_req: Request, res: Response) => {
  try {
    const classes = await Class.find().sort({ className: 1 });
    res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get class by ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) return res.status(404).json({ message: "Class not found" });
    res.status(200).json(classData);
  } catch (error) {
    res.status(400).json({ message: "Invalid class ID" });
  }
};

// Update class (basic info)
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { className, sections } = req.body;
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { className, sections },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Class not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete class (only if no students)
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const studentCount = await Student.countDocuments({ class: classId });
    if (studentCount > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete class. Students are assigned." });
    }
    const cls = await Class.findByIdAndDelete(classId);
    if (!cls) return res.status(404).json({ success: false, message: "Class not found" });
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getClassStats = async (_req: Request, res: Response) => {
  try {
    const stats = await Class.aggregate([
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a group to a class
export const addGroup = async (req: Request, res: Response) => {
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

    const classDoc = await Class.findById(classId);
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
  } catch (error: any) {
    console.error('Error in addGroup:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a group
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const classId = String(req.params.classId);
    const groupId = String(req.params.groupId);   // ✅ cast to string
    const { name, subjects } = req.body;

    const classDoc = await Class.findById(classId);
    if (!classDoc) return res.status(404).json({ success: false, message: 'Class not found' });

    const group = classDoc.groups.id(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Delete a group
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { classId, groupId } = req.params;
    const classDoc = await Class.findById(classId);
    if (!classDoc) return res.status(404).json({ success: false, message: 'Class not found' });

    // Cast groupId to string
    const gid = groupId as string;

    // Check if group exists
    const group = classDoc.groups.id(gid);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Remove using pull (remove subdocument by its _id)
    classDoc.groups.pull({ _id: gid });
    await classDoc.save();
    res.json({ success: true, message: 'Group deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all groups for a specific class
export const getGroupsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const classDoc = await Class.findById(classId).select('groups');
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.json({ success: true, data: classDoc.groups });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};