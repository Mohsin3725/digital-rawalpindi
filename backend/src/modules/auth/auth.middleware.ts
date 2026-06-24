import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TypeScript custom Request type support
export interface AuthenticatedRequest extends Request {
    userId?: string;
    userRole?: string;
}

// 1. Token Verification Middleware
export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// 2. Generic Role-Based Access Control (RBAC) Middleware
export const restrictTo = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${allowedRoles.join(' or ')} only.`
            });
        }
        next();
    };
};