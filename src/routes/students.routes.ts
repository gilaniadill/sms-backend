import { Router } from "express";
import { 
  createStudent,
  getAllStudents, 
  getStudentById, 
  updateStudent,
  deleteStudent, 
  deleteSelectedStudents,
  getStudentsByClass,
  countByClassSection,
} from "../controllers/student.controller";
import { uploadStudentphoto } from "../middleware/uplaod.middleware";

const router = Router();

// ================== STUDENT ROUTES ==================

// POST / (create)
router.post('/', uploadStudentphoto.single('photo'), createStudent);

// GET / (list with filters)
router.get('/', getAllStudents);

// GET /count (count by class/section)
router.get('/count', countByClassSection);

// GET /class/:className (students by class name)
router.get('/class/:className', getStudentsByClass);

// GET /:id (get by id)
router.get('/:id', getStudentById);

// PUT /:id (update)
router.put('/:id', uploadStudentphoto.single('photo'), updateStudent);

// DELETE /:id (delete single)
router.delete('/:id', deleteStudent);

// DELETE / (delete selected)
router.delete('/', deleteSelectedStudents);

export default router;