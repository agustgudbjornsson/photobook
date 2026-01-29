'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { reset } from '@/lib/actions';

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        const email = formData.get("email") as string;

        startTransition(() => {
            reset(email)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                    }

                    if (data?.success) {
                        setSuccess(data.success);
                    }
                });
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Forgot Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter your email to reset your password</p>

                <form action={onSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="you@example.com"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isPending}
                    >
                        {isPending ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    {error && (
                        <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
                    )}
                    {success && (
                        <p style={{ color: '#10b981', marginTop: '1rem', textAlign: 'center' }}>{success}</p>
                    )}
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#a1a1aa' }}>
                    <Link href="/login" style={{ color: 'var(--primary)' }}>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
