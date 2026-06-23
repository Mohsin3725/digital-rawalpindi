'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './admin.module.css';

// ============================================
// TYPES
// ============================================
interface Vendor {
    id: string;
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    cnicFront?: string;
    cnicBack?: string;
    shopAddress?: string;
}

interface AdminEmployee {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface Coupon {
    id: string;
    code: string;
    discount: string;
    type: 'percentage' | 'fixed';
    expiry: string;
    usage: number;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    audience: 'all' | 'vendors' | 'customers' | 'riders';
}

interface CommissionType {
    id: string;
    name: string;
    value: string;
    type: 'percentage' | 'fixed';
    description: string;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    orders: number;
    joined: string;
}

interface Rider {
    id: string;
    name: string;
    email: string;
    deliveries: number;
    status: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [showVendorDetail, setShowVendorDetail] = useState(false);

    // ============================================
    // VENDORS STATE - Fetch from API
    // ============================================
    const [vendors, setVendors] = useState<Vendor[]>([]);

    // ============================================
    // ADMIN EMPLOYEES STATE
    // ============================================
    const [adminEmployees] = useState<AdminEmployee[]>([
        { id: '1', name: 'Ahmed Hussain', email: 'ahmed@platform.com', role: 'Vendor Manager' },
        { id: '2', name: 'Sadia Khan', email: 'sadia@platform.com', role: 'Product Moderator' },
        { id: '3', name: 'Raza Ali', email: 'raza@platform.com', role: 'Order Manager' },
        { id: '4', name: 'Nida Shah', email: 'nida@platform.com', role: 'Finance Manager' },
        { id: '5', name: 'Omar Farooq', email: 'omar@platform.com', role: 'Support Manager' },
    ]);

    // ============================================
    // COMMISSION TYPES STATE
    // ============================================
    const [commissionTypes] = useState<CommissionType[]>([
        { id: '1', name: 'Percentage Commission', value: '1%', type: 'percentage', description: '1% of every order' },
        { id: '2', name: 'Fixed Commission', value: 'PKR 10', type: 'fixed', description: 'PKR 10 per order' },
        { id: '3', name: 'Per Product Commission', value: '2%', type: 'percentage', description: '2% per product category' },
        { id: '4', name: 'Per Vendor Commission', value: '0.5%', type: 'percentage', description: '0.5% per vendor' },
        { id: '5', name: 'Tiered Commission', value: '1% → 0.5%', type: 'percentage', description: 'Based on sales volume' },
    ]);

    // ============================================
    // COUPONS STATE
    // ============================================
    const [coupons] = useState<Coupon[]>([
        { id: '1', code: 'WELCOME10', discount: '10%', type: 'percentage', expiry: '2024-12-31', usage: 45 },
        { id: '2', code: 'FLAT50', discount: 'PKR 50', type: 'fixed', expiry: '2024-06-30', usage: 23 },
        { id: '3', code: 'SUMMER20', discount: '20%', type: 'percentage', expiry: '2024-08-31', usage: 12 },
    ]);

    // ============================================
    // ANNOUNCEMENTS STATE
    // ============================================
    const [announcements] = useState<Announcement[]>([
        { id: '1', title: '📢 Welcome to DigitalRawalpindi!', content: 'We are excited to launch our platform. Start selling today!', date: '2024-01-01', audience: 'all' },
        { id: '2', title: '🏪 New Vendor Onboarding', content: 'We are onboarding new vendors this week. Check your dashboard.', date: '2024-01-10', audience: 'vendors' },
        { id: '3', title: '🛍️ Customer Appreciation', content: 'Use code THANKYOU for 10% off on first order.', date: '2024-01-15', audience: 'customers' },
    ]);

    // ============================================
    // CUSTOMERS & RIDERS STATE
    // ============================================
    const [customers] = useState<Customer[]>([
        { id: '1', name: 'Hamza Ali', email: 'hamza@email.com', orders: 12, joined: '2024-01-01' },
        { id: '2', name: 'Ayesha Khan', email: 'ayesha@email.com', orders: 8, joined: '2024-01-05' },
        { id: '3', name: 'Bilal Ahmed', email: 'bilal@email.com', orders: 5, joined: '2024-01-10' },
    ]);

