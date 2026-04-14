#[starknet::contract]
mod LendingPool {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starkcredit::credit_score::CreditScore::ICreditScoreDispatcher;
    use starkcredit::credit_score::CreditScore::ICreditScoreDispatcherTrait;
    use starkcredit::credit_score::CreditScore::ActionType;

    #[storage]
    struct Storage {
        admin: ContractAddress,
        credit_score_contract: ContractAddress,
        score_multiplier: u256,
        total_liquidity: u256,
        liquidity_by_user: Map<ContractAddress, u256>,
        loan_principal: Map<ContractAddress, u256>,
        partial_collateral: Map<ContractAddress, u256>,
        defaulted: Map<ContractAddress, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        LiquidityDeposited: LiquidityDeposited,
        Borrowed: Borrowed,
        Repaid: Repaid,
        Liquidated: Liquidated,
    }

    #[derive(Drop, starknet::Event)]
    struct LiquidityDeposited {
        lender: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Borrowed {
        borrower: ContractAddress,
        amount: u256,
        credit_limit: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Repaid {
        borrower: ContractAddress,
        amount: u256,
        remaining_debt: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Liquidated {
        user: ContractAddress,
        debt: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        admin: ContractAddress,
        credit_score_contract: ContractAddress,
        score_multiplier: u256,
    ) {
        self.admin.write(admin);
        self.credit_score_contract.write(credit_score_contract);
        self.score_multiplier.write(score_multiplier);
    }

    #[abi(embed_v0)]
    impl LendingPoolImpl of ILendingPool<ContractState> {
        fn deposit_liquidity(ref self: ContractState, amount: u256) {
            assert(amount > 0, 'INVALID_AMOUNT');
            let user = get_caller_address();

            let existing = self.liquidity_by_user.read(user);
            self.liquidity_by_user.write(user, existing + amount);
            self.total_liquidity.write(self.total_liquidity.read() + amount);

            self.emit(Event::LiquidityDeposited(LiquidityDeposited { lender: user, amount }));
        }

        fn borrow(ref self: ContractState, amount: u256, collateral: u256) {
            assert(amount > 0, 'INVALID_AMOUNT');
            let user = get_caller_address();
            let debt = self.loan_principal.read(user);

            let credit_limit = self.compute_credit_limit(user);
            assert(debt + amount <= credit_limit + collateral, 'EXCEEDS_LIMIT');
            assert(amount <= self.total_liquidity.read(), 'INSUFFICIENT_POOL');

            self.partial_collateral.write(user, self.partial_collateral.read(user) + collateral);
            self.loan_principal.write(user, debt + amount);
            self.total_liquidity.write(self.total_liquidity.read() - amount);

            self.emit(Event::Borrowed(Borrowed {
                borrower: user,
                amount,
                credit_limit,
            }));
        }

        fn repay(ref self: ContractState, amount: u256) {
            assert(amount > 0, 'INVALID_AMOUNT');
            let user = get_caller_address();
            let debt = self.loan_principal.read(user);
            assert(debt > 0, 'NO_DEBT');

            let payment = if amount > debt { debt } else { amount };
            let remaining = debt - payment;

            self.loan_principal.write(user, remaining);
            self.total_liquidity.write(self.total_liquidity.read() + payment);

            let credit_score = ICreditScoreDispatcher {
                contract_address: self.credit_score_contract.read(),
            };
            credit_score.update_score(user, ActionType::RepaymentSuccess);

            self.emit(Event::Repaid(Repaid {
                borrower: user,
                amount: payment,
                remaining_debt: remaining,
            }));
        }

        fn liquidate(ref self: ContractState, user: ContractAddress) {
            self.assert_admin();
            let debt = self.loan_principal.read(user);
            assert(debt > 0, 'NO_DEBT');

            self.loan_principal.write(user, 0);
            self.partial_collateral.write(user, 0);
            self.defaulted.write(user, true);

            let credit_score = ICreditScoreDispatcher {
                contract_address: self.credit_score_contract.read(),
            };
            credit_score.update_score(user, ActionType::Defaulted);

            self.emit(Event::Liquidated(Liquidated { user, debt }));
        }

        fn get_credit_limit(self: @ContractState, user: ContractAddress) -> u256 {
            self.compute_credit_limit(user)
        }

        fn get_loan(self: @ContractState, user: ContractAddress) -> u256 {
            self.loan_principal.read(user)
        }

        fn get_total_liquidity(self: @ContractState) -> u256 {
            self.total_liquidity.read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_admin(self: @ContractState) {
            assert(get_caller_address() == self.admin.read(), 'ONLY_ADMIN');
        }

        fn compute_credit_limit(self: @ContractState, user: ContractAddress) -> u256 {
            let credit_score = ICreditScoreDispatcher {
                contract_address: self.credit_score_contract.read(),
            };
            let score = credit_score.get_score(user);
            score.into() * self.score_multiplier.read()
        }
    }

    #[starknet::interface]
    trait ILendingPool<TState> {
        fn deposit_liquidity(ref self: TState, amount: u256);
        fn borrow(ref self: TState, amount: u256, collateral: u256);
        fn repay(ref self: TState, amount: u256);
        fn liquidate(ref self: TState, user: ContractAddress);
        fn get_credit_limit(self: @TState, user: ContractAddress) -> u256;
        fn get_loan(self: @TState, user: ContractAddress) -> u256;
        fn get_total_liquidity(self: @TState) -> u256;
    }
}
