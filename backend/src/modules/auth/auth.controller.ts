import { Request, Response } from 'express';
import User from './User.model'; // Updated Relative Import
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ============================================
// REGISTER
// ============================================
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role, shopName, shopAddress } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData: any = {
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'customer',
            isVerified: false,
            isActive: true,
            approvalStatus: 'approved'
        };

        if (role === 'vendor') {
            if (!shopName || !shopAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Shop Name and Address required for vendors'
                });
            }

            userData.approvalStatus = 'pending';
            userData.shopName = shopName;
            userData.shopAddress = shopAddress;
            
            const files = req.files as any;
            if (files) {
                if (files.cnicFront) userData.cnicFront = files.cnicFront[0].path;
                if (files.cnicBack) userData.cnicBack = files.cnicBack[0].path;
            }
        }

        const user = await User.create(userData);

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: role === 'vendor' 
                ? 'Registration successful! Your account is pending admin approval.' 
                : 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                approvalStatus: user.approvalStatus
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

// ============================================
// LOGIN
// ============================================
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ VENDOR APPROVAL CHECK
        if (user.role === 'vendor' && user.approvalStatus !== 'approved') {
            return res.status(403).json({
                success: false,
                message: user.approvalStatus === 'pending' 
                    ? '⏳ Your account is pending admin approval.' 
                    : '❌ Your account has been rejected.'
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                approvalStatus: user.approvalStatus
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};