import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StarkCredit',
  description: 'On-chain reputation-based undercollateralized lending on Starknet.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-900/60">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-brand-500">StarkCredit</Link>
            <div className="flex gap-4 text-sm text-slate-300">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/borrow">Borrow</Link>
              <Link href="/lend">Lend</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
