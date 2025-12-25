# Tokenomics (TIMLG)

This page documents **protocol economics** as implemented (or explicitly planned) for the TIMLG MVP: what is staked, how rounds settle, and how funds are routed.

It also includes a **token distribution** section, but marks it as **TBD** until the project formally defines supply, allocations, and vesting.

!!! note "Scope"
    This page is about **protocol rules and incentives**, not an investment pitch.

---

## What exists today (MVP-aligned)

### Economic unit
- Each ticket escrows a fixed stake of the **protocol token**.
- In the current MVP design, the stake is intended to be **exactly 1 token per ticket** (configurable on-chain).

### Why this exists
The economics are designed to:
1. **Enforce commit–reveal integrity** (discourage “commit then disappear”).
2. Keep settlement **deterministic** and auditable from on-chain state.
3. Support a **treasury** model for long-term sustainability (infra + future reviews).

---

## Outcomes and routing (MVP)

After the pulse is finalized and the reveal window closes, each ticket is classified:

| Outcome | Condition | Economic effect (MVP) |
|---|---|---|
| **WIN** | valid reveal and matches assigned target bit | eligible to **claim** after settlement |
| **LOSE** | valid reveal but does not match | stake is **routed to SPL treasury** during token settlement |
| **NO-REVEAL** | no valid reveal by deadline (or invalid reveal) | stake is **slashed** (MVP: burn) |

!!! warning "No promises"
    Rewards are protocol-defined accounting outcomes. They are not guarantees of profit, yield, or investment returns.

---

## Claim gating and settlement

TIMLG separates “classification” from “distribution”:

1. **Commit:** stake escrowed into a round vault
2. **Reveal:** proof of commitment (guess + salt)
3. **Finalize:** round is locked
4. **Settle:** token accounting is computed and written
5. **Claim:** only after settlement; claims are **idempotent**
6. **Sweep:** only after a grace window; routes leftovers to treasury policy

This separation makes the protocol easier to audit and harder to exploit with timing tricks.

---

## Anti-griefing design

The primary griefing pattern in commit–reveal systems is:

- users commit, then refuse to reveal (to influence outcomes or stall settlement)

TIMLG addresses this by:
- enforcing **slot-bounded windows**
- slashing **NO-REVEAL** tickets (MVP: burn)
- routing **LOSE** stake to treasury (discourages spam participation)

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

The project name/ticker has been updated to **TIMLG**.  
A full “launch tokenomics” plan is **not finalized yet**, including:

- total supply / emission schedule
- allocations (team, treasury, community, liquidity, advisors, etc.)
- vesting and unlock schedules
- exchange/liquidity strategy
- governance distribution (multisig / DAO transition)

Until defined, the public docs will only describe **protocol economics** (how the game settles and routes value), not a market distribution plan.

!!! tip "Good public practice"
    When distribution is defined, publish it in a **versioned whitepaper release** (e.g., v0.2) and mirror a summarized version here.

---

## What is intentionally not published here

- private treasury operations / signer custody procedures
- relayer/oracle operational runbooks
- any detail that enables unauthorized authority changes or fund movement
