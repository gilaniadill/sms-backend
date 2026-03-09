"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
dotenv_1.default.config();
// Use PORT from .env or fallback to 5000
const PORT = Number(process.env.PORT) || 5000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Listen on all interfaces (0.0.0.0) so other devices on the network can connect
app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on http://192.168.1.31:${PORT}`);
// });
