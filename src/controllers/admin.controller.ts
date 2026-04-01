import { Request, Response } from "express";
import Admin from "../models/admin.model";
import bcrypt from "bcryptjs";

export const createAdmin = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email,
    password: hash,
    role: role || 'admin', // default to admin if not provided
  });
  res.json(admin);
};

export const getAdmins = async (req: Request, res: Response) => {
  const admins = await Admin.find().select("-password");
  res.json(admins);
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateData.password = hash;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ success: true, data: updatedAdmin });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
};