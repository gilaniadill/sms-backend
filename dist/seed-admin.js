"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin_model_1 = __importDefault(require("./models/admin.model")); // adjust path if needed
dotenv_1.default.config(); // load .env
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// Seed function
async function seedAdmin() {
    try {
        const existing = await admin_model_1.default.findOne({ email: 'admin@school.edu' });
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }
        const hashedPassword = await bcryptjs_1.default.hash('Password123', 10);
        const admin = new admin_model_1.default({
            name: 'Admin User',
            email: 'admin@school.edu',
            password: hashedPassword
        });
        await admin.save();
        console.log('Admin created successfully');
        process.exit(0);
    }
    catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}
seedAdmin();
