"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const students_routes_1 = __importDefault(require("./routes/students.routes"));
const class_routes_1 = __importDefault(require("./routes/class.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const result_routes_1 = __importDefault(require("./routes/result.routes"));
const exam_routes_1 = __importDefault(require("./routes/exam.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
// ✅ All API routes now under /api
app.use('/api/students', students_routes_1.default);
app.use('/api/classes', class_routes_1.default);
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/exams', exam_routes_1.default);
app.use('/api/results', result_routes_1.default);
// Static files for uploads (keep as is)
app.use('/api/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.get('/', (_req, res) => {
    res.send('School Management API Running');
});
exports.default = app;
