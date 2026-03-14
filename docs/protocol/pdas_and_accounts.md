# PDAs and Accounts

| Metadata | Specification |
|---|---|
| **Document ID** | TP-REFR-001 |
| **Status** | Canonical (Devnet MVP) |
| **Scope** | Program-derived accounts and treasury surfaces |

This page describes the main program-owned account surfaces used by the TIMLG MVP.
It is intentionally focused on **what each account is for**, **how it is derived**, and **how it should be read**.

---

## Global accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Config** | `[b"config_v3"]` | Global protocol settings, authorities, and runtime guardrails | No |
| **Tokenomics** | `[b"tokenomics_v3"]` | Fee parameters and treasury routing configuration | No |
| **RoundRegistry** | `[b"registry_v3"]` | Global round indexing and synchronization state | No |

---

## Round-scoped accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Round** | `[b"round_v3", u64_le(round_id)]` | Canonical timing, pulse, and settlement state for one round | No |
| **Round Vault (SPL)** | `[b"vault", round_pda]` | Round-level token escrow and post-settlement token routing surface | Yes |

---

## User-scoped accounts

| Account | Seed pattern | Operational role | Holds funds? |
|---|---|---|---|
| **Ticket** | `[b"ticket_v3", u64_le(round_id), Pubkey(user), u64_le(nonce)]` | One participation record: commitment, reveal proof, outcome, and claim state | No |
| **UserStats** | `[b"user_stats", Pubkey(user)]` | Aggregated wallet-level counters and streak tracking | No |
| **UserEscrow** | `[b"escrow", Pubkey(user)]` | Optional balance surface for pre-funded / batched / relayed flows | Yes, if enabled |

!!! note "Why `UserStats` deserves its own line"
    `UserStats` is not cosmetic metadata. It is the canonical summary surface for participation counters and streak tracking,
    and it is the correct integration point for future leaderboard or streak-based reward systems.

---

## Treasury and fee surfaces

| Account / Surface | Seed pattern or identifier | Purpose |
|---|---|---|
| **Reward Fee Pool** | `[b"reward_pool"]` | Receives the protocol fee applied to winning rewards |
| **Treasury SOL** | `[b"treasury_sol"]` | Lamport collection surface for service fees and selected cleanup flows |

---

## Reading guidance

| If you want to know... | Read... |
|---|---|
| Who controls protocol-wide runtime behavior | `Config` |
| How fees are configured | `Tokenomics` |
| What happened in a specific round | `Round` + round logs |
| What happened to one specific ticket | `Ticket` |
| A wallet's cumulative performance and streaks | `UserStats` |
| Whether funds are still escrowed at round level | `Round Vault` |

---

## Relationship between tickets and user statistics

| Surface | Granularity | Main question it answers |
|---|---|---|
| **Ticket** | Per participation | "What happened to this exact ticket?" |
| **UserStats** | Per wallet | "What is this participant's cumulative history?" |

This separation is deliberate.
The protocol should never require an analytics client to scan an entire ticket history just to render high-level wallet counters.
At the same time, ticket-level truth remains available for full forensic verification.
