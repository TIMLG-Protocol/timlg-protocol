# Tokenomics and Settlement Routing

| Metadata | Reference |
|---|---|
| **Document ID** | TP-ECON-001 |
| **Revision** | 3.1 |
| **Subject** | TIMLG MVP economic rules |

This page documents the protocol's current economic behavior.
It is intentionally limited to **what the MVP settles today**, how fees are routed, and how future incentive layers
should be kept separate from the core round logic.

---

## Economic primitives

| Primitive | Current interpretation |
|---|---|
| **Stake amount** | Fixed per ticket, stored in base units (`u64`) |
| **TIMLG decimals** | `9` in the current mint configuration, so `1 TIMLG = 1_000_000_000` base units |
| **Round vault** | Token escrow and routing surface at round scope |
| **Reward minting** | Happens only on successful claim of a winning ticket |
| **Reward fee** | Applied to the winning reward if `reward_fee_bps > 0` |

!!! note "Base units first"
    The program reasons in base units. Any human-readable TIMLG amount shown in the UI is a presentation layer over the configured mint.

---

## Canonical settlement matrix

| Outcome | Condition | Token path | User consequence |
|---|---|---|---|
| **WIN** | Valid reveal and assigned bit matches the guess | Stake refund + reward mint on claim | Ticket becomes claimable |
| **LOSE** | Valid reveal and assigned bit does not match | Escrowed stake is burned during settlement | Terminal loss |
| **NO-REVEAL** | No valid reveal before deadline | Escrowed stake is burned during settlement | Terminal expiry |
| **REFUND** | Oracle failure path and refund gate becomes valid | Original stake is returned | Safety fallback |

---

## What is and is not part of core economics

| Included in core protocol economics | Explicitly outside core protocol economics |
|---|---|
| stake escrow | token distribution / vesting plan |
| burn of losses and no-reveals | exchange or liquidity strategy |
| reward mint on claim | marketing campaigns |
| fee on winning reward | future leaderboard or streak promotions |
| sweep / refund / ticket closure semantics | off-chain community incentives unless explicitly documented |

This distinction matters. It keeps the round logic auditable and prevents promotional incentives from being mistaken for base protocol behavior.

---

## Claim, sweep, and ticket closure

| Operation | What it does | What it does not do |
|---|---|---|
| **Claim** | Delivers stake refund + reward mint for a winning ticket | Does not close the ticket PDA |
| **Sweep** | Cleans up eligible unclaimed round-level balances after grace expiry | Does not retroactively mint a user's reward |
| **Close ticket** | Returns the ticket account's rent-exempt lamports to the owner | Does not change the economic outcome of the ticket |

---

## Supply intuition

For one ticket, the simplified token supply effect is:

| Outcome | Approximate supply effect |
|---|---|
| **WIN** | `+ stake_amount` reward minted on claim |
| **LOSE** | `- stake_amount` burned during settlement |
| **NO-REVEAL** | `- stake_amount` burned during settlement |
| **Unclaimed winner** | Less minting than the idealized fully-claimed case |

If revealed tickets are approximately unbiased around 50/50 and all winners claim, the expectation is near neutral.
If winners fail to claim, the system becomes more deflationary than the idealized fully-claimed case.

---

## Fee routing

| Fee surface | Current role |
|---|---|
| **Reward Fee Pool** | Receives the configured fee fraction of winning rewards |
| **Treasury SOL** | Receives service fees and selected lamport cleanup flows |

### Reward fee formula

```rust
let fee = reward_amount * reward_fee_bps / 10_000;
let net_reward = reward_amount - fee;
```

---

## Future incentive surfaces: streak rewards

Future streak-based prizes can be added without changing core round settlement.
That should be documented as a separate incentive layer with its own budget, ranking policy, and claim flow.

### Recommended boundary

| Layer | Recommended responsibility |
|---|---|
| **Core settlement** | Decides WIN / LOSE / NO-REVEAL / REFUND |
| **UserStats** | Supplies counters such as `current_streak` and `longest_streak` |
| **Leaderboard policy** | Defines ranking period, tie-breaks, and eligibility |
| **Prize distributor** | Makes streak rewards claimable from a dedicated budget |

### Why this separation is important

| Benefit | Explanation |
|---|---|
| Cleaner audits | Core settlement remains independent from campaign logic |
| Easier upgrades | Incentive modules can evolve without rewriting the base round model |
| Better user clarity | Users can distinguish protocol settlement from promotional rewards |
| Better treasury discipline | Prize budgets can be accounted for explicitly |

!!! warning "Do not mix layers"
    A future streak campaign should not silently change base ticket settlement rules.
    It should publish its own documentation, eligibility table, funding source, and claim behavior.

---

## What this page intentionally does not claim

- that streak rewards already exist in the MVP
- that `UserStats` alone is sufficient for dispute resolution without ticket-level verification
- that treasury balances should be interpreted as user prize balances unless explicitly documented
