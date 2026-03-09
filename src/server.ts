// src/server.ts
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

// Use PORT from .env or fallback
const PORT = Number(process.env.PORT) || 5000;

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});