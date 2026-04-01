import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../models/admin.model'; // adjust if your models are in src/models

// Load environment variables from the .env file at the project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const createSuperAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('Superadmin already exists:', existing.email);
      process.exit(0);
    }

    const password = 'SuperAdmin123'; // Change this
    const hashed = await bcrypt.hash(password, 10);
    const superadmin = await Admin.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashed,
      role: 'superadmin',
    });

    console.log('✅ Superadmin created successfully!');
    console.log('Email:', superadmin.email);
    console.log('Password:', password);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();