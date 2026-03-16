import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Background Remover',
  description: 'Drag and drop images to remove backgrounds instantly using AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
