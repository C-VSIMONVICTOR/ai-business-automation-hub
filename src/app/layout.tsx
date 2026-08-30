import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Business Automation Hub',
  description: 'Production lead capture and automated qualification workspace.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
