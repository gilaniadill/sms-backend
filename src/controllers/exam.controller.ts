import { Request, Response } from 'express';
import { Exam } from '../models/exam.model';
import { Class } from '../models/class.model';
import { Result } from '../models/result.model';

export const createExam = async (req: Request, res: Response) => {
  try {
    const { class: classId, group, subjects, ...rest } = req.body;

    const classDoc = await Class.findById(classId);
    if (!classDoc) return res.status(400).json({ success: false, message: 'Class not found' });

    if (group) {
      const groupExists = classDoc.groups.some(g => g.name === group);
      if (!groupExists) return res.status(400).json({ success: false, message: 'Group not found in class' });
    }

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, message: 'Subjects are required' });
    }

    const exam = await Exam.create({ ...rest, class: classId, group, subjects });
    res.status(201).json({ success: true, data: exam });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExamsByClass = async (req: Request, res: Response) => {
  try {
    const { classId, group } = req.query;
    const filter: any = {};
    if (classId) filter.class = classId;
    if (group) filter.group = group;
    const exams = await Exam.find(filter).populate('class', 'className groups');
    res.json({ success: true, data: exams });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('class');
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    await Result.deleteMany({ exam: req.params.id });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};