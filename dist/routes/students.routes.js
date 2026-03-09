"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const uplaod_middleware_1 = require("../middleware/uplaod.middleware");
const router = (0, express_1.Router)();
// ================== STUDENT ROUTES ==================
// POST / (create)
router.post('/', uplaod_middleware_1.uploadStudentphoto.single('photo'), student_controller_1.createStudent);
// GET / (list with filters)
router.get('/', student_controller_1.getAllStudents);
// GET /count (count by class/section)
router.get('/count', student_controller_1.countByClassSection);
// GET /class/:className (students by class name)
router.get('/class/:className', student_controller_1.getStudentsByClass);
// GET /:id (get by id)
router.get('/:id', student_controller_1.getStudentById);
// PUT /:id (update)
router.put('/:id', uplaod_middleware_1.uploadStudentphoto.single('photo'), student_controller_1.updateStudent);
// DELETE /:id (delete single)
router.delete('/:id', student_controller_1.deleteStudent);
// DELETE / (delete selected)
router.delete('/', student_controller_1.deleteSelectedStudents);
exports.default = router;
