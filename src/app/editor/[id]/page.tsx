'use client';

import { useEffect, useState } from 'react';
import EditorSidebar from '@/components/Editor/EditorSidebar';
import Canvas, { CanvasElement } from '@/components/Editor/Canvas';
import PageOverview from '@/components/Editor/PageOverview';
import PreviewModal from '@/components/Editor/PreviewModal';
import Link from 'next/link';
import { getAlbum, updatePageContent, addPage, removePage } from '@/lib/actions';
import { useParams } from 'next/navigation';

export default function EditorPage() {
    const params = useParams();
    const id = params.id as string;

    const [album, setAlbum] = useState<any>(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        async function loadAlbum() {
            const data = await getAlbum(id);
            if (data) {
                setAlbum(data);
            }
            setLoading(false);
        }
        loadAlbum();
    }, [id]);

    const handleSavePage = async (pageId: string, content: any) => {
        const result = await updatePageContent(pageId, JSON.stringify(content));
        if (result.success) {
            setAlbum((prev: any) => ({
                ...prev,
                pages: prev.pages.map((p: any) => p.id === pageId ? { ...p, content: JSON.stringify(content) } : p)
            }));
        }
    };

    const handleAddPage = async () => {
        const nextPageNumber = album.pages.length;
        const result = await addPage(id, nextPageNumber);
        if (result.success) {
            setAlbum((prev: any) => ({
                ...prev,
                pages: [...prev.pages, result.page].sort((a: any, b: any) => a.pageNumber - b.pageNumber)
            }));
        }
    };

    const handleRemovePage = async (pageId: string) => {
        if (album.pages.length <= 2) {
            alert("Album must have at least front and back cover.");
            return;
        }
        if (confirm("Delete this page?")) {
            const result = await removePage(pageId);
            if (result.success) {
                const newPages = album.pages.filter((p: any) => p.id !== pageId);
                setAlbum((prev: any) => ({ ...prev, pages: newPages }));
                if (activePageIndex >= newPages.length) {
                    setActivePageIndex(newPages.length - 1);
                }
            }
        }
    };

    const handleAddText = async (type: 'headline' | 'text') => {
        const page = album.pages[activePageIndex];
        let content: CanvasElement[] = [];
        try {
            content = JSON.parse(page.content || '[]');
        } catch (e) {
            content = [];
        }

        const newElement: CanvasElement = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            text: type === 'headline' ? 'New Headline' : 'Double click to edit text',
            fontSize: type === 'headline' ? 32 : 16,
            fontWeight: type === 'headline' ? 'bold' : 'normal',
            color: '#000000',
            fontFamily: 'var(--font-inter), sans-serif',
            textAlign: 'center',
            x: 150,
            y: 100,
            width: type === 'headline' ? 400 : 300,
            height: type === 'headline' ? 60 : 100,
            rotation: 0,
            scale: 1,
            zIndex: content.length + 1
        };

        const updatedContent = [...content, newElement];
        await handleSavePage(page.id, updatedContent);
    };

    const handleUpdateLayer = async (elementId: string, delta: number) => {
        const page = album.pages[activePageIndex];
        let content: CanvasElement[] = [];
        try {
            content = JSON.parse(page.content || '[]');
        } catch (e) {
            return;
        }

        const updatedContent = content.map(el =>
            el.id === elementId ? { ...el, zIndex: Math.max(1, el.zIndex + delta) } : el
        );
        await handleSavePage(page.id, updatedContent);
    };

    const handleDeleteLayer = async (elementId: string) => {
        const page = album.pages[activePageIndex];
        let content: CanvasElement[] = [];
        try {
            content = JSON.parse(page.content || '[]');
        } catch (e) {
            return;
        }

        const updatedContent = content.filter(el => el.id !== elementId);
        await handleSavePage(page.id, updatedContent);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Editor...</div>;
    if (!album) return <div style={{ padding: '2rem', textAlign: 'center' }}>Album not found.</div>;

    const activePage = album.pages[activePageIndex];
    if (!activePage) return <div style={{ padding: '2rem', textAlign: 'center' }}>Page not found.</div>;
    let pageLayers: CanvasElement[] = [];
    try {
        pageLayers = JSON.parse(activePage.content || '[]');
    } catch (e) {
        pageLayers = [];
    }

    // Mock photos for sidebar
    const photos = [
        'https://picsum.photos/seed/1/400/300',
        'https://picsum.photos/seed/2/400/300',
        'https://picsum.photos/seed/3/400/300',
        'https://picsum.photos/seed/4/400/300',
        'https://picsum.photos/seed/5/400/300',
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0a' }}>
            {showPreview && (
                <PreviewModal
                    album={album}
                    onClose={() => setShowPreview(false)}
                />
            )}

            {/* Top Bar */}
            <header style={{
                height: '60px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                justifyContent: 'space-between',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/dashboard" style={{ color: '#888', fontSize: '0.9rem', textDecoration: 'none' }}>
                        &larr; Back
                    </Link>
                    <span style={{ height: '20px', width: '1px', background: 'var(--border)' }}></span>
                    <h1 style={{ fontSize: '1rem', margin: 0 }}>{album.title}</h1>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>({album.format.name})</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                        Preview
                    </button>
                    <Link
                        href={`/order/${album.id}`}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                        Order Print
                    </Link>
                </div>
            </header>

            {/* Main Editor Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                <EditorSidebar
                    photos={photos}
                    onAddText={handleAddText}
                    layers={pageLayers}
                    onUpdateLayer={handleUpdateLayer}
                    onDeleteLayer={handleDeleteLayer}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Canvas
                        page={activePage}
                        onSave={(content) => handleSavePage(activePage.id, content)}
                        format={album.format}
                    />

                    <PageOverview
                        pages={album.pages}
                        activePageIndex={activePageIndex}
                        onPageSelect={setActivePageIndex}
                        onAddPage={handleAddPage}
                        onRemovePage={handleRemovePage}
                    />
                </div>
            </div>
        </div>
    );
}
