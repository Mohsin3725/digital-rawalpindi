'use client';

import { useRouter } from 'next/navigation';
import styles from './home.module.css';

const roles = [
    { id: 'admin', label: 'Admin', icon: '🛒', color: '#dc3545', description: 'Manage the platform' },
    { id: 'vendor', label: 'Vendor', icon: '🏪', color: '#28a745', description: 'Sell your products' },
    { id: 'customer', label: 'Customer', icon: '🛍️', color: '#4a6cf7', description: 'Shop & buy' },
    { id: 'rider', label: 'Rider', icon: '🛵', color: '#ffc107', description: 'Deliver orders' }
];

export default function HomePage() {
    const router = useRouter();

    const handleRoleClick = (roleId: string) => {
        router.push(`/auth/login?role=${roleId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <h1 className={styles.title}>
                        🏪 Digital<span className={styles.titleHighlight}>Rawalpindi</span>
                    </h1>
                    <p className={styles.subtitle}>Rawalpindi&apos;s Premier Multi-Vendor Marketplace</p>
                    <p className={styles.description}>Choose your role to get started</p>
                </div>

                <div className={styles.cardContainer}>
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className={styles.card}
                            style={{ borderTop: `5px solid ${role.color}` }}
                            onClick={() => handleRoleClick(role.id)}
                        >
                            <div className={styles.cardIcon}>{role.icon}</div>
                            <h3 className={styles.cardTitle}>{role.label}</h3>
                            <p className={styles.cardDesc}>{role.description}</p>
                            <span className={styles.cardArrow} style={{ color: role.color }}>→</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
