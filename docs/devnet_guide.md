# TIMLG Protocol — Devnet Guide

This guide explains the user-visible flow of the current Devnet MVP.
It focuses on what a technically literate participant needs to understand the interface, the ticket lifecycle,
and the wallet-level statistics shown by the application.

!!! info "Devnet only"
    Devnet tokens and balances are for protocol testing. They do not represent production value.

---

## Prerequisites

| Requirement | Why it is needed |
|---|---|
| **SOL** | Network transaction fees |
| **TIMLG** | Ticket stake |
| **Connected wallet** | Ticket ownership, claims, and ticket closure |

---

## Round flow in one table

| Phase | What the user sees | What the protocol is doing |
|---|---|---|
| **Commit** | Play card accepts a ticket | Stake is escrowed and a ticket PDA is created |
| **Waiting pulse** | Ticket is pending | Commit window is closed; oracle pulse is not yet set |
| **Reveal** | Reveal actions become available | Commitment is checked and the result is classified |
| **Settlement** | Outcome becomes final / claimable | Losers and no-reveals are burned; winners await claim |
| **Claim / close** | Winner claims; user later closes ticket | Reward is delivered, then ticket rent can be recovered |

---

## Ticket panel: fields worth understanding

| UI field | Meaning |
|---|---|
| **Round ID** | The target round for the ticket |
| **Assigned Bit** | Deterministic bit index used to evaluate the ticket |
| **Stake** | TIMLG amount escrowed for this ticket |
| **Nonce** | Per-ticket uniqueness input |
| **Commitment** | Hash of hidden guess + salt |
| **Ticket address** | The PDA representing this participation |

---

## Order-history status interpretation

| Status | Meaning | Economic consequence |
|---|---|---|
| **PENDING** | Ticket committed; waiting for pulse | Stake escrowed |
| **REVEAL OPEN / REVEAL NOW** | User can reveal | No final outcome yet |
| **WIN** | Correct reveal | Becomes claimable after settlement |
| **LOSS / BURN LOSS** | Incorrect reveal | Stake burned |
| **EXPIRED / BURN EXPIRED** | Reveal missed or invalid | Stake burned |
| **CLAIMED** | Winning ticket successfully claimed | Settlement completed for the ticket |
| **SWEPT** | Winning ticket was not claimed in time | Terminal; prize no longer claimable |
| **REFUNDED** | Oracle-failure refund path used | Original stake returned |

---

## Wallet statistics (`UserStats`)

The wallet view should be read as an aggregated summary, not as a replacement for ticket-level inspection.

| Metric | What it tells you |
|---|---|
| **Total / Played** | How many tickets the wallet committed |
| **Won / Lost** | Classified revealed outcomes |
| **Revealed** | Tickets successfully revealed |
| **Refunded** | Tickets that exited through the refund path (does not break the streak) |
| **Claimed** | Winning tickets already claimed |
| **Current streak** | Current consecutive-win run — drives jackpot eligibility |
| **Max streak** | Best historical consecutive-win run (personal record) |

For the protocol-level reference, see [User Statistics](protocol/user_stats.md).

---

## Streak Jackpot

`current_streak` and `max_streak` are part of the wallet summary and now feed a **live on-chain
reward**: the **Streak Jackpot**.

| Concept | Meaning |
|---|---|
| **Pool** | The `Treasury SOL` PDA, fed by the per-ticket SOL service fee |
| **Eligibility** | Your `current_streak` strictly greater than the global `record_streak` shown by the protocol |
| **Claim** | A user-signed `claim_streak_jackpot` transaction transfers the pool (minus rent-exempt) to your wallet |
| **Effect on your stats** | `current_streak` is reset to 0 after a successful claim; `max_streak` is preserved |

For the full mechanic, anti-grinding properties, and audit counters, see
[Streak Jackpot](protocol/streak_jackpot.md).

!!! note "Refunds do not break the streak"
    A refund caused by an oracle outage (round without a pulse) is treated as a legitimate hop and
    does not reset your streak. A revealed loss does.

---

## Common confusion points

| Question | Correct interpretation |
|---|---|
| "I won, why do I still need another action?" | Reveal and claim are separate steps. Winning becomes claimable after settlement. |
| "Why do I still see a ticket after claiming?" | Claim does not close the ticket PDA. `close_ticket` recovers rent separately. |
| "Does sweep mean treasury stole my reward?" | Sweep is the documented post-grace terminal path for an unclaimed winner. |
| "Are wallet statistics the same as treasury balances?" | No. `UserStats` summarizes activity; it does not hold user funds. |

---

## Reading analytics correctly

| Surface | Best use |
|---|---|
| **Order History** | Inspect exact ticket lifecycle and terminal state |
| **Wallet statistics** | Read cumulative participation and streaks |
| **Protocol docs** | Understand the canonical rules behind both |
