"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadStudentphoto = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/students');
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueName}${path_1.default.extname(file.originalname)}`);
    }
});
exports.uploadStudentphoto = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        const allowTypes = /jpeg|jpg|png/;
        const isValid = allowTypes.test(file.mimetype) &&
            allowTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (isValid) {
            cb(null, true);
        }
        else {
            cb(undefined, false);
        }
    }
});
