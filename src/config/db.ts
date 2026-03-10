// src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB Connection failed:', err);

    // Optional: Retry every 5 seconds until it succeeds
    // console.log('Retrying connection in 5 seconds...');
    // setTimeout(connectDB, 5000);
  }
};