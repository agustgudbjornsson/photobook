'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/actions';
import Link from 'next/link';
import {
    Package,
    Calendar,
    User,
    MapPin,
    CreditCard,
    ChevronRight,
    Search,
    Filter,
    Box,
    Truck
} from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getOrders();
            setOrders(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading orders...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Order Management</h1>
                        <p style={{ color: '#666', marginTop: '4px' }}>View and manage all customer print orders</p>
                    </div>
                    <Link href="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Dashboard &rarr;
                    </Link>
                </header>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Orders', value: orders.length, color: 'var(--primary)' },
                        { label: 'Revenue', value: `$${(orders.length * 49.99).toFixed(2)}`, color: '#10b981' },
                        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
                        { label: 'Shipped', value: '0', color: '#6366f1' },
                    ].map((stat, i) => (
                        <div key={i} style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
                            <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '8px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #222', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '0.9rem' }}
                        />
                    </div>
                    <button style={{ background: '#1a1a1a', border: '1px solid #333', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <Filter size={16} /> Filter
                    </button>
                </div>

                {/* Orders List */}
                <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222', background: '#161616' }}>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>ORDER ID</th>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>CUSTOMER</th>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>ALBUM</th>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>DETAILS</th>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>STATUS</th>
                                <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>AMOUNT</th>
                                <th style={{ padding: '1rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: '#444' }}>No orders found</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            <code style={{ color: 'var(--primary)' }}>#{order.id?.slice(0, 8) || 'N/A'}</code>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={14} color="#888" />
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>{order.customerName || 'Unknown Customer'}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            {order.album?.title || 'Deleted Album'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Box size={12} /> {order.paperStyle || 'Standard'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Truck size={12} /> {order.deliveryMethod || 'Standard'}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '20px',
                                                background: 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                                                {order.status || 'pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            ${(order.totalAmount || 0).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}>
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
