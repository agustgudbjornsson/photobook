'use client';

interface PageOverviewProps {
    pages: any[];
    activePageIndex: number;
    onPageSelect: (index: number) => void;
    onAddPage: () => void;
    onRemovePage: (pageId: string) => void;
}

export default function PageOverview({
    pages,
    activePageIndex,
    onPageSelect,
    onAddPage,
    onRemovePage
}: PageOverviewProps) {
    return (
        <div style={{
            height: '160px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            gap: '1rem',
            overflowX: 'auto',
            zIndex: 50
        }}>
            {pages.map((page, index) => {
                const isCover = index === 0;
                const isBackCover = index === pages.length - 1;
                const isActive = index === activePageIndex;

                let label = `Page ${index}`;
                if (isCover) label = "Front Cover";
                if (isBackCover) label = "Back Cover";

                return (
                    <div
                        key={page.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '100px'
                        }}
                    >
                        <div
                            onClick={() => onPageSelect(index)}
                            style={{
                                width: '100px',
                                height: '70px',
                                background: 'white',
                                borderRadius: '4px',
                                border: isActive ? '3px solid var(--primary)' : '1px solid #444',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none'
                            }}
                        >
                            {/* Simple Preview Placeholder */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: '#ccc'
                            }}>
                                {isCover ? "Front" : isBackCover ? "Back" : index}
                            </div>

                            {/* Remove button for internal pages */}
                            {!isCover && !isBackCover && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemovePage(page.id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        background: 'rgba(255,0,0,0.7)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        <span style={{
                            fontSize: '0.75rem',
                            color: isActive ? 'var(--primary)' : '#888',
                            fontWeight: isActive ? 600 : 400,
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}>
                            {label}
                        </span>
                    </div>
                );
            })}

            <button
                onClick={onAddPage}
                style={{
                    minWidth: '100px',
                    height: '70px',
                    border: '2px dashed #444',
                    background: 'transparent',
                    borderRadius: '4px',
                    color: '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    gap: '0.25rem'
                }}
            >
                <span style={{ fontSize: '1.2rem' }}>+</span>
                Add Page
            </button>
        </div>
    );
}
