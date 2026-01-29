'use server';

import { signIn } from '@/auth';
import { db } from './db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { generateVerificationToken, getVerificationTokenByToken } from './tokens';
import { sendVerificationEmail } from './mail';

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
            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'CredentialsSignin':
                        return 'Invalid credentials.';
                    default:
                        return 'Something went wrong.';
                }
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
            },
        });

        return { success: true, albumId: album.id };
    } catch (error) {
        console.error('Failed to create album:', error);
        return { message: 'Failed to create album' };
    }
}
