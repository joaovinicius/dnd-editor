import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 1. Otimização de Fontes (Crucial para CLS e LCP)
// O Next.js baixa a fonte no build time e a serve como um asset estático,
// eliminando a viagem extra ao servidor do Google Fonts e evitando layout shifts.
const inter = Inter({ subsets: ['latin'] });

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
    <html lang="pt-BR">
    {/*
        A classe da fonte é aplicada no body para herança global.
        A estrutura deve ser limpa para não bloquear a renderização inicial.
      */}
    <body className={`${inter.className} min-h-screen bg-white text-slate-900`}>
    {children}
    </body>
    </html>
  );
}