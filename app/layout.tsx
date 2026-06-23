import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'DigitalRawalpindi - Multi-Vendor Marketplace',
    description: 'Shop from local businesses in Rawalpindi',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}