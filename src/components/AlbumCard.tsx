'use client';

import Link from 'next/link';

interface AlbumCardProps {
    id: string;
    title: string;
    date: string;
    pageCount: number;
    coverColor: string;
}

export default function AlbumCard({ id, title, date, pageCount, coverColor }: AlbumCardProps) {
    return (
        <Link href={`/editor/${id}`}>
            <div className="card" style={{ height: '100%', cursor: 'pointer', padding: 0, overflow: 'hidden', border: 'none' }}>
                <div style={{
                    height: '180px',
                    background: coverColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    {/* Simulated Cover Preview */}
                    <div style={{
                        width: '100px',
                        height: '140px',
                        background: 'rgba(255,255,255,0.1)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        borderRadius: '4px'
                    }}></div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Edited {date}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#d4d4d4' }}>{pageCount} Pages</span>
                        <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500 }}>Edit &rarr;</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
