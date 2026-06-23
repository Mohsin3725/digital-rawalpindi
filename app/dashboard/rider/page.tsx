'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LayoutWrapper from '../../LayoutWrapper';
import styles from './rider.module.css';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface Delivery {
    id: string;
    customer: string;
    address: string;
    amount: number;
    status: string;
}

export default function RiderDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const deliveries: Delivery[] = [
        { id: '#DEL-001', customer: 'Ali Khan', address: 'Saddar, Rawalpindi', amount: 500, status: 'Pending' },
        { id: '#DEL-002', customer: 'Sara Ahmed', address: 'Bahria Town, Rawalpindi', amount: 300, status: 'Completed' },
    ];

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
                if (parsedUser.role !== 'rider') {
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
        <LayoutWrapper role="Rider" onLogout={handleLogout}>
            <div className={styles.header}>
                <h1>Rider Dashboard</h1>
                <p>Welcome back, {user.name}!</p>
            </div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Today&apos;s Deliveries</h3>
                    <p className={styles.statValue}>8</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Earnings Today</h3>
                    <p className={styles.statValue}>PKR 1,200</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Weekly Earnings</h3>
                    <p className={styles.statValue}>PKR 8,500</p>
                </div>
            </div>
            <div className={styles.card}>
                <h3>Assigned Deliveries</h3>
                {deliveries.map((delivery) => (
                    <div key={delivery.id} className={styles.deliveryItem}>
                        <div>
                            <strong>{delivery.id}</strong> - {delivery.customer}
                            <div className={styles.address}>{delivery.address}</div>
                        </div>
                        <div>
                            <span className={styles.amount}>PKR {delivery.amount}</span>
                            <span className={delivery.status === 'Completed' ? styles.statusCompleted : styles.statusPending}>
                                {delivery.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </LayoutWrapper>
    );
}
