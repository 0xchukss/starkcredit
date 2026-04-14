#[starknet::contract]
mod CreditScore {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess};

    #[derive(Copy, Drop, Serde)]
    pub enum ActionType {
        RepaymentSuccess,
        StakeActivity,
        WalletActivity,
        MissedRepayment,
        Defaulted,
    }

    #[storage]
    struct Storage {
        admin: ContractAddress,
        scores: Map<ContractAddress, u16>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ScoreUpdated: ScoreUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct ScoreUpdated {
        user: ContractAddress,
        previous_score: u16,
        new_score: u16,
        action_type: ActionType,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.admin.write(admin);
    }

    #[abi(embed_v0)]
    impl CreditScoreImpl of ICreditScore<ContractState> {
        fn get_score(self: @ContractState, user: ContractAddress) -> u16 {
            let score = self.scores.read(user);
            if score == 0 {
                500
            } else {
                score
            }
        }

        fn update_score(ref self: ContractState, user: ContractAddress, action_type: ActionType) {
            self.assert_admin();
            let current = self.get_score(user);
            let delta = Self::action_delta(action_type);
            let updated = Self::bounded_score(current, delta);

            self.scores.write(user, updated);
            self.emit(Event::ScoreUpdated(ScoreUpdated {
                user,
                previous_score: current,
                new_score: updated,
                action_type,
            }));
        }

        fn calculate_credit_limit(self: @ContractState, score: u16) -> u256 {
            let multiplier: u256 = 10;
            score.into() * multiplier
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_admin(self: @ContractState) {
            assert(get_caller_address() == self.admin.read(), 'ONLY_ADMIN');
        }

        fn action_delta(action_type: ActionType) -> i32 {
            match action_type {
                ActionType::RepaymentSuccess => 40,
                ActionType::StakeActivity => 20,
                ActionType::WalletActivity => 10,
                ActionType::MissedRepayment => -50,
                ActionType::Defaulted => -120,
            }
        }

        fn bounded_score(score: u16, delta: i32) -> u16 {
            let base: i32 = score.into();
            let mut next = base + delta;
            if next < 0 {
                next = 0;
            }
            if next > 1000 {
                next = 1000;
            }
            next.try_into().unwrap()
        }
    }

    #[starknet::interface]
    trait ICreditScore<TState> {
        fn get_score(self: @TState, user: ContractAddress) -> u16;
        fn update_score(ref self: TState, user: ContractAddress, action_type: ActionType);
        fn calculate_credit_limit(self: @TState, score: u16) -> u256;
    }
}
