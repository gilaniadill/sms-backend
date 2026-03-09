"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"School Management" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Email could not be sent");
    }
};
exports.sendEmail = sendEmail;
