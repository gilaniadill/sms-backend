import { Router } from 'express';
import {
  createExam,
  getExamsByClass,
  getExamById,
  updateExam,
  deleteExam
} from '../controllers/exam.controller';

const router = Router();
router.post('/', createExam);
router.get('/', getExamsByClass);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

export default router;