# Settlement Rules

This page describes how the MVP resolves tickets after a pulse is finalized.

It is written to be **accurate and auditable** without exposing operational secrets.

---

## Ticket outcomes

Each ticket escrows a fixed stake (MVP: **exactly 1 token**) at commit time.

After the oracle publishes the pulse and the reveal window closes, each ticket is classified as:

| Outcome | Condition | Result |
|---|---|---|
| **WIN** | Valid reveal, and `guess_bit == target_bit` | User can claim **2 tokens** |
| **LOSE** | Valid reveal, and `guess_bit != target_bit` | User can claim **0 tokens** |
| **NO‑REVEAL** | No valid reveal by the reveal deadline (or invalid reveal) | Stake is **forfeited** (policy-routed) |

This is the core experimental unit: a Bernoulli trial under a strict anti-leakage commit–reveal schedule.

---

## Target bit definition (MVP)

The oracle submits a **512-bit pulse** (64 bytes). The MVP defines a deterministic bit extraction function:

- `target_bit = ExtractBit(pulse_512, bit_index)`

Where `bit_index` is defined by the round/target configuration (and is part of the public record).

!!! note
    The precise extraction convention (endianness, indexing) must remain stable and versioned.
    If it ever changes, it must be treated as a breaking change and documented.

---

## Valid reveal

A reveal is valid if:

1) It arrives before the reveal deadline  
2) It recomputes the commitment digest for that ticket  
3) The revealed guess is well-formed (MVP: a single bit)

Invalid reveals are treated as **NO‑REVEAL** for settlement purposes.

---

## Settlement flow (high level)

At a high level, a round moves through these steps:

1) **Commits** are accepted (users escrow stake)
2) Oracle publishes pulse (`set_pulse_signed`)
3) Users **reveal**
4) Admin finalizes (`finalize_round`)
5) Program **settles** token accounting (`settle_round_tokens`)
6) Winners **claim** (`claim_reward`)
7) After a grace period, leftovers are swept (`sweep_unclaimed`)

### Why settlement is a separate step
Settlement is intentionally explicit so:

- accounting is deterministic and observable,
- claim gating can be hardened,
- and the sweep policy can run only after a known grace period.

---

## Reward funding and vault behavior (MVP)

The fixed payout rule (**WIN pays 2**) implies the program must have enough liquidity to pay winners even if some stakes
are forfeited (NO‑REVEAL policy-routing).

In the MVP, this is handled via vaults:

- **Stake vault / reward vault**: funded and managed by the program rules
- **Treasury vault**: receives policy-routed forfeitures and post-grace leftovers

The program can include an explicit funding path (e.g., `fund_vault`) so the reward vault always remains solvent.

!!! warning "No hidden promises"
    The payout rule is a protocol rule, not an investment promise. The experiment measures outcomes; it does not
    guarantee profit.

---

## Claim rules

A claim is valid if:

- the round is settled,
- the ticket outcome is WIN,
- the claimant is the recorded participant (or authorized beneficiary),
- and the claim has not already been executed.

To prevent double-claims:

- each ticket must carry a **claimed flag** (or equivalent) in on-chain state.

---

## Sweep rules

After settlement, unclaimed funds may remain (e.g., winners who never claim).

The sweep rule is:

- sweep is only allowed after `claim_grace_slots` has elapsed
- sweep routes remaining funds according to the public treasury policy

This ensures:

- winners have time to claim,
- and the protocol state cannot remain “stuck” forever.

---

## Public invariants (what anyone can check)

1) **No commits after commit deadline**  
2) **No reveals after reveal deadline**  
3) **Pulse is one-shot and verified on-chain (Ed25519)**  
4) **Settlement outcomes depend only on**: commitment/reveal validity + finalized pulse + extraction convention  
5) **Claims are idempotent** (cannot be claimed twice)  
6) **Sweep cannot happen early**

If any of these invariants are violated, it is considered a protocol bug (H1/H2 in the whitepaper ladder) and must be
fixed before stronger interpretations are considered.
