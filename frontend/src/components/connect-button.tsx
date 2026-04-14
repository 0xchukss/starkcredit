'use client';

import { useState } from 'react';
import { onboardUser } from '@/lib/starkzap';

export function ConnectButton() {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const wallet = await onboardUser();
      setAddress(wallet.address);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        className="rounded-md bg-brand-500 px-4 py-2 font-medium hover:bg-brand-700"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect with Privy'}
      </button>
      {address ? <p className="text-xs text-slate-400">Connected: {address}</p> : null}
    </div>
  );
}
