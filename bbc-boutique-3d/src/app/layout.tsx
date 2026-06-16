import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Raleway } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bodoni',
  display: 'swap',
  adjustFontFallback: false,
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bleu Blanc Couture · Boutique Virtuelle 3D',
  description:
    'Découvrez les créatrices de Bleu Blanc Couture dans une boutique virtuelle 3D — haute couture, lingerie fine et élégance singulière.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0806',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
