"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.updateAdmin = exports.getAdmins = exports.createAdmin = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcryptjs_1.default.hash(password, 10);
    const admin = await admin_model_1.default.create({
        name,
        email,
        password: hash
    });
    res.json(admin);
};
exports.createAdmin = createAdmin;
const getAdmins = async (req, res) => {
    const admins = await admin_model_1.default.find().select("-password");
    res.json(admins);
};
exports.getAdmins = getAdmins;
// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password) {
            const hash = await bcryptjs_1.default.hash(password, 10);
            updateData.password = hash;
        }
        const updatedAdmin = await admin_model_1.default.findByIdAndUpdate(id, updateData, { new: true } // return updated document
        ).select("-password");
        if (!updatedAdmin)
            return res.status(404).json({ message: "Admin not found" });
        res.json({ success: true, data: updatedAdmin });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    await admin_model_1.default.findByIdAndDelete(req.params.id);
    res.json({
        message: "Admin deleted"
    });
};
exports.deleteAdmin = deleteAdmin;
