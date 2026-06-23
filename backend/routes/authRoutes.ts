import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { 
    register, 
    login, 
    getVendors, 
    updateVendorStatus 
} from '../controllers/authController';
import { protect, isAdmin } from '../middleware/auth';

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

// ============================================
// ADMIN ROUTES
// ============================================
router.get('/vendors', protect, isAdmin, getVendors);
router.put('/vendor/:id/status', protect, isAdmin, updateVendorStatus);

export default router;