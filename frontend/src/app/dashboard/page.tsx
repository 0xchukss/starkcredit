'use client';

import { useState } from 'react';
import { StatCard } from '@/components/stat-card';
import { loadDashboard } from '@/lib/credit';

export default function DashboardPage() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof loadDashboard>> | null>(null);

  async function load() {
    setLoading(true);
    try {
      setStats(await loadDashboard(address));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex gap-3">
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Wallet address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button className="rounded bg-brand-500 px-4" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Load'}</button>
      </div>

      {stats ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Credit score" value={stats.score} />
          <StatCard label="Borrow limit" value={stats.creditLimit} />
          <StatCard label="Active loan" value={stats.activeLoan} />
          <StatCard label="Repayment status" value={stats.repaymentStatus} />
          <StatCard label="Staking rewards" value={stats.stakingRewards} />
        </div>
      ) : (
        <p className="text-slate-400">Enter an address to view score, limit, loans, and rewards.</p>
      )}
    </section>
  );
}
