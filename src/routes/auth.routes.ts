import { Router } from "express"
import {
loginAdmin,
// forgotPassword,
// resetPassword
} from "../controllers/auth.controller"

const router = Router()

router.post("/login",loginAdmin)

export default router