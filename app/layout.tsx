import type { Metadata } from 'next';
import './globals.css';
import GlobalPlayer from '../components/GlobalPlayer';

export const metadata: Metadata = {
  title: 'G Putnam Music',
  description: 'IT\'S KLEIGH',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#3E2723]">
        {children}
        <GlobalPlayer />
      </body>
    </html>
  );
}
