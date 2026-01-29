'use client';

import { useState } from 'react';

export default function Canvas() {
    const [droppedPhotos, setDroppedPhotos] = useState<{ src: string, x: number, y: number }[]>([]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const src = e.dataTransfer.getData('text/plain');
        if (src) {
            // Calculate drop position relative to canvas
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setDroppedPhotos(prev => [...prev, { src, x, y }]);
        }
    };

    return (
        <div
            style={{
                flex: 1,
                background: '#121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* The Printable Page Area */}
            <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                style={{
                    width: '800px',
                    height: '500px',
                    background: 'white',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    color: '#ccc',
                    fontSize: '0.75rem'
                }}>
                    Page 1
                </div>

                {droppedPhotos.map((photo, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: photo.x - 75, // Center the image on drop
                            top: photo.y - 50,
                            width: '150px',
                            height: '100px',
                            backgroundImage: `url(${photo.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            cursor: 'move',
                            border: '1px solid #eee'
                        }}
                    />
                ))}

                {droppedPhotos.length === 0 && (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#eee',
                        pointerEvents: 'none'
                    }}>
                        <p style={{ color: '#ccc' }}>Drag photos here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
