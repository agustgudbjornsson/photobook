
'use client';

import { verifyEmail } from '@/lib/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing token');
            return;
        }

        verifyEmail(token)
            .then((result) => {
                if (result.error) {
                    setStatus('error');
                    setMessage(result.error);
                } else {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in.');
                }
            })
            .catch(() => {
                setStatus('error');
                setMessage('Something went wrong');
            });
    }, [token]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Email Verification</h2>

                {status === 'verifying' && (
                    <div>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p>Verifying your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'green' }}>✅</div>
                        <p style={{ marginBottom: '1.5rem' }}>{message}</p>
                        <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'red' }}>❌</div>
                        <p style={{ marginBottom: '1.5rem', color: 'red' }}>{message}</p>
                        <Link href="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
