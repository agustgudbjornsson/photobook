'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/lib/actions';

export default function SignupPage() {
    const [message, dispatch, isPending] = useActionState(registerUser, undefined);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign up to start creating photobooks</p>

                <form action={dispatch}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                            placeholder="minimum 6 characters"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isPending}
                    >
                        {isPending ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    {message && (
                        <p style={{ color: message.includes('created') ? 'green' : 'red', marginTop: '1rem', textAlign: 'center' }}>{message}</p>
                    )}
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#a1a1aa' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)' }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
