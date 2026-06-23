'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import styles from './register.module.css';

interface Message {
    type: 'success' | 'error';
    text: string;
}

interface ErrorResponse {
    message: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('customer');
    
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const [shopName, setShopName] = useState<string>('');
    const [shopAddress, setShopAddress] = useState<string>('');
    const [cnicFront, setCnicFront] = useState<File | null>(null);
    const [cnicBack, setCnicBack] = useState<File | null>(null);
    const [cnicFrontPreview, setCnicFrontPreview] = useState<string>('');
    const [cnicBackPreview, setCnicBackPreview] = useState<string>('');

    const roles = [
        { id: 'vendor', label: '🏪 Vendor' },
        { id: 'customer', label: '🛍️ Customer' },
        { id: 'rider', label: '🛵 Rider' }
    ];

    const handleCnicFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCnicFront(file);
            setCnicFrontPreview(URL.createObjectURL(file));
        }
    };

    const handleCnicBackChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCnicBack(file);
            setCnicBackPreview(URL.createObjectURL(file));
        }
    };

    const removeCnicFront = () => {
        setCnicFront(null);
        setCnicFrontPreview('');
    };

    const removeCnicBack = () => {
        setCnicBack(null);
        setCnicBackPreview('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('role', selectedRole);

            if (selectedRole === 'vendor') {
                formData.append('shopName', shopName);
                formData.append('shopAddress', shopAddress);
                if (cnicFront) formData.append('cnicFront', cnicFront);
                if (cnicBack) formData.append('cnicBack', cnicBack);
            }

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            // ✅ Show approval message for vendors
            if (selectedRole === 'vendor') {
                setMessage({ 
                    type: 'success', 
                    text: '✅ Registration successful! Your account is pending admin approval. You will be notified once approved.' 
                });
            } else {
                setMessage({ 
                    type: 'success', 
                    text: '✅ Registration successful! Redirecting to login...' 
                });
            }
            
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            setMessage({ 
                type: 'error', 
                text: axiosError.response?.data?.message || '❌ Registration failed' 
            });
        } finally {
            setLoading(false);
        }
    };

    const isVendor = selectedRole === 'vendor';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Link href="/" className={styles.backLink}>← Back</Link>
                <h2 className={styles.title}>Create Account</h2>
                <p className={styles.subtitle}>Join DigitalRawalpindi</p>

                {message && (
                    <div className={message.type === 'error' ? styles.messageError : styles.messageSuccess}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.roleSection}>
                        <label className={styles.roleLabel}>I want to register as:</label>
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
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Phone Number</label>
                        <input
                            type="text"
                            placeholder="e.g., 03001234567"
                            value={phone}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Password</label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    {isVendor && (
                        <div className={styles.vendorSection}>
                            <h3 className={styles.sectionTitle}>🏪 Shop Information</h3>
                            
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Shop Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your shop name"
                                    value={shopName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setShopName(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Shop Address</label>
                                <textarea
                                    placeholder="Enter your shop address (Rawalpindi)"
                                    value={shopAddress}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setShopAddress(e.target.value)}
                                    required
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.sectionTitle}>📄 CNIC Upload</div>
                            <p className={styles.uploadHint}>Please upload clear images of your CNIC (Front & Back)</p>

                            <div className={styles.uploadGroup}>
                                <div className={styles.uploadBox}>
                                    <label className={styles.uploadLabel}>
                                        <span className={styles.uploadIcon}>📷</span>
                                        CNIC Front
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCnicFrontChange}
                                            required
                                            className={styles.uploadInput}
                                        />
                                    </label>
                                    {cnicFrontPreview && (
                                        <div className={styles.previewContainer}>
                                            <picture>
                                                <source srcSet={cnicFrontPreview} />
                                                <img 
                                                    src={cnicFrontPreview} 
                                                    alt="CNIC Front" 
                                                    className={styles.previewImage} 
                                                />
                                            </picture>
                                            <button 
                                                type="button" 
                                                onClick={removeCnicFront}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.uploadBox}>
                                    <label className={styles.uploadLabel}>
                                        <span className={styles.uploadIcon}>📷</span>
                                        CNIC Back
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCnicBackChange}
                                            required
                                            className={styles.uploadInput}
                                        />
                                    </label>
                                    {cnicBackPreview && (
                                        <div className={styles.previewContainer}>
                                            <picture>
                                                <source srcSet={cnicBackPreview} />
                                                <img 
                                                    src={cnicBackPreview} 
                                                    alt="CNIC Back" 
                                                    className={styles.previewImage} 
                                                />
                                            </picture>
                                            <button 
                                                type="button" 
                                                onClick={removeCnicBack}
                                                className={styles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? '⏳ Creating account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link href="/auth/login" className={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
}