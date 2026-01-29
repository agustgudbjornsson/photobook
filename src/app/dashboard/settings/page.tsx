import { auth } from '@/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const session = await auth();
    if (!session || !session.user?.email) {
        redirect('/login');
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { name: true }
    });

    if (!user) redirect('/login');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />

            <main style={{ marginLeft: '250px', padding: '2rem 3rem' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>Settings</h1>
                    <p>Manage your account and preferences</p>
                </header>

                <SettingsForm initialName={user.name || ''} />
            </main>
        </div>
    );
}