    const [riders] = useState<Rider[]>([
        { id: '1', name: 'Zain Malik', email: 'zain@rider.com', deliveries: 45, status: 'Active' },
        { id: '2', name: 'Hira Shah', email: 'hira@rider.com', deliveries: 32, status: 'Active' },
        { id: '3', name: 'Faisal Ali', email: 'faisal@rider.com', deliveries: 18, status: 'Inactive' },
    ]);

    // ============================================
    // MODAL STATES
    // ============================================
    const [showAddCoupon, setShowAddCoupon] = useState(false);
    const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [showAddCommission, setShowAddCommission] = useState(false);

    // ============================================
    // API BASE URL
    // ============================================
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // ============================================
    // FETCH VENDORS - UPDATED
    // ============================================
    const fetchVendors = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            console.log('📋 Fetching vendors from API...');
            const response = await axios.get(`${API_URL}/api/auth/vendors`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                console.log(`✅ Found ${response.data.vendors.length} vendors`);
                setVendors(response.data.vendors);
            } else {
                console.error('❌ Failed to fetch vendors:', response.data.message);
            }
        } catch (error: any) {
            console.error('❌ Error fetching vendors:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                router.push('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    }, [API_URL, router]);

    // ============================================
    // UPDATE VENDOR STATUS - UPDATED
    // ============================================
    const updateVendorStatus = useCallback(async (vendorId: string, status: 'approved' | 'rejected') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            console.log(`📝 Updating vendor ${vendorId} to ${status}...`);
            const response = await axios.put(
                `${API_URL}/api/auth/vendor/${vendorId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert(`✅ Vendor ${status} successfully!`);
                setShowVendorDetail(false);
                // Refresh vendors list
                await fetchVendors();
            } else {
                alert(`❌ Failed: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('❌ Error updating vendor status:', error.response?.data || error.message);
            alert(`❌ Failed: ${error.response?.data?.message || error.message}`);
        }
    }, [API_URL, router, fetchVendors]);

    // ============================================
    // USE EFFECT - Check Auth and Load Data
    // ============================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            router.push('/auth/login');
            setLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(userData || '{}');
            if (parsedUser.role !== 'admin') {
                router.push('/auth/login');
                setLoading(false);
                return;
            }
            // Fetch vendors from API
            fetchVendors();
        } catch {
            router.push('/auth/login');
        }
    }, [router, fetchVendors]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    }, [router]);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    const handleViewVendorDetail = useCallback((vendor: Vendor) => {
        setSelectedVendor(vendor);
        setShowVendorDetail(true);
    }, []);

    const handleAddCoupon = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Coupon created successfully!');
        setShowAddCoupon(false);
    }, []);

    const handleAddAnnouncement = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Announcement sent successfully!');
        setShowAddAnnouncement(false);
    }, []);

    const handleAddEmployee = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Admin employee added successfully!');
        setShowAddEmployee(false);
    }, []);

    const handleDeleteEmployee = useCallback((employeeId: string) => {
        if (confirm('Are you sure you want to remove this employee?')) {
            alert('✅ Employee removed successfully!');
        }
    }, []);

    const handleAddCommission = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Commission type added successfully!');
        setShowAddCommission(false);
    }, []);

    const handleDeleteCoupon = useCallback((couponId: string) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            alert('✅ Coupon deleted successfully!');
        }
    }, []);

    // ============================================
    // MODAL RENDER FUNCTIONS
    // ============================================
    const renderAddCouponModal = useCallback(() => {
        if (!showAddCoupon) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddCoupon(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Create Coupon</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddCoupon(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddCoupon}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Coupon Code</label>
                            <input type="text" className={styles.formInput} placeholder="e.g., WELCOME10" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Discount Type</label>
                            <select className={styles.formSelect} title="Select discount type">
                                <option>Percentage</option>
                                <option>Fixed</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Discount Amount</label>
                            <input type="text" className={styles.formInput} placeholder="e.g., 10% or PKR 50" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Expiry Date</label>
                            <input type="date" className={styles.formInput} required />
                        </div>
                        <button type="submit" className={styles.primaryBtn}>Create Coupon</button>
                    </form>
                </div>
            </div>
        );
    }, [showAddCoupon, handleAddCoupon]);

    const renderAddAnnouncementModal = useCallback(() => {
        if (!showAddAnnouncement) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddAnnouncement(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Send Announcement</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddAnnouncement(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddAnnouncement}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Announcement Title</label>
                            <input type="text" className={styles.formInput} placeholder="Enter title" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Content</label>
                            <textarea className={styles.formTextarea} rows={4} placeholder="Write your announcement..." required></textarea>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Audience</label>
                            <select className={styles.formSelect} title="Select audience">
                                <option>All Users</option>
                                <option>Vendors Only</option>
                                <option>Customers Only</option>
                                <option>Riders Only</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.successBtn}>Send Announcement</button>
                    </form>
                </div>
            </div>
        );
    }, [showAddAnnouncement, handleAddAnnouncement]);

    const renderAddEmployeeModal = useCallback(() => {
        if (!showAddEmployee) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddEmployee(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Add Admin Employee</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddEmployee(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddEmployee}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Full Name</label>
                            <input type="text" className={styles.formInput} placeholder="Enter full name" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input type="email" className={styles.formInput} placeholder="Enter email" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Role</label>
                            <select className={styles.formSelect} title="Select role">
                                <option>Vendor Manager</option>
                                <option>Product Moderator</option>
                                <option>Order Manager</option>
                                <option>Finance Manager</option>
                                <option>Support Manager</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.primaryBtn}>Add Employee</button>
                    </form>
                </div>
            </div>
        );
    }, [showAddEmployee, handleAddEmployee]);

    const renderAddCommissionModal = useCallback(() => {
        if (!showAddCommission) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddCommission(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Add Commission Type</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddCommission(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddCommission}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Commission Name</label>
                            <input type="text" className={styles.formInput} placeholder="e.g., Custom Commission" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Commission Type</label>
                            <select className={styles.formSelect} title="Select commission type">
                                <option>Percentage</option>
                                <option>Fixed</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Commission Value</label>
                            <input type="text" className={styles.formInput} placeholder="e.g., 2% or PKR 20" required />
                        </div>
                        <button type="submit" className={styles.primaryBtn}>Add Commission</button>
                    </form>
                </div>
            </div>
        );
    }, [showAddCommission, handleAddCommission]);

    const renderVendorDetailModal = useCallback(() => {
        if (!showVendorDetail || !selectedVendor) return null;

        const isPending = selectedVendor.status === 'pending';

        return (
            <div className={styles.modalOverlay} onClick={() => setShowVendorDetail(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>📋 Vendor Details</h3>
                        <button className={styles.modalClose} onClick={() => setShowVendorDetail(false)}>×</button>
                    </div>

                    <div className={styles.detailGrid}>
                        <div>
                            <label className={styles.detailLabel}>Shop Name</label>
                            <p className={styles.detailValue}>{selectedVendor.shopName}</p>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Owner</label>
                            <p className={styles.detailValue}>{selectedVendor.ownerName}</p>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Email</label>
                            <p className={styles.detailValue}>{selectedVendor.email}</p>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Phone</label>
                            <p className={styles.detailValue}>{selectedVendor.phone}</p>
                        </div>
                        <div className={styles.detailFull}>
                            <label className={styles.detailLabel}>Shop Address</label>
                            <p className={styles.detailValue}>{selectedVendor.shopAddress}</p>
                        </div>
                        <div className={styles.detailFull}>
                            <label className={styles.detailLabel}>Registered On</label>
                            <p className={styles.detailValue}>{selectedVendor.date}</p>
                        </div>
                    </div>

                    <div className={styles.cnicSection}>
                        <h4>📄 CNIC Documents</h4>
                        <div className={styles.cnicContainer}>
                            <div>
                                <label className={styles.detailLabel}>CNIC Front</label>
                                <div className={styles.cnicBox}>
                                    {selectedVendor.cnicFront ? (
                                        <img
                                            src={`${API_URL}/${selectedVendor.cnicFront}`}
                                            alt="CNIC Front"
                                            className={styles.cnicImage}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                            }}
                                        />
                                    ) : (
                                        <span className={styles.cnicEmpty}>No image</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className={styles.detailLabel}>CNIC Back</label>
                                <div className={styles.cnicBox}>
                                    {selectedVendor.cnicBack ? (
                                        <img
                                            src={`${API_URL}/${selectedVendor.cnicBack}`}
                                            alt="CNIC Back"
                                            className={styles.cnicImage}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                            }}
                                        />
                                    ) : (
                                        <span className={styles.cnicEmpty}>No image</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isPending && (
                        <div className={styles.modalActions}>
                            <button
                                className={styles.successBtn}
                                onClick={() => updateVendorStatus(selectedVendor.id, 'approved')}
                            >
                                ✅ Approve Vendor
                            </button>
                            <button
                                className={styles.dangerBtn}
                                onClick={() => updateVendorStatus(selectedVendor.id, 'rejected')}
                            >
                                ❌ Reject Vendor
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [showVendorDetail, selectedVendor, updateVendorStatus, API_URL]);

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    const renderVendors = useCallback(() => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🏪 Vendor Management</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Shop Name</th>
                            <th>Owner</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                                    No vendors registered yet.
                                </td>
                            </tr>
                        ) : (
                            vendors.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td>{vendor.shopName}</td>
                                    <td>{vendor.ownerName}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.date}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${vendor.status === 'approved' ? styles.statusApproved :
                                                vendor.status === 'rejected' ? styles.statusRejected :
                                                styles.statusPending
                                            }`}>
                                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles.primaryBtn}
                                            onClick={() => handleViewVendorDetail(vendor)}
                                        >
                                            👁️ View Details
                                        </button>
                                        {vendor.status === 'pending' && (
                                            <>
                                                <button
                                                    className={styles.successBtn}
                                                    onClick={() => updateVendorStatus(vendor.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className={styles.dangerBtn}
                                                    onClick={() => updateVendorStatus(vendor.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    ), [vendors, handleViewVendorDetail, updateVendorStatus]);

    const renderAdminEmployees = useCallback(() => (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>👥 Admin Employees</h2>
                <button className={styles.primaryBtn} onClick={() => setShowAddEmployee(true)}>
                    + Add Employee
                </button>
            </div>
            <div className={styles.employeeGrid}>
                {adminEmployees.map((employee) => (
                    <div key={employee.id} className={styles.employeeCard}>
                        <div className={styles.employeeIcon}>👤</div>
                        <div className={styles.employeeName}>{employee.name}</div>
                        <div className={styles.employeeRole}>{employee.role}</div>
                        <div className={styles.employeeEmail}>{employee.email}</div>
                        <button className={styles.dangerBtn} onClick={() => handleDeleteEmployee(employee.id)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ), [adminEmployees, handleDeleteEmployee]);

    const renderCommissionTypes = useCallback(() => (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>💰 Commission Types</h2>
                <button className={styles.primaryBtn} onClick={() => setShowAddCommission(true)}>
                    + Add Commission
                </button>
            </div>
            <div className={styles.commissionGrid}>
                {commissionTypes.map((commission) => (
                    <div key={commission.id} className={styles.commissionCard}>
                        <div>
                            <div className={styles.commissionName}>{commission.name}</div>
                            <div className={styles.commissionDesc}>{commission.description}</div>
                        </div>
                        <div className={styles.commissionValue}>{commission.value}</div>
                    </div>
                ))}
            </div>
        </div>
    ), [commissionTypes]);

    const renderCoupons = useCallback(() => (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🎫 Coupons</h2>
                <button className={styles.primaryBtn} onClick={() => setShowAddCoupon(true)}>
                    + Create Coupon
                </button>
            </div>
            <div className={styles.couponGrid}>
                {coupons.map((coupon) => (
                    <div key={coupon.id} className={styles.couponCard}>
                        <div className={styles.couponCode}>{coupon.code}</div>
                        <div className={styles.couponDiscount}>{coupon.discount} Off</div>
                        <div className={styles.couponExpiry}>Expires: {coupon.expiry}</div>
                        <div className={styles.couponExpiry}>Used: {coupon.usage} times</div>
                        <button className={styles.dangerBtn} onClick={() => handleDeleteCoupon(coupon.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ), [coupons, handleDeleteCoupon]);

    const renderAnnouncements = useCallback(() => (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>📢 Announcements</h2>
                <button className={styles.primaryBtn} onClick={() => setShowAddAnnouncement(true)}>
                    + Send Announcement
                </button>
            </div>
            {announcements.map((announcement) => (
                <div key={announcement.id} className={styles.announcementItem}>
                    <div className={styles.announcementTitle}>{announcement.title}</div>
                    <div className={styles.announcementContent}>{announcement.content}</div>
                    <div className={styles.announcementDate}>
                        {announcement.date} • Audience: {announcement.audience}
                    </div>
                </div>
            ))}
        </div>
    ), [announcements]);

    const renderCustomers = useCallback(() => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🛍️ Customers</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Orders</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.orders}</td>
                                <td>{customer.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ), [customers]);

    const renderRiders = useCallback(() => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🛵 Riders</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Deliveries</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((rider) => (
                            <tr key={rider.id}>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.deliveries}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${rider.status === 'Active' ? styles.statusActive : styles.statusInactive
                                        }`}>
                                        {rider.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ), [riders]);

    // ============================================
    // MAIN RENDER
    // ============================================
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h2 className={styles.logo}>🛒 Admin</h2>
                <ul className={styles.menu}>
                    <li className={activeTab === 'dashboard' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('dashboard')}>
                        Dashboard
                    </li>
                    <li className={activeTab === 'vendors' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('vendors')}>
                        Vendors
                    </li>
                    <li className={activeTab === 'customers' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('customers')}>
                        Customers
                    </li>
                    <li className={activeTab === 'riders' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('riders')}>
                        Riders
                    </li>
                    <li className={activeTab === 'employees' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('employees')}>
                        Admin Employees
                    </li>
                    <li className={activeTab === 'commission' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('commission')}>
                        Commission Types
                    </li>
                    <li className={activeTab === 'coupons' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('coupons')}>
                        Coupons
                    </li>
                    <li className={activeTab === 'announcements' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('announcements')}>
                        Announcements
                    </li>
                    <li className={styles.menuItemLogout} onClick={handleLogout}>Logout</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                <div className={styles.header}>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, Admin!</p>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <h3>Total Vendors</h3>
                                <p className={styles.statValue}>{vendors.length}</p>
                                <span className={styles.statChange}>+{vendors.filter(v => v.status === 'approved').length} approved</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Total Customers</h3>
                                <p className={styles.statValue}>{customers.length}</p>
                                <span className={styles.statChange}>+12 this week</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Total Riders</h3>
                                <p className={styles.statValue}>{riders.length}</p>
                                <span className={styles.statChange}>+3 this month</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Pending Vendors</h3>
                                <p className={styles.statValue}>{vendors.filter(v => v.status === 'pending').length}</p>
                                <span className={styles.statChange}>⏳ Awaiting approval</span>
                            </div>
                        </div>
                        {renderVendors()}
                        {renderAnnouncements()}
                    </>
                )}

                {activeTab === 'vendors' && renderVendors()}
                {activeTab === 'customers' && renderCustomers()}
                {activeTab === 'riders' && renderRiders()}
                {activeTab === 'employees' && renderAdminEmployees()}
                {activeTab === 'commission' && renderCommissionTypes()}
                {activeTab === 'coupons' && renderCoupons()}
                {activeTab === 'announcements' && renderAnnouncements()}
            </div>

            {/* Modals */}
            {renderAddCouponModal()}
            {renderAddAnnouncementModal()}
            {renderAddEmployeeModal()}
            {renderAddCommissionModal()}
            {renderVendorDetailModal()}
        </div>
    );
}