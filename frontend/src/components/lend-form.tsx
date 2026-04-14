'use client';

import { FormEvent, useState } from 'react';
import { depositLiquidity } from '@/lib/actions';
import { TOKEN_PRESETS } from '@/lib/config';

export function LendForm() {
  const [token, setToken] = useState(TOKEN_PRESETS.STRK);
  const [amount, setAmount] = useState('');

  async function onDeposit(e: FormEvent) {
    e.preventDefault();
    await depositLiquidity(token, amount);
  }

  return (
    <form className="max-w-md rounded-lg border border-slate-800 bg-slate-900 p-4" onSubmit={onDeposit}>
      <h3 className="font-semibold">Provide Liquidity + Auto-Stake</h3>
      <select className="mt-3 w-full rounded bg-slate-800 p-2" value={token} onChange={(e) => setToken(e.target.value)}>
        <option value={TOKEN_PRESETS.STRK}>STRK</option>
        <option value={TOKEN_PRESETS.USDC}>USDC</option>
      </select>
      <input className="mt-3 w-full rounded bg-slate-800 p-2" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button className="mt-4 rounded bg-brand-500 px-3 py-2">Deposit</button>
    </form>
  );
}
