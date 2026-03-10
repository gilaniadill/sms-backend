import { Router } from "express"
import { protect } from "../middleware/auth.middleware"

import {
createAdmin,
getAdmins,
deleteAdmin,
updateAdmin
} from "../controllers/admin.controller"

const router = Router()

router.post("/",createAdmin)

router.get("/",getAdmins)

router.put("/:id", updateAdmin);

router.delete("/:id",deleteAdmin)

export default router