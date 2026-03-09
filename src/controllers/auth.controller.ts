import { Request,Response } from "express"
import Admin from "../models/admin.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendEmail } from "../utils/mailer"



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
    { id: admin._id, name: admin.name, email: admin.email },
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
// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       // Return 200 with message to avoid revealing existence
//       return res.json({ message: "If that email exists, a reset link has been sent." });
//     }

//     const token = crypto.randomBytes(20).toString("hex");
//     admin.resetToken = token;
//     admin.resetExpire = new Date(Date.now() + 3600000); // 1 hour
//     await admin.save();

//     const link = `http://localhost:4200/reset/${token}`;

//     // Attempt to send email – wrap in try-catch to avoid crashing
//     try {
//       await sendEmail(email, "Reset Password", `Click here to reset password: ${link}`);
//     } catch (emailErr) {
//       console.error("Email sending failed:", emailErr);
//       // For development, you can return the token for testing (remove in production)
//       return res.json({
//         message: "Reset link generated (email sending failed). Use this token:",
//         token, // TEMPORARY – remove in production
//       });
//     }

//     res.json({ message: "Reset email sent" });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const resetPassword = async(req:Request,res:Response)=>{

// const {token,password} = req.body

// const admin = await Admin.findOne({

// resetToken:token,
// resetExpire:{$gt:new Date()}

// })

// if(!admin)
// return res.status(400).json({message:"Token invalid"})

// admin.password = await bcrypt.hash(password,10)

// admin.resetToken = undefined
// admin.resetExpire = undefined

// await admin.save()

// res.json({message:"Password updated"})

// }