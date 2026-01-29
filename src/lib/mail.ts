
import nodemailer from 'nodemailer';

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/verify-email?token=${token}`;

    if (process.env.NODE_ENV === 'development') {
        console.log(`
        =============================================
        📧 MOCK EMAIL TO: ${email}
        SUBJECT: Confirm your email
        LINK: ${confirmLink}
        =============================================
        `);
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Confirm your email',
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
};
