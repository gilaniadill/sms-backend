"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = require("../controllers/class.controller");
const router = (0, express_1.Router)();
router.post('/', class_controller_1.createClass);
router.get('/', class_controller_1.getAllClasses);
router.get('/stats', class_controller_1.getClassStats);
router.get('/:id', class_controller_1.getClassById);
router.put('/:id', class_controller_1.updateClass);
router.delete('/:id', class_controller_1.deleteClass);
// Group management
router.get('/:classId/groups', class_controller_1.getGroupsByClass); // ✅ new GET endpoint
router.post('/:classId/groups', class_controller_1.addGroup);
router.put('/:classId/groups/:groupId', class_controller_1.updateGroup);
router.delete('/:classId/groups/:groupId', class_controller_1.deleteGroup);
exports.default = router;
