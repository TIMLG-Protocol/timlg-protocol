---
hide:
  - title
---

<div class="hero" markdown>
<div class="hero-content" markdown>
# TIMLG Protocol

**A verifiable, slot-bounded commit-reveal protocol on Solana.**

TIMLG couples deterministic on-chain settlement with a publicly verifiable 512-bit randomness pulse,
wallet-level statistics, and a documentation set designed for technical verification.

<div class="hero-buttons" markdown>
[Protocol Specification](protocol/overview.md){ .md-button .md-button--primary }
[Current Status](status/status.md){ .md-button }
[Devnet App](beta.md){ .md-button }
</div>
</div>
</div>

---

## Protocol snapshot

| Topic | Current Devnet MVP |
|---|---|
| **Randomness flow** | Commit window closes before the oracle pulse is published; the pulse is verified on-chain |
| **Outcome model** | WIN / LOSE / NO-REVEAL / REFUND |
| **Settlement rule** | WIN = claimable stake refund + reward mint; LOSE and NO-REVEAL = burn |
| **Oracle model** | OracleSet quorum (M-of-N Ed25519) with on-chain NIST chaining (`output_value` + precommitment) |
| **Round creation** | Permissionless, gated by an on-chain canonical-target rule |
| **Wallet analytics** | `UserStats` tracks cumulative counters and consecutive-win streaks |
| **Streak incentive** | `StreakLeaderboard` PDA + `claim_streak_jackpot` (active on-chain) |

---

## Verifiable surfaces today

| Surface | What a reviewer can check |
|---|---|
| **Lifecycle** | Commit → pulse → reveal → settle → claim / refund / sweep / close |
| **Economic routing** | Stake escrow, deflationary burn, reward mint, fee routing, treasury surfaces |
| **Account model** | PDAs for config, rounds, tickets, stats, vaults, treasuries, oracle set, leaderboard |
| **User history** | Wallet-level counters and consecutive-win streaks via `UserStats` |
| **Timing** | Slot-bound deadlines, grace windows, and refund timeouts |
| **Source code** | Anchor program, IDL, and TypeScript SDK at [`github.com/richarddmm/timlg-protocol`](https://github.com/richarddmm/timlg-protocol) |

---

## Recommended reading order

<div class="grid cards" markdown>

- **Protocol Overview**

    Architecture, lifecycle, oracle quorum boundaries, and treasury surfaces.

    [Open Overview](protocol/overview.md)

- **Oracle Trust Model**

    Quorum-based pulse acceptance, on-chain NIST chaining, and the recovery mode.

    [Read Oracle Trust](protocol/oracle_trust_model.md)

- **Settlement and Tokenomics**

    Outcome routing, burn logic, fee model, and the streak jackpot funding source.

    [Read Settlement Rules](protocol/settlement_rules.md)

- **User Statistics & Streak Jackpot**

    Wallet-level counters, streak rules, and the on-chain jackpot claim flow.

    [Open User Statistics](protocol/user_stats.md)

</div>

---

## Documentation policy

The site distinguishes clearly between:

- **implemented MVP behavior** (current Devnet deployment),
- **future hardening** (mainnet trajectory), and
- **explicit out-of-scope material** (privileged operational topology and key custody).

That distinction is deliberate. It keeps the protocol easier to review, easier to audit, and easier
to evolve without rewriting past claims.
