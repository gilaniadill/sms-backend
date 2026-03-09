import { Router } from 'express';
import {
  getResults,
  bulkUpsertResults,
  deleteResults,
  getPrintData
} from '../controllers/result.controller';

const router = Router();

router.get('/', getResults);
router.post('/bulk', bulkUpsertResults);
router.delete('/', deleteResults);
router.post('/print', getPrintData);

export default router;