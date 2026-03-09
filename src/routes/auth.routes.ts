import { Router } from "express"
import {
loginAdmin,
// forgotPassword,
// resetPassword
} from "../controllers/auth.controller"

const router = Router()

router.post("/login",loginAdmin)

// router.post('/forgot', forgotPassword);   // if frontend calls /auth/forgot
// // or
// router.post('/forgot-password', forgotPassword); // if frontend calls /auth/forgot-password

// router.post("/reset",resetPassword)

export default router