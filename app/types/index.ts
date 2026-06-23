export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'vendor' | 'customer' | 'rider';
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
}

export interface Delivery {
    id: string;
    customer: string;
    address: string;
    amount: number;
    status: string;
}