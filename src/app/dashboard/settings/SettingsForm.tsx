'use client';

import { useState } from 'react';
import { updateUser } from '@/lib/actions';

export default function SettingsForm({ initialName }: { initialName: string }) {
    const [name, setName] = useState(initialName);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await updateUser(name, oldPassword, newPassword);
            if (result.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setOldPassword('');
                setNewPassword('');
            } else if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        style={{ width: '100%' }}
                        className="input"
                    />
                </div>

                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '-0.5rem' }}>Change Password</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Leave blank to keep your current password.</p>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ width: '100%' }}
                        className="input"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        style={{ width: '100%' }}
                        className="input"
                        minLength={6}
                    />
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#22c55e' : '#ef4444',
                        fontSize: '0.9rem',
                        border: `1px solid ${message.type === 'success' ? '#22c55e44' : '#ef444444'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !name}
                    style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
