'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LayoutWrapper from '../../LayoutWrapper';
import styles from './customer.module.css';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
}

export default function CustomerDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [orders] = useState<Order[]>([
        { id: '#ORD-001', date: '2024-01-15', total: 2500, status: 'Delivered' },
        { id: '#ORD-002', date: '2024-01-20', total: 1800, status: 'Processing' },
    ]);

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
                const parsedUser: User = JSON.parse(userData || '{}');
                if (parsedUser.role !== 'customer') {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <LayoutWrapper role="Customer" onLogout={handleLogout}>
            <div className={styles.header}>
                <h1>My Account</h1>
                <p>Welcome back, {user.name}!</p>
            </div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Orders</h3>
                    <p className={styles.statValue}>{orders.length}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Wishlist</h3>
                    <p className={styles.statValue}>8</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Appointments</h3>
                    <p className={styles.statValue}>3</p>
                </div>
            </div>
            <div className={styles.card}>
                <h3>Recent Orders</h3>
                {orders.map((order) => (
                    <div key={order.id} className={styles.orderItem}>
                        <span>{order.id}</span>
                        <span>PKR {order.total}</span>
                        <span className={order.status === 'Delivered' ? styles.statusDelivered : styles.statusPending}>
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </LayoutWrapper>
    );
}
