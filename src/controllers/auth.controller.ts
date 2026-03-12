import { Request,Response } from "express"
import Admin from "../models/admin.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"




export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Include name and email in the token payload
  const token = jwt.sign(
  { 
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: "admin"
  },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
);

  // Send user data without password
  const userData = {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: 'admin' // add role if needed
  };

  res.json({ token, user: userData });
};
