import { Request, Response } from "express";
import Admin from "../models/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Sign token
    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Send response
    const userData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    };
    res.json({ token, user: userData });

  } catch (error) {
    console.error("🔥 Login error:", error);  // This will appear in Render logs
    res.status(500).json({ message: "Internal server error" });
  }
};