'use client';

import Link from 'next/link';

import { deleteAlbum } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface AlbumCardProps {
    id: string;
    title: string;
    date: string;
    pageCount: number;
    coverColor: string;
}

export default function AlbumCard({ id, title, date, pageCount, coverColor }: AlbumCardProps) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Are you sure you want to delete this album?')) {
            const result = await deleteAlbum(id);
            if (result.success) {
                router.refresh();
            } else {
                alert('Failed to delete album');
            }
        }
    };

    return (
        <Link href={`/editor/${id}`}>
            <div className="card" style={{ height: '100%', cursor: 'pointer', padding: 0, overflow: 'hidden', border: 'none', position: 'relative' }}>
                <div style={{
                    height: '180px',
                    background: coverColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <button
                        onClick={handleDelete}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '5px',
                            cursor: 'pointer',
                            color: 'white',
                            zIndex: 10
                        }}
                        title="Delete Album"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>

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
