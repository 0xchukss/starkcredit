# StarkCredit MVP

StarkCredit is a full-stack Starknet dApp for dynamic credit scoring and undercollateralized lending with gasless UX.

## 1) Project Folder Structure

```txt
starkcredit/
├── contracts/
│   ├── Scarb.toml
│   └── src/
│       ├── lib.cairo
│       ├── credit_score.cairo
│       └── lending_pool.cairo
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── borrow/page.tsx
│   │   │   └── lend/page.tsx
│   │   ├── components/
│   │   └── lib/
└── scripts/
    └── deploy.md
```

## 2) Smart Contracts (Cairo)

- `CreditScore`:
  - score range 0–1000
  - admin-gated `update_score(address, action_type)`
  - `get_score(address)` with default bootstrap score 500
  - `calculate_credit_limit(score)` for score-based limits
- `LendingPool`:
  - `deposit_liquidity(amount)`
  - `borrow(amount, collateral)` checks `credit_limit = score * multiplier`
  - `repay(amount)` updates score with successful repayment action
  - `liquidate(user)` marks default and penalizes score

## 3) Frontend (Next.js + Tailwind)

Pages:
- Landing: Privy onboarding trigger via StarkZap `onboard()`
- Dashboard: credit score, limit, loan, repayment status, staking rewards
- Borrow: borrow and repay workflows
- Lend: liquidity deposit + staking route and APY display

## 4) StarkZap Integration

- Network: Sepolia (`network: "sepolia"`)
- Gasless sponsor: AVNU paymaster (`feeMode: "sponsored"`)
- Modules used:
  - Wallet abstraction and `wallet.execute()` batching
  - Token approves/transfers
  - Lending calls (`borrow`, `repay`, `deposit_liquidity`)
  - Staking rewards and stake deposit module

## 5) Deployment Steps (Sepolia)

1. Build and declare contracts:
   ```bash
   cd contracts
   scarb build
   ```
2. Deploy `CreditScore` with admin address.
3. Deploy `LendingPool` with:
   - admin address
   - `credit_score_contract`
   - `score_multiplier` (e.g. 10)
4. Set env vars:
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # fill contract addresses
   ```
5. Run frontend:
   ```bash
   npm install
   npm run dev
   ```

## 6) Demo Instructions (30 sec script)

1. **Login (0-8s)**: Click “Connect with Privy” and approve embedded wallet creation.
2. **View score (8-14s)**: Open Dashboard, paste address, click Load to show score + credit limit.
3. **Borrow (14-22s)**: Open Borrow page, enter amount, click Borrow. Transaction is sponsored (no gas prompt).
4. **Repay (22-30s)**: Enter repay amount, submit repayment, then refresh dashboard to show reduced debt and score improvement.

## Bonus-ready extension points

- `zk_proof` field placeholder can be added to loan structs for private credit attestations.
- Add guarantor mapping for social backing and delegated penalties/rewards.
- Mint score-tier NFT badges off score thresholds after repayment milestones.
