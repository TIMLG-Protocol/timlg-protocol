---
hide:
  - title
---

<div class="hero" markdown>
<div class="hero-content" markdown>
# TIMLG Protocol

**A verifiable, slot-bounded commit-reveal protocol on Solana.**

TIMLG couples deterministic on-chain settlement with a public randomness pulse, wallet-level statistics,
and a documentation set designed for technical verification.

<div class="hero-buttons" markdown>
[Protocol Specification](protocol/overview.md){ .md-button .md-button--primary }
[Current Status](status/status.md){ .md-button }
[Devnet Guide](devnet_guide.md){ .md-button }
</div>
</div>
</div>

---

## Protocol snapshot

| Topic | Current Devnet MVP |
|---|---|
| **Randomness flow** | Commit window closes before oracle pulse publication; pulse is verified on-chain |
| **Outcome model** | WIN / LOSE / NO-REVEAL / REFUND |
| **Settlement rule** | WIN = claimable refund + mint; LOSE and NO-REVEAL = burn |
| **Oracle model** | Single authorized signer in the current MVP |
| **Wallet analytics** | `UserStats` tracks cumulative counters and streaks |
| **Future incentive path** | Streak rewards can be layered on top of `UserStats` without changing core settlement |

---

## Why the documentation is structured this way

| Goal | Documentation response |
|---|---|
| Easy protocol review | Core rules are concentrated in protocol pages, not scattered across marketing copy |
| Fast technical scanning | Tables summarize parameters, routing, and account surfaces |
| Separation of concerns | Current MVP behavior is separated from future hardening and future incentive campaigns |
| Strong auditability | Ticket-level and wallet-level surfaces are documented independently |

---

## What can be verified today

| Surface | What a reviewer can check |
|---|---|
| **Lifecycle** | Commit → pulse → reveal → settle → claim / refund / sweep |
| **Economic routing** | Burn paths, claim path, reward fee routing |
| **Account model** | PDAs for config, rounds, tickets, stats, vaults, and treasuries |
| **User history** | Wallet-level counters and streaks via `UserStats` |
| **Timing** | Slot-bound deadlines and grace windows |

---

## Recommended reading order

<div class="grid cards" markdown>

- **Protocol Overview**

  Architecture, lifecycle, current boundaries, and treasury surfaces.

  [Open Overview](protocol/overview.md)

- **Settlement and Tokenomics**

  Outcome routing, burn logic, fee model, and the boundary for future incentive campaigns.

  [Read Settlement Rules](protocol/settlement_rules.md)

- **User Statistics**

  Canonical description of wallet-level counters and streak tracking.

  [Open User Statistics](protocol/user_stats.md)

- **PDAs and Accounts**

  Program-owned surfaces, derivation patterns, and operational roles.

  [Open PDA Reference](protocol/pdas_and_accounts.md)

</div>

---

## Documentation policy

The site distinguishes clearly between:

- **implemented MVP behavior**,
- **future hardening**, and
- **future incentive layers**.

That distinction is deliberate. It keeps the protocol easier to review, easier to audit, and easier to evolve without rewriting past claims.
