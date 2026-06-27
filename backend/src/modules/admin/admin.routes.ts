import { Router } from 'express';
import { getVendors, updateVendorStatus } from './admin.controller.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';

const router = Router();

// Dono routes par pehle token check hoga phir check hoga ke user role 'admin' hai ya nahi
router.get('/vendors', protect, restrictTo('admin'), getVendors);
router.put('/vendor/:id/status', protect, restrictTo('admin'), updateVendorStatus);

export default router;