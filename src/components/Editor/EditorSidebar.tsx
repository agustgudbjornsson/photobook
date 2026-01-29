'use client';

interface EditorSidebarProps {
    photos: string[];
}

export default function EditorSidebar({ photos }: EditorSidebarProps) {
    const onDragStart = (e: React.DragEvent, src: string) => {
        e.dataTransfer.setData('text/plain', src);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <aside style={{
            width: '300px',
            borderRight: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Photos</h3>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                alignContent: 'start'
            }}>
                {photos.map((src, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => onDragStart(e, src)}
                        style={{
                            aspectRatio: '1',
                            background: '#333',
                            borderRadius: '4px',
                            cursor: 'grab',
                            backgroundImage: `url(${src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '2px solid transparent',
                            transition: 'border-color 0.2s'
                        }}
                        className="photo-item"
                    />
                ))}

                <div style={{
                    aspectRatio: '1',
                    border: '2px dashed var(--border)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#888'
                }}>
                    + Add
                </div>
            </div>
        </aside>
    );
}
