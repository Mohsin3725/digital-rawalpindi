import { Request, Response } from 'express';
import User from '../auth/User.model.js'; // Auth module se model share ho raha hai

// ============================================
// GET ALL VENDORS (ADMIN ONLY)
// ============================================
export const getVendors = async (req: Request, res: Response) => {
    try {
        console.log('📋 Fetching vendors...');
        const vendors = await User.find({ role: 'vendor' })
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`📋 Found ${vendors.length} vendors`);

        const formattedVendors = vendors.map((vendor: any) => ({
            id: vendor._id,
            shopName: vendor.shopName || vendor.name + "'s Shop",
            ownerName: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            status: vendor.approvalStatus || 'pending',
            date: vendor.createdAt ? new Date(vendor.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            cnicFront: vendor.cnicFront || null,
            cnicBack: vendor.cnicBack || null,
            shopAddress: vendor.shopAddress || 'Not provided'
        }));

        res.json({ success: true, vendors: formattedVendors });
    } catch (error: any) {
        console.error('❌ Error fetching vendors:', error.message);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

// ============================================
// UPDATE VENDOR STATUS (ADMIN ONLY)
// ============================================
export const updateVendorStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`📝 Updating vendor ${id} to ${status}`);

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        const vendor = await User.findOneAndUpdate(
            { _id: id, role: 'vendor' },
            { approvalStatus: status },
            { new: true }
        ).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        console.log(`✅ Vendor ${vendor.name} ${status} successfully`);

        res.json({
            success: true,
            message: `Vendor ${status} successfully`,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                shopName: vendor.shopName,
                email: vendor.email,
                status: vendor.approvalStatus
            }
        });
    } catch (error: any) {
        console.error('❌ Error updating vendor status:', error.message);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};