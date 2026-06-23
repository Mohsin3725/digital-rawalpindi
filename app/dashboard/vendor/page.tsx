'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './vendor.module.css';

// ============================================
// TYPES
// ============================================
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface Order {
    id: string;
    customer: string;
    amount: string;
    status: string;
    date: string;
}

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
    status: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VendorDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Subscription State
    const [subscription, setSubscription] = useState({
        plan: 'trial',
        daysLeft: 30
    });
    
    // Orders State
    const [orders, setOrders] = useState<Order[]>([
        { id: '#ORD-001', customer: 'Ali Khan', amount: 'PKR 2,500', status: 'Pending', date: '2024-01-15' },
        { id: '#ORD-002', customer: 'Sara Ahmed', amount: 'PKR 1,800', status: 'Processing', date: '2024-01-14' },
        { id: '#ORD-003', customer: 'Usman Malik', amount: 'PKR 3,200', status: 'Ready for Pickup', date: '2024-01-13' },
        { id: '#ORD-004', customer: 'Fatima Ali', amount: 'PKR 5,000', status: 'Delivered', date: '2024-01-12' },
    ]);
    
    // Employees State
    const [employees, setEmployees] = useState<Employee[]>([
        { id: '1', name: 'Ahmed Hussain', email: 'ahmed@example.com', role: 'Inventory Manager' },
        { id: '2', name: 'Sadia Khan', email: 'sadia@example.com', role: 'Order Fulfillment' },
    ]);
    
    // Products State
    const [products] = useState<Product[]>([
        { id: '1', name: 'Wireless Headphones', price: 'PKR 2,500', stock: 45, status: 'Active' },
        { id: '2', name: 'Smart Watch', price: 'PKR 8,000', stock: 12, status: 'Active' },
        { id: '3', name: 'Phone Case', price: 'PKR 500', stock: 0, status: 'Out of Stock' },
    ]);
    
    // Store Hours State
    const [storeHours, setStoreHours] = useState({
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { open: '', close: '' },
    });
    
    // Modal States
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    // ============================================
    // USE EFFECT
    // ============================================
    useEffect(() => {
        let isMounted = true;

        queueMicrotask(() => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (!token) {
                router.push('/auth/login');
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const parsedUser = JSON.parse(userData || '{}') as User;
                if (parsedUser.role !== 'vendor') {
                    router.push('/auth/login');
                    return;
                }
                if (isMounted) setUser(parsedUser);
            } catch {
                router.push('/auth/login');
            } finally {
                if (isMounted) setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [router]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSubscribe = (plan: string) => {
        if (plan === 'monthly') {
            setSubscription({ plan: 'monthly', daysLeft: 30 });
        } else if (plan === 'yearly') {
            setSubscription({ plan: 'yearly', daysLeft: 365 });
        } else if (plan === 'trial') {
            setSubscription({ plan: 'trial', daysLeft: 30 });
        }
        alert(`✅ Subscribed to ${plan} plan successfully!`);
    };

    const handleOrderStatusChange = (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`✅ Order ${orderId} status updated to: ${newStatus}`);
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Product added successfully!');
        setShowAddProduct(false);
    };

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Employee added successfully!');
        setShowAddEmployee(false);
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Withdrawal request submitted!');
        setShowWithdraw(false);
    };

    const handleStoreHoursChange = (day: string, type: 'open' | 'close', value: string) => {
        setStoreHours(prev => ({
            ...prev,
            [day]: { ...prev[day as keyof typeof prev], [type]: value }
        }));
    };

    const handleDeleteEmployee = (employeeId: string) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
            alert('✅ Employee removed successfully!');
        }
    };

    const handleDeleteProduct = (_productId: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            alert('✅ Product deleted successfully!');
        }
    };

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    const renderSubscription = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📋 Subscription Plan</h2>
            <div className={styles.subscriptionCard}>
                {/* Free Trial */}
                <div className={`${styles.planCard} ${subscription.plan === 'trial' ? styles.planCardActive : ''}`}>
                    <div className={styles.planBadge}>Current Plan</div>
                    <h3 className={styles.planName}>Free Trial</h3>
                    <p className={styles.planPrice}>PKR 0</p>
                    <ul className={styles.planFeatures}>
                        <li>✓ 30 Days Free</li>
                        <li>✓ 50 Products</li>
                        <li>✓ Basic Support</li>
                    </ul>
                    <button 
                        className={styles.secondaryBtn}
                        onClick={() => handleSubscribe('trial')}
                        disabled={subscription.plan === 'trial'}
                    >
                        {subscription.plan === 'trial' ? '✅ Active' : 'Start Trial'}
                    </button>
                </div>

                {/* Monthly */}
                <div className={`${styles.planCard} ${subscription.plan === 'monthly' ? styles.planCardActive : ''}`}>
                    <h3 className={styles.planName}>Monthly</h3>
                    <p className={styles.planPrice}>PKR 1,000 <span>/month</span></p>
                    <ul className={styles.planFeatures}>
                        <li>✓ Unlimited Products</li>
                        <li>✓ Priority Support</li>
                        <li>✓ Advanced Analytics</li>
                    </ul>
                    <button 
                        className={subscription.plan === 'monthly' ? styles.successBtn : styles.primaryBtn}
                        onClick={() => handleSubscribe('monthly')}
                        disabled={subscription.plan === 'monthly'}
                    >
                        {subscription.plan === 'monthly' ? '✅ Active' : 'Subscribe'}
                    </button>
                </div>

                {/* Yearly */}
                <div className={`${styles.planCard} ${subscription.plan === 'yearly' ? styles.planCardActive : ''}`}>
                    <h3 className={styles.planName}>Yearly</h3>
                    <p className={styles.planPrice}>PKR 10,000 <span>/year</span></p>
                    <ul className={styles.planFeatures}>
                        <li>✓ Everything in Monthly</li>
                        <li>✓ 2 Months Free</li>
                        <li>✓ VIP Support</li>
                    </ul>
                    <button 
                        className={subscription.plan === 'yearly' ? styles.successBtn : styles.primaryBtn}
                        onClick={() => handleSubscribe('yearly')}
                        disabled={subscription.plan === 'yearly'}
                    >
                        {subscription.plan === 'yearly' ? '✅ Active' : 'Subscribe'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📦 Orders</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.amount}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${
                                        order.status === 'Delivered' ? styles.statusDelivered :
                                        order.status === 'Ready for Pickup' ? styles.statusReady :
                                        order.status === 'Processing' ? styles.statusProcessing :
                                        styles.statusPending
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className={styles.formSelect}
                                        value={order.status}
                                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                        style={{ width: '140px', padding: '4px 8px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Ready for Pickup">Ready for Pickup</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEmployees = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>👥 Employees</h2>
            <button className={styles.primaryBtn} onClick={() => setShowAddEmployee(true)}>
                + Add Employee
            </button>
            <div style={{ marginTop: '20px' }}>
                {employees.map((employee) => (
                    <div key={employee.id} className={styles.employeeItem}>
                        <div className={styles.employeeInfo}>
                            <span className={styles.employeeName}>{employee.name}</span>
                            <span className={styles.employeeRole}>{employee.role} • {employee.email}</span>
                        </div>
                        <div className={styles.employeeActions}>
                            <button className={styles.dangerBtn} onClick={() => handleDeleteEmployee(employee.id)}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStoreHours = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🕐 Store Hours</h2>
            <div className={styles.hoursGrid}>
                {Object.entries(storeHours).map(([day, hours]) => (
                    <div key={day} className={styles.hoursRow}>
                        <span className={styles.hoursDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <input 
                            type="time" 
                            className={styles.hoursInput}
                            value={hours.open}
                            onChange={(e) => handleStoreHoursChange(day, 'open', e.target.value)}
                        />
                        <span>to</span>
                        <input 
                            type="time" 
                            className={styles.hoursInput}
                            value={hours.close}
                            onChange={(e) => handleStoreHoursChange(day, 'close', e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <button className={styles.successBtn} style={{ marginTop: '15px' }} onClick={() => alert('✅ Store hours saved!')}>
                Save Hours
            </button>
        </div>
    );

    const renderProducts = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📦 Products</h2>
            <button className={styles.primaryBtn} onClick={() => setShowAddProduct(true)}>
                + Add New Product
            </button>
            <div className={styles.tableContainer} style={{ marginTop: '20px' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${
                                        product.status === 'Active' ? styles.statusDelivered : styles.statusPending
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.dangerBtn} onClick={() => handleDeleteProduct(product.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderWithdraw = () => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>💰 Earnings & Withdrawals</h2>
            <div className={styles.statsGrid} style={{ marginBottom: '20px' }}>
                <div className={styles.statCard}>
                    <h3>Total Earnings</h3>
                    <p className={styles.statValue}>PKR 45,000</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Available Balance</h3>
                    <p className={styles.statValue}>PKR 35,000</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Pending Withdrawals</h3>
                    <p className={styles.statValue}>PKR 10,000</p>
                </div>
            </div>
            <button className={styles.primaryBtn} onClick={() => setShowWithdraw(true)}>
                Request Withdrawal
            </button>
        </div>
    );

    // ============================================
    // MODALS
    // ============================================
    const renderAddProductModal = () => {
        if (!showAddProduct) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddProduct(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Add New Product</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddProduct(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddProduct}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input type="text" className={styles.formInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Price</label>
                            <input type="text" className={styles.formInput} placeholder="PKR 1,000" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Stock Quantity</label>
                            <input type="number" className={styles.formInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea className={styles.formTextarea} rows={3}></textarea>
                        </div>
                        <button type="submit" className={styles.primaryBtn}>Add Product</button>
                    </form>
                </div>
            </div>
        );
    };

    const renderAddEmployeeModal = () => {
        if (!showAddEmployee) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowAddEmployee(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Add Employee</h3>
                        <button className={styles.modalClose} onClick={() => setShowAddEmployee(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddEmployee}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Full Name</label>
                            <input type="text" className={styles.formInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input type="email" className={styles.formInput} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Role</label>
                            <select className={styles.formSelect}>
                                <option>Inventory Manager</option>
                                <option>Order Fulfillment</option>
                                <option>Customer Support</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.primaryBtn}>Add Employee</button>
                    </form>
                </div>
            </div>
        );
    };

    const renderWithdrawModal = () => {
        if (!showWithdraw) return null;
        return (
            <div className={styles.modalOverlay} onClick={() => setShowWithdraw(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>Request Withdrawal</h3>
                        <button className={styles.modalClose} onClick={() => setShowWithdraw(false)}>×</button>
                    </div>
                    <form onSubmit={handleWithdraw}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Available Balance</label>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>PKR 35,000</p>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Amount to Withdraw</label>
                            <input type="number" className={styles.formInput} placeholder="Enter amount" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Bank Account</label>
                            <select className={styles.formSelect}>
                                <option>Bank Account - IBAN: PK123456789</option>
                                <option>EasyPaisa - 03001234567</option>
                                <option>JazzCash - 03001234567</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.successBtn}>Submit Request</button>
                    </form>
                </div>
            </div>
        );
    };

    // ============================================
    // MAIN RENDER
    // ============================================
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return <div className={styles.loading}>No user data...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h2 className={styles.logo}>🏪 Vendor</h2>
                <ul className={styles.menu}>
                    <li className={activeTab === 'dashboard' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('dashboard')}>
                        Dashboard
                    </li>
                    <li className={activeTab === 'products' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('products')}>
                        Products
                    </li>
                    <li className={activeTab === 'orders' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('orders')}>
                        Orders
                    </li>
                    <li className={activeTab === 'earnings' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('earnings')}>
                        Earnings
                    </li>
                    <li className={activeTab === 'employees' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('employees')}>
                        Employees
                    </li>
                    <li className={activeTab === 'hours' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('hours')}>
                        Store Hours
                    </li>
                    <li className={activeTab === 'subscription' ? styles.menuItemActive : styles.menuItem} onClick={() => handleTabChange('subscription')}>
                        Subscription
                    </li>
                    <li className={styles.menuItemLogout} onClick={handleLogout}>Logout</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                <div className={styles.header}>
                    <h1>Vendor Dashboard</h1>
                    <p>Welcome back, {user.name}!</p>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <h3>Total Products</h3>
                                <p className={styles.statValue}>45</p>
                                <span className={styles.statChange}>+5 this month</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Total Orders</h3>
                                <p className={styles.statValue}>32</p>
                                <span className={styles.statChange}>+8 today</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Earnings</h3>
                                <p className={styles.statValue}>PKR 45,000</p>
                                <span className={styles.statChange}>↑ 15%</span>
                            </div>
                            <div className={styles.statCard}>
                                <h3>Pending Orders</h3>
                                <p className={styles.statValue}>5</p>
                                <span className={styles.statChange}>⏳ Awaiting action</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.primaryBtn} onClick={() => handleTabChange('products')}>
                                Manage Products
                            </button>
                            <button className={styles.secondaryBtn} onClick={() => handleTabChange('orders')}>
                                View Orders
                            </button>
                            <button className={styles.successBtn} onClick={() => handleTabChange('earnings')}>
                                Withdraw Earnings
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'earnings' && renderWithdraw()}
                {activeTab === 'employees' && renderEmployees()}
                {activeTab === 'hours' && renderStoreHours()}
                {activeTab === 'subscription' && renderSubscription()}
            </div>

            {renderAddProductModal()}
            {renderAddEmployeeModal()}
            {renderWithdrawModal()}
        </div>
    );
}
