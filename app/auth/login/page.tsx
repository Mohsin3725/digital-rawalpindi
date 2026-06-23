'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import styles from './login.module.css';

interface ErrorResponse {
    message: string;
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: 'admin', label: '🛒 Admin' },
        { id: 'vendor', label: '🏪 Vendor' },
        { id: 'customer', label: '🛍️ Customer' },
        { id: 'rider', label: '🛵 Rider' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                { email, password }
            );
            const user = response.data.user;
            if (user.role !== selectedRole) {
                setMessage(`❌ You are registered as ${user.role}. Please select the correct role.`);
                setLoading(false);
                return;
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(user));
            setMessage('✅ Login successful! Redirecting...');
            setTimeout(() => router.push(`/dashboard/${user.role}`), 1500);
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            setMessage(axiosError.response?.data?.message || '❌ Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Link href="/" className={styles.backLink}>← Back</Link>
                <h2 className={styles.title}>Login</h2>
                <p className={styles.subtitle}>Login as <strong>{selectedRole || 'User'}</strong></p>

                {message && (
                    <div className={message.includes('❌') ? styles.messageError : styles.messageSuccess}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <label className={styles.roleLabel}>Login as:</label>
                    <div className={styles.roleGroup}>
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`${styles.roleBtn} ${selectedRole === role.id ? styles.roleBtnActive : ''}`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? '⏳ Logging in...' : '🚀 Login'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Don&apos;t have an account? <Link href="/auth/register" className={styles.link}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
