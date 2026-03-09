import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

// Use PORT from .env or fallback to 5000
const PORT: number = Number(process.env.PORT) || 5000;

// Connect to MongoDB
connectDB();

// Listen on all interfaces (0.0.0.0) so other devices on the network can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  
});

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on http://192.168.1.31:${PORT}`);
// });
