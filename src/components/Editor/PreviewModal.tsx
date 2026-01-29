'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
    album: any;
    onClose: () => void;
}

export default function PreviewModal({ album, onClose }: PreviewModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const pages = album.pages;
    const format = album.format;

    const nextScale = 0.8;
    const contentWidth = 600;
    const contentHeight = (format.heightCm / format.widthCm) * contentWidth;

    const nextPage = () => {
        if (currentIndex < pages.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const renderElements = (contentStr: string) => {
        try {
            const elements = JSON.parse(contentStr || '[]');
            return elements.map((el: any) => (
                <div
                    key={el.id}
                    style={{
                        position: 'absolute',
                        left: (el.x / 700) * contentWidth,
                        top: (el.y / ((format.heightCm / format.widthCm) * 700)) * contentHeight,
                        width: (el.width * el.scale / 700) * contentWidth,
                        height: (el.height * el.scale / ((format.heightCm / format.widthCm) * 700)) * contentHeight,
                        zIndex: el.zIndex,
                        transform: `rotate(${el.rotation}deg)`,
                    }}
                >
                    {el.type === 'photo' ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${el.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }} />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            fontSize: `${(el.fontSize / 700) * contentWidth}px`,
                            fontWeight: el.fontWeight,
                            fontStyle: el.fontStyle,
                            fontFamily: el.fontFamily,
                            textAlign: el.textAlign,
                            color: el.color,
                            padding: '4px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}>
                            {el.text}
                        </div>
                    )}
                </div>
            ));
        } catch (e) {
            return null;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
        }}>
            {/* Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>Previewing: {album.title}</h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Close Preview
                </button>
            </div>

            {/* Book Area */}
            <div style={{
                width: '100%',
                maxWidth: '900px',
                height: '70vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, rotateY: 90, x: 100 }}
                        animate={{ opacity: 1, rotateY: 0, x: 0 }}
                        exit={{ opacity: 0, rotateY: -90, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                            width: `${contentWidth}px`,
                            height: `${contentHeight}px`,
                            background: 'white',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                            perspective: '1000px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {renderElements(pages[currentIndex].content)}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    onClick={prevPage}
                    disabled={currentIndex === 0}
                    style={{
                        position: 'absolute',
                        left: '-80px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: currentIndex === 0 ? 'default' : 'pointer',
                        opacity: currentIndex === 0 ? 0.2 : 1
                    }}
                >
                    &lsaquo;
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentIndex === pages.length - 1}
                    style={{
                        position: 'absolute',
                        right: '-80px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: currentIndex === pages.length - 1 ? 'default' : 'pointer',
                        opacity: currentIndex === pages.length - 1 ? 0.2 : 1
                    }}
                >
                    &rsaquo;
                </button>
            </div>

            {/* Footer / Progress */}
            <div style={{
                marginTop: '3rem',
                color: '#888',
                fontSize: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div>Page {currentIndex + 1} of {pages.length}</div>
                <div style={{
                    width: '300px',
                    height: '4px',
                    background: '#222',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        initial={false}
                        animate={{ width: `${((currentIndex + 1) / pages.length) * 100}%` }}
                        style={{ height: '100%', background: 'var(--primary)' }}
                    />
                </div>
            </div>
        </div>
    );
}
