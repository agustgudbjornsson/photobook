'use client';

import { Suspense, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { newPassword } from '@/lib/actions';

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        startTransition(() => {
            newPassword(password, token)
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
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Set New Password</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter your new password below</p>

            <form action={onSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">New Password</label>
                    <input
                        type="password"
                        name="password"
                        className="input"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        minLength={6}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label className="label">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="input"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isPending}
                >
                    {isPending ? 'Updating...' : 'Reset Password'}
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
    );
}

export default function NewPasswordPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <Suspense fallback={<div>Loading...</div>}>
                <NewPasswordForm />
            </Suspense>
        </div>
    );
}
