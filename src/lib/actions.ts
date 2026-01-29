'use server';

import { signIn } from '@/auth';
import { db } from './db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { generateVerificationToken, getVerificationTokenByToken, generatePasswordResetToken, getPasswordResetTokenByToken } from './tokens';
import { sendVerificationEmail, sendPasswordResetEmail } from './mail';

const MAX_RETRIES = 3;

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            await signIn('credentials', formData);
            return undefined; // Success, redirect handled by middleware/config
        } catch (error) {
            const err = error as any;
            if (err.type === 'CredentialsSignin' || err.message?.includes('CredentialsSignin')) {
                return 'Invalid email or password.';
            }
            if (error instanceof AuthError) {
                return 'Something went wrong during authentication.';
            }
            // If it's not an AuthError, it might be a redirect (which throws in Next.js actions) which we should rethrow
            // OR a database connection error.
            // Next.js redirection throws an error, so we must rethrow it.
            if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
                throw error;
            }

            console.error(`Attempt ${retries + 1} failed:`, error);
            retries++;
            if (retries >= MAX_RETRIES) {
                throw error;
            }
            // wait a bit before retrying
            await new Promise(res => setTimeout(res, 500));
        }
    }
}

export async function registerUser(
    prevState: string | undefined,
    formData: FormData,
) {
    const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        return 'Invalid fields';
    }

    const { email, password, name } = parsed.data;

    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return 'User already exists.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);

        return 'Confirmation email sent! Please check your email.';
    } catch (error) {
        console.error('Registration error:', error);
        return 'Failed to create user.';
    }
}

export async function verifyEmail(token: string) {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: 'Token does not exist!' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: 'Token has expired!' };
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.identifier },
    });

    if (!existingUser) {
        return { error: 'Email does not exist!' };
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.identifier,
        },
    });

    await db.verificationToken.delete({
        where: {
            identifier_token: {
                identifier: existingToken.identifier,
                token: existingToken.token,
            },
        },
    });

    return { success: 'Email verified!' };
}

export async function getAlbumFormats() {
    try {
        return await db.albumFormat.findMany({
            orderBy: { widthCm: 'asc' },
        });
    } catch (error) {
        console.error('Failed to fetch album formats:', error);
        return [];
    }
}

export const reset = async (email: string) => {
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return { error: 'Email not found' };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return { success: 'Reset email sent!' };
};

export const newPassword = async (
    password: string,
    token?: string | null
) => {
    if (!token) {
        return { error: 'Missing token!' };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: 'Invalid token!' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: 'Token has expired!' };
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.email },
    });

    if (!existingUser) {
        return { error: 'Email does not exist!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
        where: { id: existingToken.id },
    });

    return { success: 'Password updated!' };
};

export async function createAlbum(prevState: any, formData: FormData) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        return { message: 'Not authenticated' };
    }

    const schema = z.object({
        title: z.string().min(1),
        formatId: z.string().min(1),
        coverColor: z.string().default('#3b82f6'),
    });

    const parsed = schema.safeParse({
        title: formData.get('title'),
        formatId: formData.get('formatId'),
        coverColor: formData.get('coverColor'),
    });

    if (!parsed.success) {
        return { message: 'Invalid data' };
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { message: 'User not found' };

    try {
        const album = await db.album.create({
            data: {
                title: parsed.data.title,
                coverColor: parsed.data.coverColor,
                albumFormatId: parsed.data.formatId,
                userId: user.id,
                pages: {
                    create: [
                        { pageNumber: 0, content: JSON.stringify([]) },
                        { pageNumber: 1, content: JSON.stringify([]) },
                    ]
                }
            },
        });

        return { success: true, albumId: album.id };
    } catch (error) {
        console.error('Failed to create album:', error);
        return { message: 'Failed to create album' };
    }
}

export async function deleteAlbum(albumId: string) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error('User not found');

    try {
        await db.album.delete({
            where: {
                id: albumId,
                userId: user.id, // Ensure user owns the album
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to delete album:', error);
        return { message: 'Failed to delete album' };
    }
}

export async function getAlbum(id: string) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        return null;
    }

    try {
        return await db.album.findUnique({
            where: { id },
            include: {
                pages: {
                    orderBy: { pageNumber: 'asc' },
                },
                format: true,
            },
        });
    } catch (error) {
        console.error('Failed to fetch album:', error);
        return null;
    }
}

export async function updatePageContent(pageId: string, content: string) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    try {
        await db.page.update({
            where: { id: pageId },
            data: { content },
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to update page content:', error);
        return { message: 'Failed to update page' };
    }
}

export async function addPage(albumId: string, pageNumber: number) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    try {
        const page = await db.page.create({
            data: {
                albumId,
                pageNumber,
                content: JSON.stringify([]), // Empty array of photos
            },
        });
        return { success: true, page };
    } catch (error) {
        console.error('Failed to add page:', error);
        return { message: 'Failed to add page' };
    }
}

export async function removePage(pageId: string) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    try {
        await db.page.delete({
            where: { id: pageId },
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to remove page:', error);
        return { message: 'Failed to remove page' };
    }
}

export async function updateUser(name: string, oldPassword?: string, newPassword?: string) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error('User not found');

    const data: any = { name };

    if (oldPassword && newPassword) {
        const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordsMatch) {
            return { error: 'Incorrect old password' };
        }
        data.password = await bcrypt.hash(newPassword, 10);
    }

    try {
        await db.user.update({
            where: { id: user.id },
            data,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { message: 'Failed to update user information' };
    }
}

export async function createOrder(data: {
    albumId: string;
    paperStyle: string;
    deliveryMethod: string;
    customerName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    totalAmount: number;
}) {
    const session = await import('@/auth').then(m => m.auth());
    if (!session?.user?.email) {
        throw new Error('Not authenticated');
    }

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error('User not found');

    try {
        const order = await db.order.create({
            data: {
                ...data,
                userId: user.id,
                status: 'pending'
            }
        });
        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Failed to create order:', error);
        return { message: 'Failed to place order' };
    }
}

export async function getOrders() {
    // In a real app, check if user is admin
    try {
        return await db.order.findMany({
            include: {
                album: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}
