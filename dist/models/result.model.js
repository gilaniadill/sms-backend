"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ResultSchema = new mongoose_1.Schema({
    exam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    marks: { type: Map, of: Number, default: {} },
    total: { type: Number },
    percentage: { type: Number },
    grade: { type: String }
}, { timestamps: true });
ResultSchema.index({ exam: 1, student: 1 }, { unique: true });
// Pre-save hook to compute total, percentage, grade
ResultSchema.pre('save', async function () {
    const marksArray = Array.from(this.marks.values());
    const total = marksArray.reduce((acc, val) => acc + (val || 0), 0);
    this.total = total;
    const subjectCount = marksArray.length;
    if (subjectCount > 0) {
        // Assuming max marks per subject is stored in exam, but we need exam here.
        // For now, we assume maxMarks per subject is 100 (can be overridden by exam.maxMarks).
        // Better to fetch exam and use its maxMarks. We'll do that in the controller.
    }
});
exports.Result = mongoose_1.default.model('Result', ResultSchema);
