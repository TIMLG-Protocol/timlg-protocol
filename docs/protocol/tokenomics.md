# Tokenomics and Settlement Routing

| Metadata | Reference |
|---|---|
| **Document ID** | TP-ECON-001 |
| **Revision** | 4.0 (April 2026) |
| **Subject** | TIMLG MVP economic rules |

This page documents the protocol's current economic behavior. It covers what the MVP settles today,
how fees are routed, and how the streak jackpot funds itself.

---

## Economic primitives

| Primitive | Current interpretation |
|---|---|
| **Stake amount** | Fixed per ticket, stored in base units (`u64`) |
| **TIMLG decimals** | `9` in the current mint configuration, so `1 TIMLG = 1_000_000_000` base units |
| **Round vault** | Token escrow and routing surface at round scope |
| **Reward minting** | Happens only on successful claim of a winning ticket |
| **Reward fee** | Applied to the winning reward if `reward_fee_bps > 0` |
| **SOL service fee** | `sol_service_fee_lamports` charged at commit and accumulated in `Treasury SOL`; funds the streak jackpot |

!!! note "Base units first"
    The program reasons in base units. Any human-readable TIMLG amount shown in the UI is a
    presentation layer over the configured mint.

---

## Canonical settlement matrix

| Outcome | Condition | Token path | User consequence |
|---|---|---|---|
| **WIN** | Valid reveal and assigned bit matches the guess | Stake refund + reward mint on claim | Ticket becomes claimable |
| **LOSE** | Valid reveal and assigned bit does not match | Escrowed stake is burned during settlement | Terminal loss |
| **NO-REVEAL** | No valid reveal before deadline | Escrowed stake is burned during settlement | Terminal expiry |
| **REFUND** | Oracle failure path and refund gate becomes valid | Original stake is returned | Safety fallback (does not break the streak — see [User Statistics](user_stats.md)) |

---

## What is and is not part of core settlement economics

| Included in core settlement economics | Not part of core settlement economics |
|---|---|
| stake escrow | token distribution / vesting plan |
| burn of losses and no-reveals | exchange or liquidity strategy |
| reward mint on claim | marketing campaigns |
| reward fee on winning reward | future cross-chain bridges |
| `sol_service_fee_lamports` collection | off-chain community incentives unless explicitly documented |
| streak jackpot funding (lamports flow only) | off-chain promotional rewards |
| sweep / refund / ticket closure semantics | |

The Streak Jackpot is part of the protocol's economic surface, but its **claim** is a separate
user-domain instruction (`claim_streak_jackpot`) and does not alter ticket-level settlement.

---

## Claim, sweep, and ticket closure

| Operation | What it does | What it does not do |
|---|---|---|
| **Claim** | Delivers stake refund + reward mint for a winning ticket | Does not close the ticket PDA |
| **Sweep** | Cleans up eligible unclaimed round-level balances after grace expiry | Does not retroactively mint a user's reward |
| **Close ticket** | Returns the ticket account's rent-exempt lamports to the owner | Does not change the economic outcome of the ticket |
| **Streak jackpot claim** | Transfers the entire `Treasury SOL` balance (above rent-exempt) to the eligible user | Does not change ticket settlement, does not reset `longest_streak` |

---

## Supply intuition

For one ticket, the simplified TIMLG token supply effect is:

| Outcome | Approximate supply effect |
|---|---|
| **WIN** | `+ stake_amount` reward minted on claim |
| **LOSE** | `- stake_amount` burned during settlement |
| **NO-REVEAL** | `- stake_amount` burned during settlement |
| **Unclaimed winner** | Less minting than the idealized fully-claimed case |

If revealed tickets are approximately unbiased around 50/50 and all winners claim, the expectation is
near neutral. If winners fail to claim, the system becomes more deflationary than the idealized
fully-claimed case.

---

## Fee routing

| Fee surface | Current role |
|---|---|
| **Reward Fee Pool (SPL)** | Receives `reward_fee_bps` of each winning reward |
| **Treasury SPL (TIMLG)** | Receives swept residual TIMLG after grace expiry |
| **Treasury SOL** | Receives `sol_service_fee_lamports` per ticket — actively funds the streak jackpot |

### Reward fee formula

```rust
let fee = reward_amount * reward_fee_bps / 10_000;
let net_reward = reward_amount - fee;
```

`reward_fee_bps` is hard-capped at `MAX_REWARD_FEE_BPS = 5_000` (50 %).

### SOL service fee path

```text
commit_ticket / commit_batch / commit_batch_signed
    → transfer(user → Treasury SOL, sol_service_fee_lamports)

claim_streak_jackpot
    → transfer(Treasury SOL → eligible user, all lamports above rent-exempt minimum)
```

---

## Streak Jackpot (active incentive layer)

The Streak Jackpot is a **live** incentive layer that funds itself from the SOL service fee and pays
out to whoever breaks the on-chain streak record.

| Surface | Role |
|---|---|
| `sol_service_fee_lamports` (Config) | Per-ticket SOL fee — the only funding source |
| `Treasury SOL` PDA | Holds the accumulating jackpot pool |
| `StreakLeaderboard` PDA | Stores the current `record_streak`, `record_holder`, and audit counters |
| `UserStats.current_streak` | Drives eligibility (`current_streak > record_streak`) |
| `claim_streak_jackpot` | User-domain instruction; transfers the full pool minus rent-exempt to the user, updates the leaderboard, and resets `current_streak` to 0 |

See [Streak Jackpot](streak_jackpot.md) for the full design, anti-grinding properties, and audit
counters.

!!! warning "Boundary still applies"
    The Streak Jackpot is a separate instruction with its own validation surface. It does **not**
    change the ticket settlement matrix. A future seasonal or leaderboard layer would also have to
    publish its own funding source, eligibility table, and claim flow rather than being silently
    grafted onto core settlement.

---

## What this page intentionally does not claim

- That treasury TIMLG balances should be interpreted as user prize balances
- That `UserStats` alone is sufficient for dispute resolution without ticket-level verification
- That the SOL service fee is anything other than the funding source for the streak jackpot
