import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/admin.model'; // adjust path if needed

dotenv.config(); // load .env

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed function
async function seedAdmin() {
  try {
    const existing = await Admin.findOne({ email: 'admin@school.edu' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Password123', 10);

    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@school.edu',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

seedAdmin();