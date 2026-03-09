"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.loginAdmin);
// router.post('/forgot', forgotPassword);   // if frontend calls /auth/forgot
// // or
// router.post('/forgot-password', forgotPassword); // if frontend calls /auth/forgot-password
// router.post("/reset",resetPassword)
exports.default = router;
