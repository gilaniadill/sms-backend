import { Request, Response } from 'express';
import { Result } from '../models/result.model';
import { Student } from '../models/student.model';
import { Exam } from '../models/exam.model';
import { Class } from '../models/class.model';

export const getResults = async (req: Request, res: Response) => {
  try {
    const { examId, classId, section } = req.query;
    const studentFilter: any = {};
    if (classId) studentFilter.class = classId;
    if (section) studentFilter.section = section;
    const students = await Student.find(studentFilter).select('_id');
    const studentIds = students.map(s => s._id);

    const resultFilter: any = { exam: examId };
    if (studentIds.length) resultFilter.student = { $in: studentIds };

    const results = await Result.find(resultFilter)
      .populate('student', 'admissionNo firstName lastName photo class section')
      .populate('exam', 'name group class'); // not populating full class yet

    // For each result, we need to attach subjects from the exam's group
    // But we'll handle that in the frontend by also fetching the exam details separately.

    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUpsertResults = async (req: Request, res: Response) => {
  try {
    const { examId, results } = req.body; // [{ studentId, marks }]
    const operations = results.map((item: any) => ({
      updateOne: {
        filter: { exam: examId, student: item.studentId },
        update: { $set: { marks: item.marks } },
        upsert: true
      }
    }));
    const bulkResult = await Result.bulkWrite(operations);
    res.json({ success: true, data: bulkResult });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResults = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const result = await Result.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrintData = async (req: Request, res: Response) => {
  try {
    const { examId, studentIds } = req.body;

    const results = await Result.find({ exam: examId, student: { $in: studentIds } })
      .populate({
        path: 'student',
        populate: { path: 'class', select: 'className sections groups' }
      })
      .populate('exam')
      .lean();

    const exam = await Exam.findById(examId).populate('class').lean();
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    // Try to get subjects from group, otherwise use exam snapshot
    let subjects: any[] = [];
    const classDoc = exam.class as any;
    if (classDoc && exam.group) {
      const group = classDoc.groups?.find((g: any) => g.name === exam.group);
      if (group && group.subjects) {
        subjects = group.subjects;
      }
    }
    // Fallback to exam's own subjects if group subjects missing
    if (subjects.length === 0 && exam.subjects) {
      subjects = exam.subjects;
    }

    const enrichedResults = results.map(r => ({
      ...r,
      exam: {
        ...r.exam,
        subjects
      }
    }));

    res.json({ success: true, data: enrichedResults });
  } catch (error: any) {
    console.error('Print API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};