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

                {message?.includes('Confirmation email sent') ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                        <h3 className="text-xl font-bold mb-2">Check your email</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            default
                            {message}
                        </p>
                        <Link href="/login" className="btn btn-primary">
                            Return to Login
                        </Link>
                    </div>
                ) : (
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
                            <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{message}</p>
                        )}
                    </form>
                )}

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
