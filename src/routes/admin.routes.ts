import { Router } from "express"
import { protect } from "../middleware/auth.middleware"

import {
createAdmin,
getAdmins,
deleteAdmin,
updateAdmin
} from "../controllers/admin.controller"

const router = Router()

router.post("/",protect,createAdmin)

router.get("/",protect,getAdmins)

router.put("/:id", protect, updateAdmin);

router.delete("/:id",protect,deleteAdmin)

export default router