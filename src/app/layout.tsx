import type { Metadata } from 'next';
import { Inter, Playfair_Display, Montserrat, Roboto } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' });

export const metadata: Metadata = {
  title: 'Photobook SaaS',
  description: 'Create beautiful photobooks online',
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${roboto.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
