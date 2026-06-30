// backend/server.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< Updated upstream
import path from 'path';  // ✅ Add this
import { fileURLToPath } from 'url';  // ✅ Add this
import authRoutes from './src/modules/auth/auth.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';
import vendorRoutes from './src/modules/vendor/vendor.routes.js';

// ✅ For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
import path from 'path';
import authRoutes from './src/modules/auth/auth.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';
import riderRoutes from './src/modules/rider/rider.routes.js';
>>>>>>> Stashed changes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));
app.use(express.json());

<<<<<<< Updated upstream
// ✅ Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
// ============================================
// ✅ SERVE UPLOADS FOLDER - IMPORTANT!
// ============================================
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ============================================
// REGISTER ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/auth', adminRoutes);
app.use('/api/auth', riderRoutes);
>>>>>>> Stashed changes

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'DigitalRawalpindi API is running!' });
});

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
<<<<<<< Updated upstream
    console.log(`🔑 Auth: /api/auth`);
    console.log(`📋 Admin: /api/admin`);
    console.log(`📦 Vendor: /api/vendor`);
    console.log(`📁 Uploads: /uploads`);  // ✅ Added
=======
    console.log('✅ Uploads folder served at /uploads');
>>>>>>> Stashed changes
});