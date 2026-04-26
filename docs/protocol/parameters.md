# Parameters and Timing Mapping

| Document Control | Value |
|---|---|
| **Document ID** | TP-SPEC-005 |
| **Status** | Approved for Devnet MVP — revised April 2026 |
| **Purpose** | Consolidate the parameters that shape current protocol behavior |

This page groups the parameters that matter most when reading the current deployment. All timing values
are enforced in **Solana slots**. Any wall-clock conversion shown by the UI is approximate.

## 1. Core configuration fields (`Config` PDA)

| Field | Type | Current meaning |
|---|---|---|
| `timlg_mint` | Pubkey | Mint used for stake and reward accounting |
| `stake_amount` | `u64` | Required stake per ticket, in mint base units (capped by `MAX_STAKE_AMOUNT`) |
| `commit_window_slots` | `u64` | Default commit window length (capped by `MAX_COMMIT_WINDOW_SLOTS`) |
| `oracle_window_slots` | `u64` | Default oracle window length (capped by `MAX_ORACLE_WINDOW_SLOTS`) |
| `reveal_window_slots` | `u64` | Default reveal window length (capped by `MAX_REVEAL_WINDOW_SLOTS`) |
| `claim_grace_slots` | `u64` | Delay before unclaimed balances become sweep-eligible |
| `oracle_pubkey` | Pubkey | Legacy single-signer pubkey (kept for development; betting rounds require quorum) |
| `treasury_sol` | Pubkey / PDA | Lamport fee collection surface — funds the streak jackpot |
| `sol_service_fee_lamports` | `u64` | Per-ticket SOL fee charged at commit (currently `5_000` in production) |
| `latest_finalized_pulse_index` | `u64` | LFP — last NIST pulse the protocol has accepted |
| `latest_pulse_timestamp` | `u64` | NIST pulse time (seconds) used as a heartbeat |
| `nist_period_seconds` | `u32` | Expected NIST publication period (typically 60s) |
| `min_reveal_buffer_slots` | `u64` | Minimum reveal-window remainder required when accepting a late pulse |
| `min_future_pulses` / `max_future_pulses` | `u64` | Bounds for the canonical-target rule |
| `has_nist_anchor` | `bool` | Whether the NIST chain has been bootstrapped |
| `last_output_value` | `[u8; 64]` | Last NIST `outputValue` accepted on-chain |
| `last_precommitment_value` | `[u8; 64]` | Last NIST `precommitmentValue` accepted on-chain |
| `recovery_mode_active` | `bool` | Whether recovery mode is currently active |
| `recovery_target_pulse` | `u64` | The pulse index recovery is trying to reach |
| `pulse_verification_mode` | `u8` | Selects single-signer (legacy) vs quorum verification path |

## 2. OracleSet PDA

| Field | Type | Current meaning |
|---|---|---|
| `threshold` | `u8` | Minimum number of oracle attestations required for `set_pulse_quorum` and `install_nist_anchor_quorum` |
| `oracles` | `Vec<Pubkey>` (max 16) | Allowlisted oracle public keys |

## 3. Tokenomics PDA

| Field | Type | Current meaning |
|---|---|---|
| `reward_fee_bps` | `u16` | Fee on winning rewards in basis points (capped by `MAX_REWARD_FEE_BPS = 5000`) |
| `reward_fee_pool` | Pubkey | SPL token account that receives the reward fee fraction |
| `replication_pool` | Pubkey | Reserved future allocation surface |

## 4. Streak Jackpot fields

| Surface | Where | Meaning |
|---|---|---|
| `sol_service_fee_lamports` | `Config` | Per-ticket SOL fee (jackpot funding source) |
| `Treasury SOL` PDA | balance | The active jackpot pool |
| `StreakLeaderboard.record_streak` | `StreakLeaderboard` | Highest verified streak ever claimed |
| `UserStats.current_streak` | `UserStats` | Triggers eligibility when greater than `record_streak` |
| `UserStats.refunded_in_streak_window` | `UserStats` | Counts legitimate refund "hops" so they do not break the streak |

See [Streak Jackpot](streak_jackpot.md) for the full mechanic.

## 5. Timing windows

| Window | Meaning | Operational effect |
|---|---|---|
| **Commit window** | Time during which commits are accepted | Late commits are rejected |
| **Reveal window** | Time during which valid reveals are accepted after pulse publication | Late reveals are rejected |
| **Claim grace** | Additional delay after settlement | Sweep cannot occur before it expires |
| **Refund timeout** | Delay after reveal deadline when no valid pulse exists | Enables refund path; default `REFUND_TIMEOUT_SLOTS` |
| **Late pulse safety buffer** | Minimum remaining room required to accept a late pulse | Prevents a pulse from being accepted too close to reveal expiry (`PulseTooLate`) |
| **Recovery exit timeout** | After this many slots in recovery, exit becomes permissionless | Default `RECOVERY_EXIT_TIMEOUT_SLOTS` |

## 6. Hardcaps (enforced in `constants.rs`)

| Constant | Cap |
|---|---|
| `MAX_STAKE_AMOUNT` | 10 000 TIMLG (9-decimal base units) |
| `MAX_REWARD_FEE_BPS` | 5 000 (50 %) |
| `MAX_COMMIT_WINDOW_SLOTS` / `MAX_REVEAL_WINDOW_SLOTS` / `MAX_ORACLE_WINDOW_SLOTS` | 54 000 each (~6 h) |
| `REFUND_TIMEOUT_SLOTS` | 150 (Devnet) |
| `RECOVERY_EXIT_TIMEOUT_SLOTS` | 86 400 (~9.6 h) |
| `TREASURY_WITHDRAW_MAX_ACTIVE_WINNERS` | 1 (constant defined; enforcement scheduled) |

## 7. Recommended interpretation rules

| Rule | Why it matters |
|---|---|
| **Read token values in base units first** | The program settles in base units, not UI-rounded amounts |
| **Treat wall-clock values as estimates** | Slot times vary across network conditions |
| **Separate on-chain rules from operator preferences** | The supervisor may use local prechecks that are stricter than the bare on-chain minimum |
| **Do not infer mainnet policy from devnet defaults** | Current values are optimized for testing cadence and observability |

## 8. Practical checklist for reviewers

| Check | Expected interpretation |
|---|---|
| Mint and stake shown in UI | Must match configured mint and `stake_amount` |
| Sweep attempted before grace | Must fail on-chain (`SweepTooEarly`) |
| Claim attempted on loss/no-reveal | Must fail (`NotWinner`) |
| Refund claimed while pulse is valid | Must fail (`RefundTooEarly` / pulse-set state) |
| OracleSet rotation | Must require admin path |
| Pulse with broken NIST chain | Must fail with `NistChainBroken` / `NistPrecommitmentBroken` |
| Pulse for a target a round was not created for | Must fail with `PulseIndexMismatch` |
| Round creation with non-canonical target | Must fail with `NonCanonicalTarget` |
