import Link from 'next/link';
import { ConnectButton } from '@/components/connect-button';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Borrow without full collateral.</h1>
        <p className="max-w-2xl text-slate-300">
          StarkCredit combines on-chain credit scoring, undercollateralized lending, and gasless Starknet UX.
        </p>
      </div>
      <ConnectButton />
      <div className="flex gap-3 text-sm">
        <Link className="rounded border border-slate-700 px-3 py-2" href="/dashboard">Open Dashboard</Link>
        <Link className="rounded border border-slate-700 px-3 py-2" href="/borrow">Borrow Funds</Link>
        <Link className="rounded border border-slate-700 px-3 py-2" href="/lend">Become a Lender</Link>
      </div>
    </section>
  );
}
