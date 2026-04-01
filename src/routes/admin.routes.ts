import { Router } from "express";
import { protect, superAdminOnly } from "../middleware/auth.middleware";
import {
  createAdmin,
  getAdmins,
  deleteAdmin,
  updateAdmin,
} from "../controllers/admin.controller";

const router = Router();

// All admin routes require authentication and superadmin role
router.post("/", protect, superAdminOnly, createAdmin);
router.get("/", protect, superAdminOnly, getAdmins);
router.put("/:id", protect, superAdminOnly, updateAdmin);
router.delete("/:id", protect, superAdminOnly, deleteAdmin);

export default router;