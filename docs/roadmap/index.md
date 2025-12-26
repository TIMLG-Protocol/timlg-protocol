# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  

**Last updated:** 2025-12-25

---

## Current state (snapshot)

- **Localnet MVP:** ✅ working end-to-end (commit → oracle pulse → reveal → finalize → claim → sweep)
- **Devnet demo:** 🟡 pending (deploy parity + reproducible scripts)
- **Code visibility:** the implementation repo stays **private** until a stable devnet release

---

## Milestones (execution only)

Each stage is **collapsible**: click the title (or the “+”) to expand details.

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 1 — Core on-chain MVP (localnet)</strong></summary>

The on-chain MVP proves the **round lifecycle** and the **commit–reveal mechanics** under slot-bounded timing.

**What exists in the MVP**
- Global config (admin parameters, oracle pubkey, safety flags)
- Round state + vaults (SOL vault + token vault)
- Ticket state (commit, reveal, claim flags)

**Implemented instructions (representative)**
- Admin/config: `initialize_config`, `set_pause`, `set_oracle_pubkey`, `set_claim_grace_slots`
- Rounds/lifecycle: `create_round`, `fund_vault`, `finalize_round`, `sweep_unclaimed`
- Participation: `commit_ticket`, `reveal_ticket`, `claim_reward`

**Definition of Done**
- Test suite passes consistently on localnet (MVP end-to-end)
- A full round lifecycle is reproducible and deterministic from public state

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 2 — Gasless / signed paths</strong></summary>

To support better UX and relayer-based flows, the MVP includes **signed / escrow-assisted** paths designed to remain replay-safe.

**What exists**
- User escrow accounts and vaults
- Deposit/withdraw flows to fund actions without forcing every user to hold SOL for fees
- Guards intended to prevent signature replay and window abuse

**Implemented instructions (representative)**
- `init_user_escrow`, `deposit_escrow`, `withdraw_escrow`

**Definition of Done**
- Gasless-style flows are validated in local tests
- Replay-safety expectations are covered by tests and clear constraints in specs

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 3 — Oracle signed pulse (on-chain)</strong></summary>

This stage anchors the protocol to a **public randomness pulse** while keeping the program trust-minimized.

**What exists**
- `set_pulse_signed`: on-chain verification of an Ed25519 signature over a canonical pulse message
- Instruction introspection to ensure the signature check and the pulse-set instruction are correctly coupled
- “One-shot” pulse behavior (cannot be overwritten once set)

**Definition of Done**
- Pulse authenticity is verifiable on-chain (Ed25519)
- Pulse becomes canonical and replay-safe for the round lifecycle

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 4 — Lifecycle &amp; treasuries</strong></summary>

The MVP establishes lifecycle gates that keep rounds honest, and treasury routing that supports sustainability.

**What exists**
- Finalization gates (close the round after reveal window)
- Claim gating (claims only after finalization/settlement conditions)
- Sweep mechanics after a grace window (unclaimed leftovers routed according to treasury policy)

**Definition of Done**
- Claims cannot be executed outside the intended lifecycle
- Sweep respects the configured grace window
- Authority boundaries remain explicit in the MVP (later stages can decentralize)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 5 — Devnet parity + reproducible demo</strong></summary>

Make TIMLG behave the same way on **devnet** as it does on localnet, with a demo that anyone can reproduce.

**Scope**
- Deploy the full MVP program (complete IDL) to devnet
- Produce a scripted end-to-end run: create → commit → pulse → reveal → finalize → claim → sweep
- Ensure public docs match observed devnet behavior

**Definition of Done**
- Program deployed on devnet with the full MVP instruction surface
- Demo scripts reproduce a full round lifecycle reliably
- Docs match observed devnet behavior

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 6 — Optimization</strong></summary>

Tighten compute and binary size **without changing semantics**.

**Why it matters**
- Lower deployment friction
- More headroom for future safeguards and features

**Definition of Done**
- Tests remain green after optimizations
- Binary size / compute budgets improve (targets defined during execution)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 7 — Real oracle ops (devnet)</strong></summary>

The MVP already verifies pulses on-chain. This stage makes the off-chain pipeline run reliably against devnet.

**Scope (public-safe)**
- Beacon fetch + polling
- Canonical message construction and signing
- Submission pattern that couples Ed25519 verification with `set_pulse_signed`

**Definition of Done**
- Oracle can publish pulses deterministically on devnet rounds
- Publishing is replay-safe and operationally stable (idempotent retries)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 8 — Observability / DX</strong></summary>

Make it easy to reproduce results and understand failures **without exposing sensitive ops**.

**Scope**
- Minimal public-safe runbook for testing
- Error taxonomy and recovery guidance
- Convenience scripts for demo runs (public-safe)

**Definition of Done**
- Clear “how to run the demo” guide (public-safe)
- Minimal troubleshooting guidance for common failures
- Consistent terminology across docs, whitepaper, and scripts

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 9 — Mainnet readiness &amp; deployment</strong></summary>

This stage is about shipping TIMLG to **Solana mainnet** responsibly.

**Scope (high-level)**
- Harden authorities and treasuries (multisig, separation of duties)
- Define and test authority rotation policies (public policy; private execution)
- Optional external review/audit once devnet demo is stable
- Mainnet deployment + tagged release aligned with a whitepaper version

**Definition of Done**
- Upgrade authority and treasury authorities are protected (multisig + documented roles)
- A mainnet deployment checklist exists (program ID, config accounts, treasury addresses)
- Mainnet release is tagged and reproducible from the release commit

</details>
