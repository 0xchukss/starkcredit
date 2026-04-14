'use client';

import { StarkZap } from '@starkzap/sdk';
import { CONTRACTS, NETWORK } from './config';

export const starkzap = new StarkZap({
  network: NETWORK,
  paymaster: {
    provider: 'avnu',
    feeMode: 'sponsored'
  },
  contracts: CONTRACTS
});

export async function onboardUser() {
  return starkzap.onboard({
    strategy: 'privy',
    wallet: {
      autoDeploy: true
    }
  });
}
