import { Router } from 'express';
import multer from 'multer';
import { register, login, forgotPassword, resetPassword } from './auth.controller.js'; // Updated Imports (Added resetPassword)

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ============================================
// PUBLIC ROUTES
// ============================================

// Test route
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '✅ Auth routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Register
router.post('/register', upload.fields([
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 }
]), register);

// Login
router.post('/login', login);

// Forgot Password (OTP Generation & Email Sending)
router.post('/forgot-password', forgotPassword);

// Reset Password (OTP Verification & Database Update)
router.post('/reset-password', resetPassword);

export default router;