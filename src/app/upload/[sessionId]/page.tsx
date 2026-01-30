'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload, CheckCircle2, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import { addPhotosToSession } from '@/lib/actions';
import { compressImage } from '@/lib/image-utils';

export default function MobileUploadPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [uploading, setUploading] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);
        try {
            const compressedUrls = await Promise.all(
                Array.from(files).map(file => compressImage(file, 1600, 0.7)) // Slightly more aggressive for mobile
            );

            const result = await addPhotosToSession(sessionId, compressedUrls);
            if (result.success) {
                setUploadedCount(prev => prev + compressedUrls.length);
            } else {
                setError(result.error || 'Failed to upload photos.');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Failed to process one or more images.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Photo Upload</h1>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Send photos directly to your photobook editor</p>
            </header>

            <main style={{
                width: '100%',
                maxWidth: '400px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 68, 68, 0.1)',
                        border: '1px solid rgba(255, 68, 68, 0.3)',
                        borderRadius: '12px',
                        color: '#ff4444',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {uploadedCount > 0 && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        borderRadius: '12px',
                        color: '#4caf50',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <CheckCircle2 size={18} />
                        {uploadedCount} photo{uploadedCount > 1 ? 's' : ''} sent to editor!
                    </div>
                )}

                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    style={{
                        flex: 1,
                        maxHeight: '300px',
                        border: '2px dashed #444',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        cursor: uploading ? 'default' : 'pointer',
                        background: '#111',
                        opacity: uploading ? 0.6 : 1,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.3)'
                    }}>
                        <Camera size={40} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                            {uploading ? 'Processing...' : 'Select Photos'}
                        </p>
                        <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#666' }}>
                            Choose from your gallery or take a new photo
                        </p>
                    </div>
                </div>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '2rem' }}>
                    <p style={{ color: '#444', fontSize: '0.75rem' }}>Session ID: {sessionId}</p>
                </div>
            </main>

            {uploading && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    zIndex: 100
                }}>
                    <Loader2 size={48} className="animate-spin" color="var(--primary)" />
                    <p style={{ fontWeight: '600' }}>Optimizing Photos...</p>
                </div>
            )}

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
