import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'admin' | 'vendor' | 'customer' | 'rider';
    isVerified: boolean;
    isActive: boolean;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    shopName?: string;
    shopAddress?: string;
    cnicFront?: string;
    cnicBack?: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'vendor', 'customer', 'rider'],
        default: 'customer'
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    shopName: { type: String },
    shopAddress: { type: String },
    cnicFront: { type: String },
    cnicBack: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);