# Treasury Surfaces and BitIndex

| Document Control | Value |
|---|---|
| **Document ID** | TP-SPEC-004 |
| **Status** | Approved for Devnet MVP |
| **Purpose** | Explain treasury-related account surfaces and current bitIndex derivation |

This page groups two topics that are frequently misunderstood: where protocol-controlled balances live, and how a ticket's target bit is assigned.

## 1. Treasury-related account surfaces

| Surface | Current role | Notes |
|---|---|---|
| **Round vault** | Holds round stake liquidity and settlement funds | Round-scoped, not a treasury account |
| **Reward fee pool** | Receives the claim-time reward fee in TIMLG | SPL token account derived from tokenomics state |
| **Treasury SOL PDA** | Collects configured SOL service fees and treasury-side lamport flows | Lamport-focused account surface |
| **Sweep path** | Post-grace cleanup of residual round balances | Cleanup mechanism, not a normal payout path |

!!! note "What treasury does not mean in this MVP"
    Treasury is not the source of normal winner payouts, and it is not where no-reveal stake is routed. In the current MVP, no-reveal stake is burned.

## 2. Current bit assignment model

Each ticket is assigned one bit position in the 512-bit pulse. The outcome depends on comparing the user's revealed guess against that assigned bit.

| Property | Current behavior |
|---|---|
| **Bit space** | `0..511` |
| **Determinism** | Same inputs always produce the same bit index |
| **Public reproducibility** | Off-chain tools can recompute the same index from ticket inputs |
| **Purpose** | Spread tickets across the pulse without user-chosen target bits |

## 3. Current derivation inputs

| Input | Included in current implementation? |
|---|---|
| `round_id` | Yes |
| `user pubkey` | Yes |
| `nonce` | Yes |
| prior public randomness seed | No, not in the current canonical derivation |

The current documentation and clients should therefore describe the bitIndex as **deterministic from round ID, user, and nonce**. Any future move to a seed-anchored derivation should be versioned explicitly.

## 4. Why bitIndex matters

| Benefit | Explanation |
|---|---|
| **Auditability** | Independent tools can recompute the bit index for any ticket |
| **Operational simplicity** | The client does not need a separate target-bit selection flow |
| **Uniform interface** | Every ticket follows the same reveal and outcome logic |

## 5. Future hardening possibilities

| Candidate change | Why it might be considered |
|---|---|
| Prior public seed in derivation | Stronger pre-round anchoring and anti-grinding properties |
| Versioned derivation domains | Safer migrations without ambiguity for indexers |
| Expanded public verification utilities | Easier external recomputation and audit tooling |
