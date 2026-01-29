'use client';

import EditorSidebar from '@/components/Editor/EditorSidebar';
import Canvas from '@/components/Editor/Canvas';
import Link from 'next/link';

export default function EditorPage({ params }: { params: { id: string } }) {
    // Mock photos
    const photos = [
        'https://picsum.photos/seed/1/200',
        'https://picsum.photos/seed/2/200',
        'https://picsum.photos/seed/3/200',
        'https://picsum.photos/seed/4/200',
        'https://picsum.photos/seed/5/200',
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top Bar */}
            <header style={{
                height: '60px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/dashboard" style={{ color: '#888', fontSize: '0.9rem' }}>
                        &larr; Back
                    </Link>
                    <span style={{ height: '20px', width: '1px', background: 'var(--border)' }}></span>
                    <h1 style={{ fontSize: '1rem', margin: 0 }}>Summer Vacation 2024</h1>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Preview</button>
                    <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Order Print</button>
                </div>
            </header>

            {/* Main Editor Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <EditorSidebar photos={photos} />
                <Canvas />
            </div>
        </div>
    );
}
