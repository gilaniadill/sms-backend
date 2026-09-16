import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

// Routes
import studentRoutes from './routes/students.routes';
import classRoutes from "./routes/class.routes";
import attendanceRoutes from "./routes/attendance.routes";
import resultRoutes from "./routes/result.routes";
import examRoutes from "./routes/exam.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

// =========================
// UPLOADS STATIC FILES
// =========================
app.use(
  '/api/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

// =========================
// ANGULAR FRONTEND (PRODUCTION)
// =========================

// IMPORTANT: robust path (works with Task Scheduler / PM2 / node dist)
const frontendPath = path.resolve(
  __dirname,
  "../../school-management-system-frontend/dist/school-management-system-frontend/browser"
);

// Serve Angular static files
app.use(express.static(frontendPath));

// SPA fallback (VERY IMPORTANT)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// app.get('/api', (_req, res) => {
//   res.send('School Management API Running');
// });

export default app;
