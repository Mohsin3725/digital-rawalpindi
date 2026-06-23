import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));
app.use(express.json());

// ============================================
// REGISTER ROUTES
// ============================================
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'DigitalRawalpindi API is running!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Register: POST /api/auth/register`);
    console.log(`🔑 Login: POST /api/auth/login`);
    console.log(`📋 Vendors: GET /api/auth/vendors (Admin only)`);
    console.log(`📝 Update Vendor: PUT /api/auth/vendor/:id/status (Admin only)`);
});