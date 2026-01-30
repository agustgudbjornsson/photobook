'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AlbumCard from '@/components/AlbumCard';
import CreateAlbumWizard from '@/components/CreateAlbumWizard';

export default function DashboardClient({
    albums,
    formats,
    orders
}: {
    albums: any[],
    formats: any[],
    orders: any[]
}) {
    const [showWizard, setShowWizard] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatDate = (date: any) => {
        if (!mounted || !date) return '...';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />

            <main style={{ marginLeft: '250px', padding: '2rem 3rem' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>My Albums</h1>
                        <p style={{ color: '#888' }}>Manage and edit your photobooks</p>
                    </div>

                    <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
                        + Create New Album
                    </button>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {albums.map((album) => (
                        <AlbumCard
                            key={album.id}
                            id={album.id}
                            title={album.title}
                            coverColor={album.coverColor}
                            pageCount={album.pages?.length || 0}
                            date={formatDate(album.updatedAt)}
                        />
                    ))}

                    <button className="card" onClick={() => setShowWizard(true)} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed var(--border)',
                        background: 'transparent',
                        minHeight: '320px',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'var(--surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            fontSize: '1.5rem',
                            color: 'var(--primary)'
                        }}>+</div>
                        <span style={{ fontWeight: 500 }}>Create New Album</span>
                    </button>
                </div>

                {/* Orders Section */}
                <section style={{ marginTop: '4rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Recent Orders</h2>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>Track your printed photobooks</p>
                    </div>

                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        {orders.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                <p>You haven't ordered any prints yet.</p>
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', fontSize: '0.8rem', color: '#888' }}>ORDER ID</th>
                                        <th style={{ padding: '1rem', fontSize: '0.8rem', color: '#888' }}>ALBUM</th>
                                        <th style={{ padding: '1rem', fontSize: '0.8rem', color: '#888' }}>DATE</th>
                                        <th style={{ padding: '1rem', fontSize: '0.8rem', color: '#888' }}>STATUS</th>
                                        <th style={{ padding: '1rem', fontSize: '0.8rem', color: '#888' }}>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                <code style={{ color: 'var(--primary)' }}>#{order.id?.slice(0, 8) || 'N/A'}</code>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                                {order.album?.title || 'Deleted Album'}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#888' }}>
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: 'rgba(245, 158, 11, 0.1)',
                                                    color: '#f59e0b'
                                                }}>
                                                    {order.status || 'pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                ${(order.totalAmount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>

            {showWizard && (
                <CreateAlbumWizard
                    formats={formats}
                    onClose={() => setShowWizard(false)}
                />
            )}
        </div>
    );
}
