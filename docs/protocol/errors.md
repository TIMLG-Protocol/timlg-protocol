# Technical Reference: Error Code Taxonomy

| Metadata | Specification |
|---|---|
| **Document ID** | TP-REFR-004 |
| **Category** | Exception Codes & Failure Modes |
| **Last updated** | April 2026 |

The TIMLG Protocol uses Anchor `#[error_code]` enums to signal failure conditions. The list below
covers the errors users, operators, and reviewers encounter most often. The full enum lives in
`programs/timlg_protocol/src/errors.rs` in the public code repository.

## 1. Lifecycle and timing

| Error Code | Description |
|---|---|
| `CommitClosed` | Attempted to commit a ticket after `commit_deadline_slot` |
| `CommitAfterPulseSet` | Commit rejected because the pulse for the round is already set |
| `RevealPhaseNotOpen` | Attempted to reveal before the oracle pulse has been published |
| `RevealClosed` | Attempted to reveal after `reveal_deadline_slot` |
| `PulseNotSet` | Operation requires the round pulse to be set |
| `PulseAlreadySet` | Pulse for the round is already set (idempotent retry by supervisors) |
| `PulseTooLate` | Late pulse rejected because too few slots remain before reveal expiry |
| `SweepTooEarly` | Sweep attempted before `claim_grace_slots` elapsed |
| `AlreadySwept` | Sweep already executed for the round |
| `ClaimAfterSweep` | Cannot claim a reward once the round is swept |
| `RoundNotSettled` | Operation requires `settle_round_tokens` to have run |
| `SettleTooEarly` | Settlement attempted before reveal window closed |
| `RoundTokensAlreadySettled` | Token settlement already complete for the round |
| `RefundTooEarly` | Refund path is not yet open (no pulse and `REFUND_TIMEOUT_SLOTS` not elapsed) |
| `ClaimWindowClosed` | Claim window expired |
| `ContinuityRoundNoCommit` | Continuity-kind rounds reject commits and reveals |

## 2. Commit / reveal correctness

| Error Code | Description |
|---|---|
| `InvalidCommitment` / `CommitmentMismatch` | Reveal `(guess, salt)` does not hash to the on-chain commitment |
| `InvalidGuess` | Guess byte must be 0 or 1 |
| `BitIndexMismatch` | The bit index recorded at commit does not match the recomputed value |
| `AlreadyRevealed` | Ticket has already been revealed |
| `TooManyEntries` | Batch instruction received more entries than `MAX_BATCH` |
| `TicketAlreadyExists` | Commit attempted with a `nonce` already in use |
| `StakeAlreadyPaid` | Ticket stake was already moved to the round vault |
| `StakeNotPaid` | Ticket cannot proceed because stake was not escrowed |

## 3. Oracle and quorum

| Error Code | Description |
|---|---|
| `MissingOrInvalidEd25519Ix` | Transaction missing or has an invalid Ed25519 verify instruction |
| `Ed25519PubkeyMismatch` | Signed pulse does not come from the expected oracle |
| `Ed25519MessageMismatch` | The Ed25519 message bytes do not match the canonical envelope |
| `OracleNotSet` | Single-signer oracle pubkey is not configured |
| `LegacyModeDisabled` | Single-signer pulse path is disabled for betting rounds (use quorum) |
| `QuorumRequired` | Operation requires a multi-oracle quorum signature set |
| `QuorumBelowThreshold` | Fewer signatures than `OracleSet.threshold` |
| `DuplicateQuorumSigner` | Two signatures came from the same oracle |
| `QuorumSignerNotAllowed` | Signer is not in `OracleSet` |
| `OracleSetFull` / `OracleNotFound` / `OracleAlreadyExists` | OracleSet management constraints |
| `InvalidThreshold` / `ThresholdExceedsOracleCount` | Threshold value violates set size |
| `InvalidQuorumSignatureOrdering` | Quorum signatures must be sorted by signer pubkey |
| `MissingQuorumEd25519Instructions` | Quorum tx missing the required Ed25519 verify instructions |
| `AnchorQuorumRequired` | Anchor recovery path requires the quorum variant |
| `AllOracleSignaturesRequired` | Strict mode demands signatures from every authorized oracle |

