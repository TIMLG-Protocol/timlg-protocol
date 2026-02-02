# Settlement Rules

This page describes how the MVP resolves tickets after a pulse is finalized.

It is written to be **accurate and auditable** without exposing operational secrets.

---

## Ticket outcomes

Each ticket escrows a fixed stake at commit time.

!!! info "TIMLG Decimals and Units"
    TIMLG is an SPL token with **`decimals = 9`**. Amounts are stored in **base units** (`u64`), where **1 TIMLG = 1_000_000_000 base units**. The on-chain `stake_amount` is an integer expressed in these base units.

After the oracle publishes the pulse and the reveal window closes, each ticket is classified as:

| Outcome | Condition | Result (MVP) |
|---|---|---|
| **WIN** | Valid reveal, and `guess_bit == target_bit` | user can claim **refund stake + minted reward** (total payout = 2) |
| **LOSE** | Valid reveal, and `guess_bit != target_bit` | stake is **burned** during token settlement (payout = 0) |
| **NO-REVEAL** | No valid reveal by the reveal deadline | stake is **burned** during token settlement (payout = 0) |

This is the core experimental unit: a Bernoulli trial under a strict anti-leakage commit–reveal schedule.

---

## Target bit definition (MVP)

The oracle submits a **512-bit pulse** (64 bytes). The MVP defines a deterministic bit extraction function:

- `target_bit = ExtractBit(pulse_512, bit_index)`

With the exact extraction convention:

- `byte_i = bit_index / 8`
- `bit_i  = bit_index % 8`
- `target_bit = (pulse[byte_i] >> bit_i) & 1`

So bit 0 is the **least significant bit (LSB) of pulse[0]**, bit 7 is the MSB of pulse[0], bit 8 is the LSB of pulse[1], etc.

!!! note "Stability requirement"
    The extraction convention (byte order + bit order) must remain stable and versioned.
    If it ever changes, it must be treated as a breaking change and documented.

---

## Valid reveal

A reveal is valid if:

1) It arrives on or before the reveal deadline  
2) It recomputes the commitment digest for that ticket  
3) The revealed guess is well-formed (MVP: a single bit `0/1`)

Invalid reveals are treated as **NO-REVEAL** for settlement purposes.

---

## Settlement flow (high level)

At a high level, a round moves through these steps:

1) **Commits** are accepted (users escrow stake into the **round token vault**; legacy code name: `timlg_vault`)
2) Oracle publishes pulse (`set_pulse_signed`)
3) Users **reveal**
5) **Settle** token accounting (`settle_round_tokens`) — **Note**: this instruction auto-finalizes the round if it hasn't been done yet.
6) Winners **claim** (`claim_reward`)
7) Users **close** finished tickets to reclaim the ticket account’s SOL rent deposit (`close_ticket`)
8) After a grace period, admin may run `sweep_unclaimed` (round vault **SOL + remaining SPL tokens**)

### Why settlement is a separate step
Settlement is intentionally explicit so:

- accounting is deterministic and observable,
- claim gating can be hardened,
- and the sweep policy can run only after a known grace period.


---

## Ticket rent recovery (`close_ticket`)

A ticket is an on-chain account (PDA) that holds a **Solana rent-exempt deposit** (lamports). This deposit is **not** part of the TIMLG reward; it exists to keep the account alive.

- `claim_reward` distributes **SPL tokens** (stake refund + minted reward). It does **not** close the ticket account.
- To reclaim the ticket account’s lamports, the ticket owner calls **`close_ticket`** (user-signed).

### When can a user close a ticket?

If the round account still exists (“round alive”), the program enforces that the ticket is fully finished:

- The ticket must be `processed == true` (i.e., settlement has processed it).
- If `ticket.win == true`, the user must have claimed first: `claimed == true`.

If the round account has been closed/archived (“round dead”, detected via `round.lamports() == 0`), the program allows closing **any** ticket to recover rent. This is a safe “auto-healing” path because the round state no longer exists to pay out rewards.

> Practical UX rule: **after settlement (and after claim if you won), close your ticket to recover SOL.**



---

## Reward funding and vault behavior (MVP)

The payout rule is:

- **WIN payout total = 2 × stake_amount**
  - 1× is a **refund** of the escrowed base units
  - 1× is a **minted reward** in base units

So the MVP does **not** require a pre-funded “reward vault” for rewards:
- stake refunds come from the round token vault
- rewards are minted on claim by the configured mint authority

!!! important "MVP nuance"
    Rewards are minted **only when the winner claims**.
    If winners do not claim, fewer rewards are minted while loser burns can still occur → net deflation vs “all winners claim”.

---

## Claim rules

A claim is valid if:

- the round token settlement has completed (`token_settled == true`),
- the round has not been swept (`swept == false`),
- the ticket outcome is WIN,
- the claimant is the recorded user,
- and the claim has not already been executed.

To prevent double-claims:
- each ticket carries a **claimed flag** and a **claimed_slot** in on-chain state.

---

## Token settlement (what actually moves)

During `settle_round_tokens`:

- For every **LOSE** or **NO-REVEAL** ticket: `stake_amount` is included in a burn total and burned from the round token vault.
- WIN tickets are not paid automatically at settlement; they become claimable.

### Edge cases and rules of thumb

#### 1) Pulse arrives early or late
(Handled in Timing Windows)

#### 2) Users commit at the boundary slot
(Handled in Timing Windows)

#### 3) Permissionless Refunds (Cranker)

If the randomness pulse is never posted (e.g., oracle failure), users have an **infinite refund right**. To prevent rounds from staying open indefinitely if users are inactive, the protocol allows **permissionless refunds**:
- Anyone can trigger a refund for any ticket after the **Refund Timeout** has passed.
- The funds are always sent to the original user's Token Account.
- The ticket PDA is closed, and its remaining lamports are returned to the user.

---

## Sweep rules (MVP)

After the grace period, `sweep_unclaimed` may be executed:

- Gate: `current_slot > reveal_deadline_slot + claim_grace_slots`
- Requires: round is finalized and not already swept
- Effect (MVP): transfers **native SOL** (lamports) to the **SOL treasury** and **remaining tokens** to the **Protocol Treasury SPL**.
- Side effect: marks the round as **swept**, which **closes claims** in the MVP (`claim_reward` rejects if `round.swept`).
- This ensures the round vault is emptied, allowing for a successful `close_round`.

> [!CAUTION]
> **Permanent Prize Forfeiture**: In the current MVP implementation, if a winner fails to claim their reward before the **Claim Grace** period expires and the round is **swept**, the prize is **lost forever**. The system does not support late claims or automated reward distribution after a sweep has occurred.

!!! note "Operational guidance"
    The MVP code allows sweeping both SOL and SPL. Operators should typically:
    finalize → settle tokens → allow claim window → then sweep everything.

---

## Public invariants (what anyone can check)

1) No commits after commit window closes (and commits are rejected once pulse is set)
2) No reveals after reveal deadline
3) Pulse is one-shot and verified on-chain (Ed25519)
4) Settlement outcomes depend only on: commitment/reveal validity + finalized pulse + extraction convention
5) Claims are idempotent (cannot be claimed twice)
6) Sweep cannot happen early (must wait for the grace window)

If any of these invariants are violated, it is considered a protocol bug (H1/H2 in the whitepaper ladder) and must be
fixed before stronger interpretations are considered.
