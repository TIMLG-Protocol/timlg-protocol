# User Statistics

| Metadata | Reference |
|---|---|
| **Document ID** | TP-REFR-006 |
| **Status** | Canonical (Devnet MVP) |
| **Scope** | Per-user participation counters and streak tracking |

`UserStats` is the protocol account that aggregates a participant's long-lived activity counters.
It is not a reward account and it does not hold claimable funds. Its purpose is to provide a compact,
auditable summary of user activity that can be consumed by the web UI, analytics pipelines, and future
incentive modules.

!!! note "Current vs future scope"
    In the current MVP, `UserStats` is an **observability surface**.
    Future leaderboard or streak-based rewards should treat it as an **eligibility input**, not as a payout vault.

---

## Why this account exists

| Need | Why `UserStats` matters |
|---|---|
| Fast UI rendering | Avoids scanning every historical ticket to render wallet-level summary statistics. |
| Auditability | Makes user-level counters reproducible from protocol events and ticket state. |
| Future incentives | Provides a clean source for streak-based eligibility without overloading ticket accounts. |
| Operational clarity | Separates **user history** from **ticket settlement** and **treasury routing**. |

---

## PDA and ownership

| Item | Value |
|---|---|
| **Account name** | `UserStats` |
| **Seed pattern** | `[b"user_stats", Pubkey(user)]` |
| **Authority model** | Program-owned PDA |
| **One account per** | Wallet / participant |
| **Holds tokens?** | No |
| **Holds claimable rewards?** | No |

---

## Canonical counters

The exact struct may evolve by version, but the current documentation should be read with the following semantic model.

| Field / Metric | Meaning | When it changes | Notes |
|---|---|---|---|
| `games_played` | Total tickets accepted by the protocol for the user | Successful commit | Counts protocol participation, not only revealed tickets. |
| `games_won` | Tickets that revealed correctly and ended in WIN | Successful reveal classified as win | Does not imply the reward has already been claimed. |
| `games_lost` | Tickets that revealed incorrectly and ended in LOSE | Successful reveal classified as loss | Terminal economic path after settlement is burn. |
| `tickets_revealed` | Tickets successfully revealed | Successful reveal | Includes both wins and losses. |
| `tickets_claimed` | Winning tickets successfully claimed | Successful `claim_reward` | Claim is separate from reveal and settlement. |
| `tickets_swept` | Winning tickets later swept after grace expiry | Successful `sweep_unclaimed` affecting the user | Terminal path for an unclaimed winner. |
| `current_streak` | Current consecutive wins not yet interrupted by a non-win result | Updated after every terminal classification relevant to streak logic | Resets when the streak is broken. |
| `longest_streak` | Maximum historical consecutive wins | When `current_streak` exceeds prior maximum | Monotonic non-decreasing. |

!!! note "Interpretation"
    `games_won` and `games_lost` are **outcome counters**.
    `tickets_claimed` and `tickets_swept` are **post-settlement settlement-path counters**.
    They answer different questions and should not be merged in analytics.

---

## Update model

The table below describes the intended interpretation of the counters at protocol level.

| Lifecycle event | Played | Revealed | Outcome | Claimed | Swept | Streak |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Commit accepted** | +1 | — | — | — | — | — |
| **Reveal - WIN** | — | +1 | +1 (W) | — | — | inc [^1] |
| **Reveal - LOSE** | — | +1 | +1 (L) | — | — | rst [^2] |
| **Expired / No-reveal** | — | — | — | — | — | brk [^3] |
| **Claim successful** | — | — | — | +1 | — | — |
| **Sweep of winner** | — | — | — | — | +1 | — |
| **Refund path** | — | — | — | — | — | — |

[^1]: **inc**: Current streak increments; updates `longest_streak` if high score.
[^2]: **rst**: Current streak resets to zero.
[^3]: **brk**: Streak is interrupted/broken by protocol policy during expiry.

!!! warning "One source of truth per concern"
    Use tickets and rounds for **per-round settlement truth**.
    Use `UserStats` for **wallet-level aggregated counters**.
    Do not use `UserStats` as a substitute for ticket-level forensic analysis.

---

## Relationship to future streak rewards

TIMLG can support future reward programs for high streak participants, but that should be documented as a
separate incentive layer rather than mixed into the core settlement rules.

### Recommended model

| Layer | Purpose | Status |
|---|---|---|
| **Core protocol** | Commit, reveal, settle, claim, refund, sweep | Implemented |
| **UserStats** | Canonical counters and streak tracking | Implemented / documented surface |
| **Leaderboard service** | Rank wallets by an explicit policy (e.g. highest confirmed `longest_streak`) | Future |
| **Reward distributor** | Make streak prizes claimable from a dedicated budget and policy | Future |

### Design principle

A future streak reward should be determined by a documented policy such as:

| Policy input | Why it matters |
|---|---|
| `longest_streak` | Primary ranking signal for streak competitions |
| tie-break rule | Needed for deterministic results across equal streaks |
| measurement window | Prevents ambiguity between all-time and seasonal contests |
| eligibility filter | Prevents rewards being granted to excluded or incomplete records |
| dedicated budget source | Keeps reward campaigns separate from core round settlement |

### What not to do

| Anti-pattern | Why to avoid it |
|---|---|
| Pay streak prizes directly from round settlement logic | Mixes promotional incentives with core protocol economics. |
| Infer streaks by ad-hoc frontend logic only | Creates avoidable inconsistencies across clients. |
| Reuse user ticket rent or sweep residue as undocumented prize funding | Makes treasury behavior harder to audit. |

---

## Recommended documentation boundary

For a serious public documentation set, keep the message simple:

- `UserStats` is the canonical wallet-level statistics account.
- It supports UI summaries, analytics, and future streak-based campaigns.
- It does **not** change the current MVP settlement rules.
- Any future streak prize system must publish its own eligibility table, budget source, and claim flow.
