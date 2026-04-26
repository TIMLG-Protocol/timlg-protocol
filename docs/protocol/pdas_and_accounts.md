# PDAs and Accounts

| Metadata | Specification |
|---|---|
| **Document ID** | TP-REFR-001 |
| **Status** | Canonical (Devnet MVP) |
| **Scope** | Program-derived accounts and treasury surfaces |

This page describes the program-owned account surfaces used by the TIMLG MVP.
It is intentionally focused on **what each account is for**, **how it is derived**, and **how it should be read**.

---

## Global accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Config** | `[b"config_v3"]` | Global protocol settings, authorities, NIST chaining anchor, recovery state | No |
| **Tokenomics** | `[b"tokenomics_v3"]` | Fee parameters and treasury routing configuration | No |
| **OracleSet** | `[b"oracle_set_v3"]` | Allowlist of oracle public keys plus quorum threshold | No |
| **RoundRegistry** | `[b"round_registry_v3"]` | Global round indexing, `next_round_id`, and `last_created_target` | No |
| **GlobalStats** | `[b"global_stats"]` | Aggregated protocol-level counters | No |
| **StreakLeaderboard** | `[b"streak_leaderboard_v1"]` | Singleton record of the global streak record holder | No |

---

## Round-scoped accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Round** | `[b"round_v3", u64_le(round_id)]` | Canonical timing, pulse, and settlement state for one round; carries `kind` (Betting / Continuity) | No |
| **RoundTargetRecord** | `[b"round_target_v1", u64_le(pulse_index_target)]` | One-shot dedup record per NIST target — prevents two rounds racing for the same target | No |
| **Round Vault (SPL)** | `[b"vault", round_pda]` | Round-level SPL token escrow and post-settlement routing | Yes |
| **TIMLG Vault (SPL)** | `[b"timlg_vault_v3", round_pda]` | Round-level TIMLG settlement vault | Yes |

---

## User-scoped accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Ticket** | `[b"ticket_v3", u64_le(round_id), Pubkey(user), u64_le(nonce)]` | One participation record: commitment, reveal proof, outcome, claim state, and `user_commit_index` | No |
| **UserStats** | `[b"user_stats_v3", Pubkey(user)]` | Wallet-level counters, current/longest streak, and `refunded_in_streak_window` | No |
| **UserEscrow** | `[b"user_escrow_v3", Pubkey(user)]` | Optional balance surface for pre-funded / batched / relayed flows | Yes, if enabled |

!!! note "Why `UserStats` deserves its own line"
    `UserStats` is not cosmetic metadata. It is the canonical summary surface for participation
    counters and streak tracking, and it is the eligibility input for the on-chain Streak Jackpot
    (see [Streak Jackpot](streak_jackpot.md)).

---

## Oracle attestation accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **OracleAttestationRecord** | `[b"oracle_att_v3", u64_le(round_id), Pubkey(oracle)]` | One-shot pulse attestation per (round, oracle); stores the oracle's signature and the NIST `output_value` | No |
| **OracleAnchorAttestationRecord** | `[b"oracle_anchor_att_v3", u64_le(pulse_index), Pubkey(oracle)]` | One-shot anchor attestation per (pulse_index, oracle); stores the signature, `output_value`, and `precommitment_value` | No |

These two account families form the "Attestation Board": any actor can read them, assemble a
threshold of signatures, and submit `set_pulse_quorum` or `install_nist_anchor_quorum`. No
intermediary is privileged.

---

## Treasury and fee surfaces

| Account / Surface | Seed pattern or identifier | Purpose |
|---|---|---|
| **Reward Fee Pool (SPL)** | `[b"reward_fee_pool_v3"]` | Receives the protocol fee applied to winning rewards |
| **Treasury SPL (TIMLG)** | `[b"treasury_v3"]` | Receives swept residual TIMLG after grace expiry |
| **Treasury SOL** | `[b"treasury_sol_v3"]` | Receives `sol_service_fee_lamports` per ticket — funds the Streak Jackpot |

---

## Reading guidance

| If you want to know... | Read... |
|---|---|
| Who controls protocol-wide runtime behavior | `Config` |
| Which oracles are accepted and what threshold is needed | `OracleSet` |
| How fees are configured | `Tokenomics` |
| What happened in a specific round | `Round` + round logs |
| Whether a pulse target is already locked | `RoundTargetRecord` |
| What happened to one specific ticket | `Ticket` |
| A wallet's cumulative performance and streaks | `UserStats` |
| Who currently holds the streak record (and what jackpot is queued) | `StreakLeaderboard` + `Treasury SOL` balance |
| Which oracles have already attested a given round/anchor | `OracleAttestationRecord` / `OracleAnchorAttestationRecord` |
| Whether funds are still escrowed at round level | `Round Vault` / `TIMLG Vault` |

---

## Relationship between tickets, user statistics, and the leaderboard

| Surface | Granularity | Main question it answers |
|---|---|---|
| **Ticket** | Per participation | "What happened to this exact ticket?" |
| **UserStats** | Per wallet | "What is this participant's cumulative history and current streak?" |
| **StreakLeaderboard** | Global | "Who currently holds the all-time on-chain streak record?" |

This separation is deliberate. The protocol never requires an analytics client to scan an entire
ticket history just to render high-level wallet counters or evaluate jackpot eligibility — yet
ticket-level truth remains available for full forensic verification.
