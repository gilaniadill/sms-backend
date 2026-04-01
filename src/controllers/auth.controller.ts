import { Request, Response } from "express";
import Admin from "../models/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Include role in token payload
    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Return role in user data
    const userData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    res.json({ token, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};