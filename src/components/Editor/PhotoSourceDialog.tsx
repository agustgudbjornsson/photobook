'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Upload,
    Instagram,
    Facebook,
    Image as ImageIcon,
    Smartphone,
    Cloud,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { createUploadSession, pollUploadSession } from '@/lib/actions';
import { useEffect } from 'react';

interface PhotoSourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPhotos: (urls: string[]) => void;
}

type Tab = 'upload' | 'social' | 'phone';

export default function PhotoSourceDialog({ isOpen, onClose, onAddPhotos }: PhotoSourceDialogProps) {
    const [activeTab, setActiveTab] = useState<Tab>('upload');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [pollActive, setPollActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const knownPhotosRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (activeTab === 'phone' && !sessionId && isOpen) {
            createUploadSession().then(res => {
                if (res.success && res.sessionId) {
                    setSessionId(res.sessionId);
                    setPollActive(true);
                }
            });
        }
    }, [activeTab, sessionId, isOpen]);

    useEffect(() => {
        let interval: any;
        if (pollActive && sessionId && isOpen) {
            interval = setInterval(async () => {
                const res = await pollUploadSession(sessionId);
                if (res.success && res.photos && res.photos.length > 0) {
                    const newPhotos = res.photos.filter((p: string) => !knownPhotosRef.current.has(p));
                    if (newPhotos.length > 0) {
                        newPhotos.forEach((p: string) => knownPhotosRef.current.add(p));
                        onAddPhotos(newPhotos);
                    }
                }
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pollActive, sessionId, isOpen, onAddPhotos]);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const compressedUrls = await Promise.all(
                Array.from(files).map(file => compressImage(file))
            );
            onAddPhotos(compressedUrls);
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to process one or more images.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: '600px',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Add Photos</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar Tabs */}
                    <div style={{
                        width: '200px',
                        borderRight: '1px solid var(--border)',
                        background: '#111',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <TabButton
                            active={activeTab === 'upload'}
                            onClick={() => setActiveTab('upload')}
                            icon={<Upload size={18} />}
                            label="Local Files"
                        />
                        <TabButton
                            active={activeTab === 'social'}
                            onClick={() => setActiveTab('social')}
                            icon={<Cloud size={18} />}
                            label="Social Media"
                        />
                        <TabButton
                            active={activeTab === 'phone'}
                            onClick={() => setActiveTab('phone')}
                            icon={<Smartphone size={18} />}
                            label="From Phone"
                        />
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: 1, padding: '2rem', position: 'relative', overflowY: 'auto' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'upload' && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            flex: 1,
                                            border: `2px dashed ${dragActive ? 'var(--primary)' : '#444'}`,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            background: dragActive ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: '#222',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: dragActive ? 'var(--primary)' : '#666'
                                        }}>
                                            <Upload size={32} />
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontWeight: '600' }}>Drop photos here or click to browse</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>Supports JPEG, PNG, WEBP</p>
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
                                </motion.div>
                            )}

                            {activeTab === 'social' && (
                                <motion.div
                                    key="social"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                                >
                                    <SocialButton icon={<Instagram size={24} />} label="Instagram" color="#E1306C" />
                                    <SocialButton icon={<Facebook size={24} />} label="Facebook" color="#1877F2" />
                                    <SocialButton icon={<ImageIcon size={24} />} label="Google Photos" color="#4285F4" />
                                </motion.div>
                            )}

                            {activeTab === 'phone' && (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                                >
                                    <div style={{ maxWidth: '300px' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>Upload from your phone</p>
                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Scan this QR code with your phone camera to quickly upload photos from your mobile gallery.</p>
                                    </div>
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}>
                                        {sessionId ? (
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/upload/${sessionId}`)}`}
                                                alt="Upload QR Code"
                                                style={{ width: '150px', height: '150px' }}
                                            />
                                        ) : (
                                            <div style={{ width: '150px', height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Loader2 size={32} className="animate-spin" color="#666" />
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#444' }}>ID: {sessionId || 'Creating session...'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {uploading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                zIndex: 10
                            }}>
                                <Loader2 size={48} className="animate-spin" color="var(--primary)" />
                                <p style={{ fontWeight: '600' }}>Processing & Compressing...</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                border: 'none',
                background: active ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                color: active ? 'var(--primary)' : '#888',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
                fontWeight: active ? '600' : '400'
            }}
        >
            {icon}
            <span style={{ fontSize: '0.9rem' }}>{label}</span>
        </button>
    );
}

function SocialButton({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
    return (
        <button style={{
            padding: '1.5rem',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
        }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#333')}
            onClick={() => alert(`${label} integration coming soon!`)}
        >
            <div style={{ color }}>{icon}</div>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{label}</span>
        </button>
    );
}
