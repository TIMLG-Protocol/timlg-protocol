# Tokenomics (TIMLG) — MVP-aligned

This page describes the **current MVP mechanics** implemented in the on-chain program.
It is *not* the final economic design; it is the minimal working incentive loop.

## Token flow (MVP)

```mermaid
flowchart TB
  C[commit_ticket] --> SV[Round SOL Vault]
  C --> TV[Round Token Vault (funded)]
  R[reveal_ticket] --> D[determine win/lose]
  D -->|winner| CL[claim_reward]
  CL -->|transfer stake_amount| U[User Token Account]
  CL -->|mint stake_amount| U
  D -->|loser| B[burn stake_amount from vault]
  NR[no-reveal tickets] -->|during settle_round_tokens| TT[Treasury Token Account]
  SV -->|after grace: sweep_unclaimed| TS[Treasury SOL Account]
```

---

## Token surfaces in the MVP

- A single SPL mint (named `CHRONO` in code today) is used for:
  - winner payouts, and
  - accounting of penalties (burn + treasury transfer)

> Branding/ticker can change later without changing the core protocol rules.

---

## Configurable parameters (on-chain config)

- `stake_amount` — per-ticket amount used for token accounting and payouts
- `claim_grace_slots` — claim window extension before sweeping SOL

---

## Funding model (MVP)

Each round has a **token vault** funded by an admin/governance action.

- Winners are paid out of this vault (`stake_amount` each).
- Losers/no-reveal are processed during settlement.

---

## Payouts and supply effects (MVP)

### Winners

On claim, a winner receives:

1. **Transfer** of `stake_amount` from the round token vault to the user
2. **Mint** of `stake_amount` new tokens to the user (reward)

Total received:

- `2 × stake_amount` tokens

### Losers

During token settlement:

- `stake_amount` per losing revealed ticket is **burned** from the round token vault.

### No-reveal tickets

During token settlement:

- `stake_amount` per unrevealed ticket is transferred to the **treasury token account**.

---

## Why this MVP structure exists

- Proves end-to-end accounting: commit → reveal → finalize → settle → claim.
- Incentivizes revealing and discourages withholding.
- Keeps governance levers explicit: funding, settlement, and sweeping.

---

## What stays in the whitepaper (recommended)

The website should remain concise and MVP-aligned.

The whitepaper is the place for:

- long-term emission schedules
- vesting, governance design, and decentralization stages
- cross-round treasury policy (buyback/burn, grants, validators, etc.)
- audit roadmap and threat model
