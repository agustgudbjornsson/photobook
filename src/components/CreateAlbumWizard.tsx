'use client';

import { useState } from 'react';
import { createAlbum, getAlbumFormats } from '@/lib/actions';
import { useActionState } from 'react';

type AlbumFormat = {
    id: string;
    name: string;
    widthCm: number;
    heightCm: number;
    slug: string;
};

export default function CreateAlbumWizard({
    formats,
    onClose
}: {
    formats: AlbumFormat[];
    onClose: () => void;
}) {
    const [step, setStep] = useState(1);
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [title, setTitle] = useState('');

    // Using a wrapper around the action to close modal on success
    const createAlbumWrapper = async (prevState: any, formData: FormData) => {
        const result = await createAlbum(prevState, formData);
        if (result.success) {
            onClose();
            // Ideally we shouldn't reload but invalidate cache. 
            // For now window.location is simplest to see the new album.
            window.location.reload();
        }
        return result;
    }

    const [state, dispatch, isPending] = useActionState(createAlbumWrapper, null);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Create New Album</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.5rem' }}>
                        &times;
                    </button>
                </header>

                <form action={dispatch}>
                    <input type="hidden" name="formatId" value={selectedFormat || ''} />

                    {step === 1 && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Step 1: Select Format</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                                {formats.map((format) => (
                                    <div
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        style={{
                                            border: `2px solid ${selectedFormat === format.id ? 'var(--primary)' : 'var(--border)'}`,
                                            borderRadius: 'var(--radius)',
                                            padding: '1rem',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            background: selectedFormat === format.id ? 'var(--surface-hover)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            marginBottom: '0.5rem',
                                            aspectRatio: `${format.widthCm}/${format.heightCm}`,
                                            background: '#333',
                                            borderRadius: '4px'
                                        }}></div>
                                        <div style={{ fontWeight: 500 }}>{format.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {format.widthCm} x {format.heightCm} cm
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={!selectedFormat}
                                    onClick={() => setStep(2)}
                                >
                                    Next Step &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Step 2: Album Details</h3>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Album Title</label>
                                <input
                                    name="title"
                                    className="input"
                                    required
                                    placeholder="e.g. Summer Vacation"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Cover Color</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#000000'].map(color => (
                                        <label key={color} style={{ cursor: 'pointer' }}>
                                            <input type="radio" name="coverColor" value={color} defaultChecked={color === '#3b82f6'} style={{ display: 'none' }} />
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: color, border: '2px solid transparent' }}
                                                className="color-swatch"
                                            ></div>
                                        </label>
                                    ))}
                                </div>
                                <style jsx>{`
                                    input:checked + .color-swatch { border-color: white !important; box-shadow: 0 0 0 2px var(--primary); }
                                `}</style>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                                    &larr; Back
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isPending}>
                                    {isPending ? 'Creating...' : 'Create Album'}
                                </button>
                            </div>
                            {state?.message && <p style={{ color: 'red', marginTop: '1rem' }}>{state.message}</p>}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
