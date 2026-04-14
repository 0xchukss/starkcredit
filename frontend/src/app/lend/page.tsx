import { LendForm } from '@/components/lend-form';

export default function LendPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Lend and earn yield</h2>
      <p className="text-slate-300">Deposited liquidity can be auto-routed to staking for additional rewards.</p>
      <div className="rounded border border-emerald-700 bg-emerald-900/20 p-3 text-sm text-emerald-200">Estimated APY: 8.4% (staking + lending spread)</div>
      <LendForm />
    </section>
  );
}
