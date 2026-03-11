import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from 'path';

import studentRoutes from './routes/students.routes';
import classRoutes from "./routes/class.routes";
import attendanceRoutes from "./routes/attendance.routes";
import resultRoutes from "./routes/result.routes";
import examRoutes from "./routes/exam.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);

app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// ✅ Serve uploaded files from the 'uploads' directory at the root path
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
    res.send('School Management API Running');
});

export default app;