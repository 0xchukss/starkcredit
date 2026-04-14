export const NETWORK = 'sepolia';

export const CONTRACTS = {
  creditScore: process.env.NEXT_PUBLIC_CREDIT_SCORE_ADDRESS ?? '0x0',
  lendingPool: process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS ?? '0x0'
};

export const TOKEN_PRESETS = {
  STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab072018f24f9f5b16f',
  USDC: '0x053c91253bc9682c04929ca02f2f0f6f5f6fbeab74dbf69c4e87f95ce5f4955'
};
