'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AlbumCard from '@/components/AlbumCard';
import CreateAlbumWizard from '@/components/CreateAlbumWizard';

export default function DashboardClient({ albums, formats }: { albums: any[], formats: any[] }) {
    const [showWizard, setShowWizard] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />

            <main style={{ marginLeft: '250px', padding: '2rem 3rem' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>My Albums</h1>
                        <p>Manage and edit your photobooks</p>
                    </div>

                    <button className="btn btn-primary" onClick={() => setShowWizard(true)}>
                        + Create New Album
                    </button>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {albums.map((album) => (
                        <AlbumCard
                            key={album.id}
                            id={album.id}
                            title={album.title}
                            coverColor={album.coverColor}
                            pageCount={0} // TODO: Count pages
                            date={new Date(album.updatedAt).toLocaleDateString()}
                        />
                    ))}

                    {/* Create New Placeholder Card */}
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
