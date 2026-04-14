'use client';

import { starkzap } from './starkzap';
import { CONTRACTS } from './config';

export type DashboardStats = {
  score: number;
  creditLimit: string;
  activeLoan: string;
  repaymentStatus: 'healthy' | 'late' | 'critical';
  stakingRewards: string;
};

export async function loadDashboard(address: string): Promise<DashboardStats> {
  const [score] = await starkzap.read({
    contractAddress: CONTRACTS.creditScore,
    entrypoint: 'get_score',
    calldata: [address]
  });

  const [creditLimit] = await starkzap.read({
    contractAddress: CONTRACTS.lendingPool,
    entrypoint: 'get_credit_limit',
    calldata: [address]
  });

  const [activeLoan] = await starkzap.read({
    contractAddress: CONTRACTS.lendingPool,
    entrypoint: 'get_loan',
    calldata: [address]
  });

  const stakingRewards = await starkzap.staking.getRewards({ owner: address, token: 'STRK' });

  const numericLoan = Number(activeLoan);
  return {
    score: Number(score),
    creditLimit: String(creditLimit),
    activeLoan: String(activeLoan),
    repaymentStatus: numericLoan === 0 ? 'healthy' : numericLoan < 250 ? 'late' : 'critical',
    stakingRewards: String(stakingRewards.amount)
  };
}
