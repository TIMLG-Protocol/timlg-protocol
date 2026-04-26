# User Statistics

| Metadata | Reference |
|---|---|
| **Document ID** | TP-REFR-006 |
| **Status** | Canonical (Devnet MVP) |
| **Scope** | Per-user participation counters, streak tracking, and jackpot eligibility |

`UserStats` is the protocol account that aggregates a participant's long-lived activity counters and
serves as the eligibility input for the on-chain Streak Jackpot. It is **not** a reward vault and it
does not hold claimable funds — it holds counters.

---

## Why this account exists

| Need | Why `UserStats` matters |
|---|---|
| Fast UI rendering | Avoids scanning every historical ticket to render wallet-level summary statistics |
| Auditability | Makes user-level counters reproducible from protocol events and ticket state |
| Streak jackpot eligibility | Provides the canonical `current_streak` and `refunded_in_streak_window` consumed by `claim_streak_jackpot` |
| Operational clarity | Separates **user history** from **ticket settlement** and **treasury routing** |

---

## PDA and ownership

| Item | Value |
|---|---|
| **Account name** | `UserStats` |
| **Seed pattern** | `[b"user_stats_v3", Pubkey(user)]` |
| **Authority model** | Program-owned PDA |
| **One account per** | Wallet / participant |
| **Holds tokens?** | No |
| **Holds claimable rewards?** | No |

---

## Canonical counters

| Field | Meaning | When it changes |
|---|---|---|
| `user` | Owner pubkey | Set on init |
| `bump` | PDA bump | Set on init |
| `games_played` | Total tickets accepted by the protocol for the user | Successful commit |
| `games_won` | Tickets revealed correctly and ended in WIN | Successful reveal classified as win |
| `games_lost` | Tickets revealed incorrectly and ended in LOSE | Successful reveal classified as loss |
| `tickets_revealed` | Tickets successfully revealed | Successful reveal |
| `tickets_claimed` | Winning tickets successfully claimed | Successful `claim_reward` |
| `tickets_swept` | Winning tickets later swept after grace expiry | Successful `sweep_unclaimed` affecting the user |
| `tickets_refunded` | Tickets that exited via the refund path | Successful `recover_funds` / `recover_funds_anyone` |
| `last_reset_slot` | Epoch boundary used by client-side filters | Set by admin reset flows when applicable |
| `current_streak` | Current consecutive-win run not yet interrupted | Reveal classified as WIN extending the streak; reset on LOSE or jackpot claim |
| `longest_streak` | Personal historical max of `current_streak` | Whenever `current_streak` exceeds the previous max — monotonic |
| `last_revealed_winning_index` | `user_commit_index` of the last winning reveal that extended the streak | Set on every WIN that extends the streak |
| `refunded_in_streak_window` | Count of refunded tickets whose `user_commit_index` is greater than `last_revealed_winning_index` | +1 in `recover_funds`; reset to 0 on every winning reveal that extends the streak |

!!! note "Interpretation"
    `games_won` and `games_lost` are **outcome counters**.
    `tickets_claimed` and `tickets_swept` are **post-settlement settlement-path counters**.
    `current_streak` and `refunded_in_streak_window` together drive the Streak Jackpot eligibility.

---

## Streak rules (canonical)

The protocol implements **strict consecutive streaks** anchored to a monotonic `user_commit_index`.
This index is recorded on every commit and is what makes the streak unforgeable.

A WIN extends the current streak only when

```
ticket.user_commit_index == last_revealed_winning_index + 1 + refunded_in_streak_window
```

| Lifecycle event | `current_streak` effect | `refunded_in_streak_window` effect |
|---|---|---|
| Commit accepted | — | — |
| Reveal — WIN, sequential index | +1 (or initialized to 1) | reset to 0 |
| Reveal — WIN, non-sequential index | reset to 1 (broken) | reset to 0 |
| Reveal — LOSE | reset to 0 | reset to 0 |
| No-reveal (expired) | broken via reveal-window logic | unchanged |
| `recover_funds` (refund) on a ticket past the last winning index | unchanged | +1 (legitimate "hop") |
| `claim_streak_jackpot` | reset to 0 | reset to 0 |

!!! tip "Visual reference"
    See the [anti-grinding diagram in the Streak Jackpot page](streak_jackpot.md#6-anti-grinding-properties)
    for an illustrated walkthrough of how the index continuity rule above prevents the canonical
    attempts to fake a streak.

This design has two important properties:

| Property | Why it holds |
|---|---|
| Hidden losers cannot inflate the streak | Skipping the loser's reveal breaks `user_commit_index` continuity, so the next WIN resets the streak rather than extending it |
| Refunds caused by oracle failure do not break the streak | Refunded tickets count as legitimate hops via `refunded_in_streak_window`, but only when the round genuinely had no pulse (program enforces `!round.pulse_set`) |

---

## Streak Jackpot eligibility

`claim_streak_jackpot` succeeds only when:

```
current_streak > StreakLeaderboard.record_streak
```

If true, the program transfers the entire `Treasury SOL` balance (minus the rent-exempt minimum) to
the user, updates `record_streak` / `record_holder` / audit counters in the leaderboard, and resets
the user's `current_streak` to 0. `longest_streak` is preserved as the user's personal historical
record.

For the full design, anti-grinding analysis, and audit fields, see [Streak Jackpot](streak_jackpot.md).

---

## Lazy account migration

The `refunded_in_streak_window` field was added during the Streak Jackpot rollout. Pre-existing
`UserStats` accounts (size = 161 bytes) are reallocated to the new size (169 bytes) lazily on the
next reveal or refund interaction, paid by the user themselves. No coordinated migration is required.

---

## Recommended documentation boundary

For a serious public documentation set:

- `UserStats` is the canonical wallet-level statistics account.
- It supports UI summaries, analytics, and Streak Jackpot eligibility.
- It does **not** alter the WIN / LOSE / NO-REVEAL / REFUND settlement matrix.
- Any future seasonal or leaderboard layer must publish its own eligibility table, budget source,
  and claim flow.
