'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { authenticate } from '@/lib/actions';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign in to continue to your albums</p>

                <form action={dispatch}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isPending}
                    >
                        {isPending ? 'Signing In...' : 'Sign In'}
                    </button>
                    {errorMessage && (
                        <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{errorMessage}</p>
                    )}
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#a1a1aa' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--primary)' }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
