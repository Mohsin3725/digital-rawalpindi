'use client';

import React from 'react';
import styles from './LayoutWrapper.module.css';

interface LayoutWrapperProps {
    children: React.ReactNode;
    role: string;
    onLogout: () => void;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, role, onLogout }) => {
    const menuItems: Record<string, string[]> = {
        Admin: ['Dashboard', 'Vendors', 'Customers', 'Orders', 'Products', 'Reports', 'Settings'],
        Vendor: ['Dashboard', 'Products', 'Add Product', 'Orders', 'Earnings', 'My Store', 'Settings'],
        Customer: ['Dashboard', 'My Orders', 'Wishlist', 'Appointments', 'My Profile', 'Settings'],
        Rider: ['Dashboard', 'My Deliveries', 'Map', 'Earnings', 'My Profile']
    };

    const items = menuItems[role] || menuItems.Customer;

    const getIcon = () => {
        if (role === 'Admin') return '🛒';
        if (role === 'Vendor') return '🏪';
        if (role === 'Customer') return '🛍️';
        if (role === 'Rider') return '🛵';
        return '👤';
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.logo}>
                    {getIcon()} {role}
                </h2>
                <ul className={styles.menu}>
                    {items.map((item) => (
                        <li 
                            key={item} 
                            className={item === 'Dashboard' ? styles.menuItemActive : styles.menuItem}
                        >
                            {item}
                        </li>
                    ))}
                    <li className={styles.menuItemLogout} onClick={onLogout}>
                        Logout
                    </li>
                </ul>
            </div>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    );
};

export default LayoutWrapper;