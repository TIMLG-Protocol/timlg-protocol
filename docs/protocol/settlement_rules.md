# Settlement Rules

| Document Control | Value |
|---|---|
| **Document ID** | TP-ECON-002 |
| **Status** | Approved for Devnet MVP |
| **Purpose** | Define terminal ticket outcomes and state transitions |

Settlement is the stage where ticket states become economically final. This page describes which outcomes exist, what triggers them, and which instructions are involved.

## 1. Terminal paths per ticket

Each ticket must end in exactly one economic path.

| Terminal path | Eligibility | User result | Protocol action |
|---|---|---|---|
| **WIN → CLAIMABLE** | Revealed and matches assigned bit | Winner can claim | Ticket is marked as winning; reward becomes claimable |
| **LOSE** | Revealed and does not match | No payout | Stake burned during settlement |
| **NO-REVEAL** | Reveal missing or invalid by deadline | No payout | Stake burned during settlement |
| **REFUND** | No valid pulse and refund timeout conditions are satisfied | Stake recovered | Stake returned through refund path |
| **SWEEPED WINNER** | Winner was never claimed before claim grace elapsed | Prize forfeited | Remaining round balance may be swept |

## 2. Settlement pipeline

| Stage | Main instruction | What it does |
|---|---|---|
| **Pulse available** | `set_pulse_signed` | Makes reveal phase possible |
| **Optional explicit finalization** | `finalize_round` | Admin-gated explicit transition to finalized state |
| **Token settlement** | `settle_round_tokens` | May auto-finalize if conditions are met; classifies and burns non-winning tickets |
| **Winner payout** | `claim_reward` | Refunds stake and mints reward |
| **Timeout recovery** | `recover_funds` / `recover_funds_anyone` | Returns stake when refund path is valid |
| **Post-grace cleanup** | `sweep_unclaimed` | Cleans up unclaimed residue after grace period |

## 3. Decision table

| Ticket state before settlement | Pulse set? | Reveal present? | Match? | Result |
|---|---|---|---|---|
| Pending | No | No | N/A | Still pending until refund conditions become true |
| Pending | Yes | No | N/A | NO-REVEAL after reveal deadline and settlement |
| Revealed | Yes | Yes | Yes | WIN |
| Revealed | Yes | Yes | No | LOSE |
| Pending / unrevealed | No | No | N/A | REFUND only when refund timeout conditions are met |

## 4. Claim, refund, and sweep are different operations

| Operation | Who triggers it | When allowed | What it does not do |
|---|---|---|---|
| **Claim** | Winner or authorized client acting for winner | After ticket is in claimable winning state | Does not close the ticket rent account |
| **Refund** | Owner or anyone through the permissionless refund path | Only after refund timeout conditions are met | Does not mint rewards |
| **Sweep** | Authorized cleanup path | Only after `claim_grace_slots` has elapsed | Does not recreate claim rights for users |
| **close_ticket** | Ticket owner | After ticket is fully resolved | Does not transfer reward or stake |

## 5. Normative rules

| Rule | Meaning |
|---|---|
| **Settlement never invents new outcomes** | Every ticket resolves to one of the terminal paths listed above |
| **No late reveal recovery** | Missing the reveal deadline does not convert into a normal refund |
| **Burn is final for non-winning stake** | LOSE and NO-REVEAL do not remain claimable |
| **Refund exists only for oracle failure / pulse absence path** | Refund is not a general fallback for late users |
| **Sweep is delayed by on-chain grace** | Cleanup cannot preempt the configured claim window |

## 6. Typical audit checks

| Check | Expected result |
|---|---|
| `wins + losses == revealed` | True for fully classified revealed tickets |
| `total - revealed - refunded == pending/unresolved` | True while some tickets remain unresolved |
| Winner claimed twice | Must be impossible |
| Sweep before grace | Must be rejected |
| Unrevealed ticket paid as winner | Must be impossible |
