# Parameters and Timing Mapping

| Document Control | Value |
|---|---|
| **Document ID** | TP-SPEC-005 |
| **Status** | Approved for Devnet MVP |
| **Purpose** | Consolidate the parameters that shape current protocol behavior |

This page groups the parameters that matter most when reading the current deployment. All timing values are enforced in **Solana slots**. Any wall-clock conversion shown by the UI is approximate.

## 1. Core configuration fields

| Field | Type | Current meaning |
|---|---|---|
| `timlg_mint` | Pubkey | Mint used for stake and reward accounting |
| `stake_amount` | `u64` | Required stake per ticket, in mint base units |
| `claim_grace_slots` | `u64` | Delay before unclaimed balances become sweep-eligible |
| `oracle_pubkey` | Pubkey | Authorized signer accepted by `set_pulse_signed` |
| `treasury_sol` | Pubkey / PDA | Lamport fee collection surface |
| `sol_service_fee_lamports` | `u64` | Optional per-ticket SOL fee |
| `reward_fee_bps` | `u16` / bps | Fee applied to winning reward at claim time |

## 2. Timing windows

| Window | Meaning | Operational effect |
|---|---|---|
| **Commit window** | Time during which commits are accepted | Late commits are rejected |
| **Reveal window** | Time during which valid reveals are accepted after pulse publication | Late reveals are rejected |
| **Claim grace** | Additional delay after settlement | Sweep cannot occur before it expires |
| **Refund timeout** | Delay after reveal deadline when no valid pulse exists | Enables refund path |
| **Late pulse safety buffer** | Minimum remaining room required for accepting a late pulse | Prevents a pulse from being accepted too close to reveal expiry |

## 3. Recommended interpretation rules

| Rule | Why it matters |
|---|---|
| **Read token values in base units first** | The program settles in base units, not UI-rounded amounts |
| **Treat wall-clock values as estimates** | Slot times vary across network conditions |
| **Separate on-chain rules from operator preferences** | The supervisor may use local prechecks that are stricter than the bare on-chain minimum |
| **Do not infer mainnet policy from devnet defaults** | Current values are optimized for testing cadence and observability |

## 4. Parameter categories

| Category | Examples |
|---|---|
| **Economic** | `stake_amount`, `reward_fee_bps`, `sol_service_fee_lamports` |
| **Oracle trust** | `oracle_pubkey` |
| **Lifecycle timing** | commit / reveal deadlines, `claim_grace_slots`, refund timeout |
| **Treasury routing** | reward fee pool, treasury SOL surface |

## 5. Practical checklist for reviewers

| Check | Expected interpretation |
|---|---|
| Mint and stake shown in UI | Must match configured mint and `stake_amount` |
| Sweep attempted before grace | Must fail on-chain |
| Claim attempted on loss/no-reveal | Must fail |
| Refund claimed while pulse is valid | Must fail |
| Oracle key rotation | Must require admin path |