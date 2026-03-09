import { Router } from "express";
import {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller";

const router = Router();

router.post("/", createAttendance);
router.get("/", getAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

export default router;