## 4. NIST chaining and pulse sequencing

| Error Code | Description |
|---|---|
| `NistChainBroken` | New pulse's `previous_output_value` does not match `Config.last_output_value` |
| `NistPrecommitmentBroken` | `SHA-512(output_value)` does not match `Config.last_precommitment_value` |
| `PulseIndexMismatch` | Pulse `pulse_index` does not equal the round's `pulse_index_target` |
| `NonSequentialPulse` | Pulse target is not exactly `LFP + 1` (outside recovery) |
| `PulseAlreadyPublished` | NIST pulse for this index was already accepted on-chain |
| `NistAnchorMissing` | NIST anchor (`latest_pulse_timestamp`) is missing in `Config` |

## 5. Round creation and registry

| Error Code | Description |
|---|---|
| `NonCanonicalTarget` | `requested_target` is not `max(last_created_target + 1, LFP + min_future_pulses)` |
| `ContinuityPrematureTarget` | Continuity fallback used too early (NIST has not published the target yet) |
| `TargetAlreadyCreated` | A round for this `pulse_index_target` was already created |
| `CommitTargetAlreadyKnown` | Cannot create a betting round for a pulse whose value is already known |
| `PulseTooClose` / `PulseTooFar` / `PulseIndexNotFuture` | Target is outside the `[min_future_pulses, max_future_pulses]` window |

## 6. Recovery mode

| Error Code | Description |
|---|---|
| `RecoveryProofInvalid` | `enter_recovery_mode` requires a real pending Round at `recovery_target` |
| `NoSequenceGap` | Recovery refused because there is no actual LFP gap |
| `RecoveryNotActive` | Tried to install an anchor outside recovery mode |
| `RecoveryAlreadyActive` | Recovery mode is already active — call `exit_recovery_mode` first |
| `RecoveryWouldNotAdvance` | Anchor pulse_index does not advance LFP |
| `RecoveryTargetMismatch` | Anchor pulse_index does not match `Config.recovery_target_pulse` |
| `RecoveryExitNotJustified` | Permissionless exit refused: LFP has not reached the target and timeout has not elapsed |
| `PulseIndexNotNext` | Outside recovery, anchor must target exactly `LFP + 1` |

## 7. Streak Jackpot

| Error Code | Description |
|---|---|
| `StreakDoesNotBeatRecord` | `user_stats.current_streak <= leaderboard.record_streak` — claim rejected |
| `JackpotEmpty` | Treasury SOL has no lamports above the rent-exempt minimum |
| `LeaderboardNotInitialized` | Admin has not yet called `initialize_streak_leaderboard` |

## 8. Treasury and parameter caps

| Error Code | Description |
|---|---|
| `StakeAmountTooHigh` | Stake exceeds `MAX_STAKE_AMOUNT` |
| `CommitWindowTooLong` / `RevealWindowTooLong` / `OracleWindowTooLong` | Window exceeds the corresponding cap |
| `FeeBpsTooHigh` | `reward_fee_bps` exceeds `MAX_REWARD_FEE_BPS` |
| `TreasuryWithdrawBlocked` | Treasury withdrawal blocked by active rounds with unclaimed winners |

## 9. Common environment / wallet errors

| Error Code | Description |
|---|---|
| `Unauthorized` | Signer does not own the account it is acting on |
| `Paused` | Protocol is paused |
| `TIMLGMintMismatch` | Provided mint does not match `Config.timlg_mint` |
| `InvalidUserTIMLGAta` | The user TIMLG token account is not derivable from the user's wallet |
| `InsufficientFunds` | The user's wallet does not have enough TIMLG or SOL |
| `MathOverflow` | Arithmetic overflow protected by `checked_*` |

## 10. Reference

For the complete enum (all variants and discriminants), see:

> [`programs/timlg_protocol/src/errors.rs`](https://github.com/richarddmm/timlg-protocol/blob/main/programs/timlg_protocol/src/errors.rs)
