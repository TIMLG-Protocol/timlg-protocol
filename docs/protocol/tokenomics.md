# Tokenomics (TIMLG)

This page documents **protocol economics** as implemented for the TIMLG MVP: what is staked, how rounds settle, and how
funds are routed.

It also includes a **token distribution** section, but marks it as **TBD** until the project formally defines supply,
allocations, and vesting.

!!! note "Scope"
    This page is about **protocol rules and incentives**, not an investment pitch.

---

## What exists today (MVP-aligned)

### Economic unit (whole-token design)
- Each ticket escrows a fixed stake of the **protocol token**.
- TIMLG is designed as a **whole-unit token (decimals = 0)**.
- The on-chain config stores `stake_amount` as an integer, and deployments are expected to use a TIMLG mint with `decimals = 0`
  so that **`stake_amount = 1` means “stake 1 TIMLG.”**

!!! note "Implementation note"
    The on-chain program does not currently enforce mint decimals; this is a **deployment invariant** (the configured mint must use `decimals = 0`).

### Why this exists
The economics are designed to:
1. Enforce **commit–reveal integrity** (discourage “commit then disappear”).
2. Keep settlement **deterministic** and auditable from on-chain state.
3. Support a **treasury** model for long-term sustainability (infra + future reviews).

---

## Outcomes and routing (MVP)

After the pulse is finalized and the reveal window closes, each ticket is classified:

| Outcome | Condition | Economic effect (MVP) |
|---|---|---|
| **WIN** | valid reveal and matches assigned target bit | user may **claim**: **refund stake** + **mint reward** |
| **LOSE** | valid reveal but does not match | stake is **burned** during token settlement |
| **NO-REVEAL** | no valid reveal by deadline (or invalid reveal) | stake is transferred to **SPL treasury** (no burn, no mint) |

!!! warning "No promises"
    Rewards are protocol-defined accounting outcomes. They are not guarantees of profit, yield, or investment returns.

---

## Claim + settlement model (what happens and when)

TIMLG separates “classification” from “distribution”:

1. **Commit:** stake escrowed into the **round token vault** (legacy code name: `chrono_vault`)
2. **Pulse:** oracle publishes the 512-bit pulse (Ed25519 verified)
3. **Reveal:** proof of commitment (guess + salt)
4. **Finalize:** round is locked
5. **Settle tokens:** losers are burned, unrevealed are routed to SPL treasury
6. **Claim:** winners can claim **refund + mint**
7. **Sweep (SOL-only):** after a grace window, optional native SOL sweep can run

This separation makes the protocol easier to audit and harder to exploit with timing tricks.

---

## Anti-griefing design

The primary griefing pattern in commit–reveal systems is:

- users commit, then refuse to reveal (to influence outcomes or stall settlement)

TIMLG addresses this by:
- enforcing slot-bounded windows
- routing **NO-REVEAL** stake to the **SPL treasury** (prevents “free option to disappear”)
- burning **LOSE** stake (makes spam participation costly)

---

## Supply intuition (MVP)

Per ticket, the token supply changes like this:

- **WIN:** supply **+1** (reward is minted on claim)
- **LOSE:** supply **−1** (stake is burned during settlement)
- **NO-REVEAL:** supply **0** (stake is transferred to SPL treasury)

If the experiment is truly unbiased for a single bit (p ≈ 0.5) and participants are not advantaged,
then in expectation:

- `E[Δsupply] ≈ +0.5 − 0.5 = 0` (ignoring NO-REVEAL)

!!! important "MVP nuance"
    The reward is minted **only when the winner claims**.
    If winners do not claim, fewer rewards are minted while loser burns still happen → the system becomes
    **net deflationary** relative to “all winners claim”.

---

## Fees (optional, future-safe)

The MVP keeps fees minimal. Later versions may introduce:
- small protocol fees (e.g., to fund monitoring and security work)
- fee splits (SPL treasury vs SOL treasury)
- anti-spam economics for permissionless participation

Any change must be:
- versioned (docs + whitepaper release)
- implemented as an on-chain config change
- validated by deterministic scripts on devnet

---

## Token distribution (TBD)

The project name/ticker has been updated to **TIMLG (TimeLog)**.

A full “launch tokenomics” plan is **not finalized yet**, including:
- total supply / emission schedule
- allocations (team, treasury, community, liquidity, advisors, etc.)
- vesting and unlock schedules
- exchange/liquidity strategy
- governance distribution (multisig / DAO transition)

Until defined, the public docs will only describe **protocol economics** (how the game settles and routes value), not a
market distribution plan.

!!! tip "Good public practice"
    When distribution is defined, publish it in a **versioned whitepaper release** (e.g., v0.2) and mirror a summarized
    version here.

---

## What is intentionally not published here

- private treasury operations / signer custody procedures
- relayer/oracle operational runbooks
- any detail that enables unauthorized authority changes or fund movement
