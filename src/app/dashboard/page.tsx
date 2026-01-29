import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getAlbumFormats } from '@/lib/actions';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();
    if (!session || !session.user?.email) {
        redirect('/login');
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
            albums: {
                orderBy: { updatedAt: 'desc' },
                include: { format: true, pages: true }
            },
            orders: {
                orderBy: { createdAt: 'desc' },
                include: { album: true }
            }
        }
    });

    if (!user) redirect('/login');

    const formats = await getAlbumFormats();

    return <DashboardClient albums={user.albums} formats={formats} orders={user.orders} />;
}
