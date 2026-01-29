'use client';

import { useState } from 'react';
import {
    Image as ImageIcon,
    Layers,
    Type,
    Plus,
    ChevronUp,
    ChevronDown,
    Trash2
} from 'lucide-react';

interface EditorSidebarProps {
    photos: string[];
    onAddText: (type: 'headline' | 'text') => void;
    layers?: any[];
    onUpdateLayer?: (id: string, delta: number) => void;
    onDeleteLayer?: (id: string) => void;
}

export default function EditorSidebar({
    photos: initialPhotos,
    onAddText,
    layers = [],
    onUpdateLayer,
    onDeleteLayer
}: EditorSidebarProps) {
    const [photos, setPhotos] = useState(initialPhotos);
    const [activeTab, setActiveTab] = useState<'photos' | 'layers'>('photos');

    const onDragStart = (e: React.DragEvent, src: string) => {
        e.dataTransfer.setData('text/plain', src);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleAddPhoto = () => {
        const newPhoto = `https://picsum.photos/seed/${Math.random()}/400/300`;
        setPhotos(prev => [newPhoto, ...prev]);
    };

    return (
        <aside style={{
            width: '320px',
            borderRight: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            zIndex: 60
        }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('photos')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: activeTab === 'photos' ? 'transparent' : '#111',
                        border: 'none',
                        color: activeTab === 'photos' ? 'var(--primary)' : '#666',
                        borderBottom: activeTab === 'photos' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: activeTab === 'photos' ? '600' : '400'
                    }}
                >
                    <ImageIcon size={18} /> Photos
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: activeTab === 'layers' ? 'transparent' : '#111',
                        border: 'none',
                        color: activeTab === 'layers' ? 'var(--primary)' : '#666',
                        borderBottom: activeTab === 'layers' ? '2px solid var(--primary)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: activeTab === 'layers' ? '600' : '400'
                    }}
                >
                    <Layers size={18} /> Layers
                </button>
            </div>

            {activeTab === 'photos' ? (
                <>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', margin: 0, color: '#aaa' }}>GALLERY</h3>
                            <button
                                onClick={handleAddPhoto}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Plus size={14} /> Add Photo
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => onAddText('headline')}
                                style={{
                                    flex: 1,
                                    background: '#333',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Type size={16} /> Headline
                            </button>
                            <button
                                onClick={() => onAddText('text')}
                                style={{
                                    flex: 1,
                                    background: '#333',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Type size={16} /> Body
                            </button>
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        alignContent: 'start'
                    }}>
                        {photos.map((src, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => onDragStart(e, src)}
                                style={{
                                    aspectRatio: '1',
                                    background: '#1a1a1a',
                                    borderRadius: '6px',
                                    cursor: 'grab',
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid #333',
                                    transition: 'transform 0.2s, border-color 0.2s',
                                }}
                                className="photo-item"
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[...layers].sort((a, b) => b.zIndex - a.zIndex).map((layer) => (
                            <div
                                key={layer.id}
                                style={{
                                    background: '#222',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#333',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {layer.type === 'photo' ? (
                                        <img src={layer.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Type size={18} color="#666" />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {layer.type === 'text' ? layer.text : 'Photo'}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>Layer {layer.zIndex}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        onClick={() => onUpdateLayer?.(layer.id, 1)}
                                        style={{ background: '#333', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => onUpdateLayer?.(layer.id, -1)}
                                        style={{ background: '#333', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteLayer?.(layer.id)}
                                        style={{ background: '#333', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
