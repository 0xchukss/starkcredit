'use client';

import { FormEvent, useState } from 'react';
import { borrowFunds, repayFunds } from '@/lib/actions';

export function BorrowForm() {
  const [amount, setAmount] = useState('');
  const [collateral, setCollateral] = useState('0');
  const [repayAmount, setRepayAmount] = useState('');

  async function onBorrow(e: FormEvent) {
    e.preventDefault();
    await borrowFunds(amount, collateral);
  }

  async function onRepay(e: FormEvent) {
    e.preventDefault();
    await repayFunds(repayAmount);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="rounded-lg border border-slate-800 bg-slate-900 p-4" onSubmit={onBorrow}>
        <h3 className="font-semibold">Borrow USDC</h3>
        <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Optional collateral" value={collateral} onChange={(e) => setCollateral(e.target.value)} />
        <button className="mt-4 rounded bg-brand-500 px-3 py-2">Borrow</button>
      </form>

      <form className="rounded-lg border border-slate-800 bg-slate-900 p-4" onSubmit={onRepay}>
        <h3 className="font-semibold">Repay Loan</h3>
        <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Amount" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} />
        <button className="mt-4 rounded bg-emerald-500 px-3 py-2">Repay</button>
      </form>
    </div>
  );
}
