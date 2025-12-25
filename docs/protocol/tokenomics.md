# Tokenomics (TIMLG) — MVP-aligned

This page describes the **current MVP mechanics** implemented in the on-chain program.
It is *not* the final economic design; it is the minimal working incentive loop.

## Token surfaces in the MVP

- A single SPL mint (named `CHRONO` in code today) is used for:
  - winner payouts, and
  - accounting of penalties (burn + treasury transfer)

> Branding/ticker can change later without changing the core protocol rules.

---

## Configurable parameters (on-chain config)

- `stake_amount` — the per-ticket amount used for token accounting and payouts
- `claim_grace_slots` — claim window extension before sweeping SOL

---

## Funding model (MVP)

Each round has a **token vault** funded by an admin/governance action.

- Winners are paid out of this vault (`stake_amount` each).
- Losers/no-reveal are processed during settlement.

This design keeps the MVP simple while still enabling a measurable incentive mechanism.

---

## Payouts and supply effects (MVP)

### Winners

On claim, a winner receives:

1. **Transfer** of `stake_amount` from the round token vault to the user
2. **Mint** of `stake_amount` new tokens to the user (reward)

So the **total** received by the winner is:

- `2 × stake_amount` tokens

### Losers

During token settlement:

- `stake_amount` per losing revealed ticket is **burned** from the round token vault.

This reduces supply and funds the “cost” of being wrong.

### No-reveal tickets

During token settlement:

- `stake_amount` per unrevealed ticket is transferred to the **treasury token account**.

This makes “no reveal” economically worse than “lose,” discouraging griefing.

---

## Why this MVP structure exists

- It proves end-to-end accounting: commit → reveal → finalize → settle → claim.
- It creates incentives to reveal and discourages withholding.
- It keeps governance levers explicit: funding, settlement, and sweeping.

---

## What stays in the whitepaper (recommended)

The website should remain concise and MVP-aligned.

The whitepaper is the place for:

- full long-term token emission schedules
- vesting, governance design, and decentralization stages
- cross-round treasury policy (buyback/burn, grants, validators, etc.)
- audit roadmap and threat model
