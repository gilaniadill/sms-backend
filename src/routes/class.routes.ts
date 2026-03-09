import { Router } from 'express';
import {
  createClass,
  getAllClasses,
  deleteClass,
  updateClass,
  getClassById,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroupsByClass,   // ✅ import the new method
  getClassStats
} from '../controllers/class.controller';

const router = Router();

router.post('/', createClass);
router.get('/', getAllClasses);
router.get('/stats', getClassStats);

router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

// Group management
router.get('/:classId/groups', getGroupsByClass);    // ✅ new GET endpoint
router.post('/:classId/groups', addGroup);
router.put('/:classId/groups/:groupId', updateGroup);
router.delete('/:classId/groups/:groupId', deleteGroup);

export default router;