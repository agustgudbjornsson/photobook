'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    ChevronUp,
    ChevronDown,
    Trash2,
    Plus,
    Minus,
    Maximize,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Italic
} from 'lucide-react';

export interface CanvasElement {
    id: string;
    type: 'photo' | 'text';
    src?: string;
    text?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic';
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scale: number;
    zIndex: number;
}

const FONTS = [
    { name: 'Inter', value: 'var(--font-inter), sans-serif' },
    { name: 'Playfair Display', value: 'var(--font-playfair), serif' },
    { name: 'Montserrat', value: 'var(--font-montserrat), sans-serif' },
    { name: 'Roboto', value: 'var(--font-roboto), sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' }
];

interface CanvasProps {
    page: any;
    onSave: (content: CanvasElement[]) => void;
    format: any;
}

export default function Canvas({ page, onSave, format }: CanvasProps) {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeDir, setResizeDir] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [controlPos, setControlPos] = useState<'bottom' | 'top'>('bottom');

    const elementsRef = useRef(elements);
    useEffect(() => { elementsRef.current = elements; }, [elements]);

    const prevPageId = useRef(page?.id);

    useEffect(() => {
        if (page?.content) {
            try {
                const parsed = JSON.parse(page.content);
                const migration = parsed.map((el: any) => ({
                    ...el,
                    fontFamily: el.fontFamily || FONTS[0].value,
                    fontStyle: el.fontStyle || 'normal',
                    textAlign: el.textAlign || 'left',
                }));
                setElements(migration);
            } catch (e) {
                setElements([]);
            }
        } else {
            setElements([]);
        }

        if (prevPageId.current !== page?.id) {
            setSelectedId(null);
            setEditingId(null);
            prevPageId.current = page?.id;
        }
    }, [page]);

    const fitToScreen = useCallback(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const padding = 60;
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;

        const contentWidth = 700;
        const contentHeight = (format.heightCm / format.widthCm) * contentWidth;

        const scaleX = availableWidth / contentWidth;
        const scaleY = availableHeight / contentHeight;

        setZoom(Math.min(scaleX, scaleY, 1.5));
    }, [format]);

    useEffect(() => {
        fitToScreen();
    }, [fitToScreen]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 5));
        }
    };

    const addElement = (element: CanvasElement) => {
        setElements(prev => {
            const updated = [...prev, element];
            onSave(updated);
            return updated;
        });
        setSelectedId(element.id);
    };

    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        setElements(prev => {
            const updated = prev.map(el => el.id === id ? { ...el, ...updates } : el);
            onSave(updated);
            return updated;
        });
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const src = e.dataTransfer.getData('text/plain');
        if (src && containerRef.current) {
            const pageContainer = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - pageContainer.left) / zoom;
            const y = (e.clientY - pageContainer.top) / zoom;

            addElement({
                id: Math.random().toString(36).substr(2, 9),
                type: 'photo',
                src,
                x,
                y,
                width: 200,
                height: 150,
                rotation: 0,
                scale: 1,
                zIndex: elements.length + 1
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, id: string, dir: string | null = null) => {
        if (editingId === id && !dir) return;
        e.stopPropagation();
        setSelectedId(id);
        setIsDragging(true);
        setResizeDir(dir);
        setDragStart({ x: e.clientX, y: e.clientY });

        const el = elements.find(e => e.id === id);
        if (el) {
            const contentHeight = (format.heightCm / format.widthCm) * 700;
            if (el.y + el.height > contentHeight - 120) {
                setControlPos('top');
            } else {
                setControlPos('bottom');
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !selectedId || editingId) return;

            const dx = (e.clientX - dragStart.x) / zoom;
            const dy = (e.clientY - dragStart.y) / zoom;

            setElements(prev => prev.map(el => {
                if (el.id !== selectedId) return el;

                if (resizeDir) {
                    let { x, y, width, height } = el;
                    if (resizeDir.includes('e')) width += dx;
                    if (resizeDir.includes('w')) { width -= dx; x += dx; }
                    if (resizeDir.includes('s')) height += dy;
                    if (resizeDir.includes('n')) { height -= dy; y += dy; }

                    return { ...el, x, y, width: Math.max(20, width), height: Math.max(20, height) };
                } else {
                    return { ...el, x: el.x + dx, y: el.y + dy };
                }
            }));

            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            if (isDragging) {
                onSave(elementsRef.current);
                setIsDragging(false);
                setResizeDir(null);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, selectedId, dragStart, zoom, onSave, editingId, resizeDir, elementsRef]);

    const deleteElement = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = elements.filter(el => el.id !== id);
        setElements(updated);
        onSave(updated);
        setSelectedId(null);
    };

    const updateLayer = (e: React.MouseEvent, id: string, delta: number) => {
        e.stopPropagation();
        const updated = elements.map(el => el.id === id ? { ...el, zIndex: Math.max(1, el.zIndex + delta) } : el);
        setElements(updated);
        onSave(updated);
    };

    const toggleStyle = (id: string, prop: 'fontWeight' | 'fontStyle') => {
        const el = elements.find(e => e.id === id);
        if (!el) return;

        if (prop === 'fontWeight') {
            updateElement(id, { fontWeight: el.fontWeight === 'bold' ? 'normal' : 'bold' });
        } else {
            updateElement(id, { fontStyle: el.fontStyle === 'italic' ? 'normal' : 'italic' });
        }
    };

    const contentWidth = 700;
    const contentHeight = (format.heightCm / format.widthCm) * contentWidth;

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            style={{
                flex: 1,
                background: '#121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default'
            }}
            onMouseDown={() => { setSelectedId(null); setEditingId(null); }}
        >
            {/* Zoom Controls */}
            <div style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 200
            }}>
                <button onMouseDown={(e) => { e.stopPropagation(); setZoom(prev => Math.min(prev + 0.1, 5)); }} className="zoom-btn"><Plus size={18} /></button>
                <button onMouseDown={(e) => { e.stopPropagation(); setZoom(prev => Math.max(prev - 0.1, 0.1)); }} className="zoom-btn"><Minus size={18} /></button>
                <button onMouseDown={(e) => { e.stopPropagation(); fitToScreen(); }} className="zoom-btn" title="Fit to screen"><Maximize size={18} /></button>
                <div style={{ color: '#666', fontSize: '0.7rem', textAlign: 'center' }}>{Math.round(zoom * 100)}%</div>
            </div>

            <div
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    style={{
                        width: `${contentWidth}px`,
                        height: `${contentHeight}px`,
                        background: 'white',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onMouseDown={(e) => { e.stopPropagation(); setSelectedId(null); setEditingId(null); }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '3mm', left: '3mm', right: '3mm', bottom: '3mm',
                        border: '1px dashed #ddd',
                        pointerEvents: 'none',
                        zIndex: 1000
                    }}></div>

                    {[...elements].sort((a, b) => a.zIndex - b.zIndex).map((el) => {
                        const isSelected = el.id === selectedId;
                        const isEditing = el.id === editingId;
                        const eWidth = el.width * el.scale;
                        const eHeight = el.height * el.scale;

                        return (
                            <div
                                key={el.id}
                                onMouseDown={(e) => handleMouseDown(e, el.id)}
                                onDoubleClick={(e) => {
                                    if (el.type === 'text') {
                                        e.stopPropagation();
                                        setEditingId(el.id);
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    left: el.x,
                                    top: el.y,
                                    width: eWidth,
                                    height: eHeight,
                                    zIndex: el.zIndex,
                                    transform: `rotate(${el.rotation}deg)`,
                                    cursor: isEditing ? 'text' : isSelected ? 'move' : 'pointer',
                                    display: 'flex',
                                    outline: isSelected ? '2px solid var(--primary)' : 'none',
                                    outlineOffset: '2px',
                                    boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
                                }}
                            >
                                {el.type === 'photo' ? (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${el.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        pointerEvents: 'none'
                                    }} />
                                ) : (
                                    isEditing ? (
                                        <textarea
                                            autoFocus
                                            value={el.text}
                                            onChange={(e) => updateElement(el.id, { text: e.target.value })}
                                            onBlur={() => setEditingId(null)}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                outline: 'none',
                                                resize: 'none',
                                                background: 'transparent',
                                                fontSize: `${el.fontSize}px`,
                                                fontWeight: el.fontWeight as any,
                                                fontStyle: el.fontStyle,
                                                fontFamily: el.fontFamily,
                                                textAlign: el.textAlign,
                                                color: el.color,
                                                padding: '4px',
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            fontSize: `${el.fontSize}px`,
                                            fontWeight: el.fontWeight as any,
                                            fontStyle: el.fontStyle,
                                            fontFamily: el.fontFamily,
                                            textAlign: el.textAlign,
                                            color: el.color,
                                            padding: '4px',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            overflow: 'hidden',
                                            pointerEvents: 'none'
                                        }}>
                                            {el.text}
                                        </div>
                                    )
                                )}

                                {isSelected && !isEditing && (
                                    <>
                                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(dir => (
                                            <div
                                                key={dir}
                                                onMouseDown={(e) => handleMouseDown(e, el.id, dir)}
                                                className={`handle handle-${dir}`}
                                                style={{
                                                    position: 'absolute',
                                                    width: '12px',
                                                    height: '12px',
                                                    background: 'white',
                                                    border: '1px solid var(--primary)',
                                                    borderRadius: '50%',
                                                    zIndex: 110,
                                                    ...getHandlePos(dir)
                                                }}
                                            />
                                        ))}

                                        <div
                                            onMouseDown={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute',
                                                top: controlPos === 'top' ? '-115px' : 'auto',
                                                bottom: controlPos === 'bottom' ? '-115px' : 'auto',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px',
                                                background: 'var(--surface)',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                                zIndex: 300,
                                                minWidth: '240px',
                                                border: '1px solid #444'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {el.type === 'text' && (
                                                    <>
                                                        <select
                                                            value={el.fontFamily}
                                                            onChange={(e) => updateElement(el.id, { fontFamily: e.target.value })}
                                                            style={{ flex: 1, fontSize: '0.75rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '6px' }}
                                                        >
                                                            {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={el.fontSize}
                                                            onChange={(e) => updateElement(el.id, { fontSize: parseInt(e.target.value) || 12 })}
                                                            style={{ width: '50px', fontSize: '0.75rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '6px' }}
                                                        />
                                                    </>
                                                )}
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button onClick={(e) => updateLayer(e, el.id, 1)} className="mini-btn-sq" title="Bring Up"><ChevronUp size={16} /></button>
                                                    <button onClick={(e) => updateLayer(e, el.id, -1)} className="mini-btn-sq" title="Push Behind"><ChevronDown size={16} /></button>
                                                    <button onClick={(e) => deleteElement(e, el.id)} className="mini-btn-sq" style={{ color: '#ff4444' }} title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </div>

                                            {el.type === 'text' && (
                                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #444', paddingTop: '8px', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        <button onClick={() => toggleStyle(el.id, 'fontWeight')} className={`mini-btn-sq ${el.fontWeight === 'bold' ? 'active' : ''}`}><Bold size={14} /></button>
                                                        <button onClick={() => toggleStyle(el.id, 'fontStyle')} className={`mini-btn-sq ${el.fontStyle === 'italic' ? 'active' : ''}`}><Italic size={14} /></button>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                                                        <button onClick={() => updateElement(el.id, { textAlign: 'left' })} className={`mini-btn-sq ${el.textAlign === 'left' ? 'active' : ''}`}><AlignLeft size={14} /></button>
                                                        <button onClick={() => updateElement(el.id, { textAlign: 'center' })} className={`mini-btn-sq ${el.textAlign === 'center' ? 'active' : ''}`}><AlignCenter size={14} /></button>
                                                        <button onClick={() => updateElement(el.id, { textAlign: 'right' })} className={`mini-btn-sq ${el.textAlign === 'right' ? 'active' : ''}`}><AlignRight size={14} /></button>
                                                    </div>
                                                    <input
                                                        type="color"
                                                        value={el.color}
                                                        onChange={(e) => updateElement(el.id, { color: e.target.value })}
                                                        style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .zoom-btn {
                    width: 36px;
                    height: 36px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                .zoom-btn:hover { background: #333; }
                
                .mini-btn-sq {
                    width: 32px;
                    height: 32px;
                    background: #333;
                    border: 1px solid #444;
                    color: #ccc;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .mini-btn-sq:hover { background: #444; color: white; }
                .mini-btn-sq.active { background: var(--primary); color: white; border-color: var(--primary); }

                .handle { cursor: crosshair; }
                .handle-nw { cursor: nwse-resize; }
                .handle-n  { cursor: ns-resize; }
                .handle-ne { cursor: nesw-resize; }
                .handle-e  { cursor: ew-resize; }
                .handle-se { cursor: nwse-resize; }
                .handle-s  { cursor: ns-resize; }
                .handle-sw { cursor: nesw-resize; }
                .handle-w  { cursor: ew-resize; }
            `}</style>
        </div>
    );
}

function getHandlePos(dir: string) {
    switch (dir) {
        case 'nw': return { top: -8, left: -8 };
        case 'n': return { top: -8, left: '50%', transform: 'translateX(-50%)' };
        case 'ne': return { top: -8, right: -8 };
        case 'e': return { top: '50%', right: -8, transform: 'translateY(-50%)' };
        case 'se': return { bottom: -8, right: -8 };
        case 's': return { bottom: -8, left: '50%', transform: 'translateX(-50%)' };
        case 'sw': return { bottom: -8, left: -8 };
        case 'w': return { top: '50%', left: -8, transform: 'translateY(-50%)' };
    }
}
