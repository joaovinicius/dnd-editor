import type { Metadata, Viewport } from 'next';
import { Montserrat, Work_Sans } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['300', '400', '600', '700'],
  variable: '--font-family-montserrat',
  adjustFontFallback: true,
});
const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['300', '400', '600', '700'],
  variable: '--font-family-work-sans',
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Performance Builder Demo',
  description: 'Exemplo de page builder focado em 100% de Score no Lighthouse',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-brand-background ${montserrat.variable} ${workSans.variable} min-h-screen`}>
      {children}
      </body>
    </html>
  );
}