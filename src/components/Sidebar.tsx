'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { label: 'My Albums', href: '/dashboard' },
        { label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <aside style={{
            width: '250px',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'var(--surface)',
            padding: '2rem 1rem'
        }}>
            <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Photobook<span style={{ color: 'var(--primary)' }}>SaaS</span></h2>
            </div>

            <nav>
                <ul style={{ listStyle: 'none' }}>
                    {navItems.map((item) => (
                        <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                            <Link
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    color: pathname === item.href ? 'var(--primary-foreground)' : 'var(--foreground)',
                                    background: pathname === item.href ? 'var(--primary)' : 'transparent',
                                    fontWeight: pathname === item.href ? 600 : 400,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', right: '1rem' }}>
                <div style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem'
                }}>
                    <p style={{ marginBottom: '0.5rem', color: '#fff' }}>{session?.user?.name || 'User'}</p>
                    <p style={{ fontSize: '0.75rem', marginBottom: 0 }}>Pro Plan</p>
                </div>
            </div>
        </aside>
    );
}
