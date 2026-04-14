'use client';

import { starkzap } from './starkzap';
import { CONTRACTS, TOKEN_PRESETS } from './config';

export async function borrowFunds(amount: string, collateral: string) {
  const wallet = await starkzap.wallet();
  return wallet.execute({
    feeMode: 'sponsored',
    calls: [
      {
        contractAddress: CONTRACTS.lendingPool,
        entrypoint: 'borrow',
        calldata: [amount, collateral]
      }
    ]
  });
}

export async function repayFunds(amount: string) {
  const wallet = await starkzap.wallet();

  return wallet.execute({
    feeMode: 'sponsored',
    calls: [
      {
        contractAddress: TOKEN_PRESETS.USDC,
        entrypoint: 'approve',
        calldata: [CONTRACTS.lendingPool, amount]
      },
      {
        contractAddress: CONTRACTS.lendingPool,
        entrypoint: 'repay',
        calldata: [amount]
      }
    ]
  });
}

export async function depositLiquidity(tokenAddress: string, amount: string) {
  const wallet = await starkzap.wallet();

  return wallet.execute({
    feeMode: 'sponsored',
    calls: [
      {
        contractAddress: tokenAddress,
        entrypoint: 'approve',
        calldata: [CONTRACTS.lendingPool, amount]
      },
      {
        contractAddress: CONTRACTS.lendingPool,
        entrypoint: 'deposit_liquidity',
        calldata: [amount]
      },
      {
        module: 'staking',
        action: 'deposit',
        params: {
          token: 'STRK',
          amount
        }
      }
    ]
  });
}
