# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  
It is written to be accurate while avoiding sensitive operational details.

**Last updated:** 2025-12-25

---

## Current state (snapshot)

- **Localnet MVP:** ✅ working end-to-end (commit → oracle pulse → reveal → finalize → claim → sweep)
- **Public docs:** 🟡 in progress (aligning wording + diagrams with the MVP implementation)
- **Devnet demo:** 🟡 pending (deploy parity + reproducible scripts)
- **Code visibility:** the implementation repo stays **private** until a stable devnet release

---

## Milestones

Each stage is **collapsible**: click the title (or the “+”) to expand details.

<details class="roadmap-stage" markdown="1" open>
<summary>🟡 <strong>Stage 0 — Docs &amp; public hub</strong></summary>

TIMLG needs a clean, professional public hub that explains the protocol **without leaking operational details**.

**Scope**
- Documentation site (MkDocs Material) with stable navigation
- Whitepaper (web + PDF) + versioning hygiene
- Protocol specs aligned with the MVP (naming, lifecycle, diagrams)

**Definition of Done**
- Core pages populated (Home / Whitepaper / Protocol / Roadmap / Security / Support)
- Diagrams render reliably (no Mermaid build errors)
- No broken links / nav entries, consistent terminology (“TIMLG” everywhere)
- Public wording stays “spec-level” (no keys, runbooks, privileged configs)

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 1 — Core on-chain MVP (localnet)</strong></summary>

The on-chain MVP proves the **round lifecycle** and the **commit–reveal mechanics** under slot-bounded timing.

**What exists in the MVP**
- A global config (admin parameters, oracle pubkey, safety flags)
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

The MVP establishes the lifecycle gates that keep rounds honest, and the treasury routing that supports sustainability.

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

The goal is to make TIMLG **behave the same way on devnet** as it does on localnet, with a demo that anyone can reproduce.

**What “parity” means (practical)**
- Same accounts/PDAs and timing semantics as localnet
- Same instruction surface (IDL) as the MVP
- A scripted end-to-end run: create → commit → pulse → reveal → finalize → claim → sweep

**Definition of Done**
- Program deployed on devnet with the full MVP IDL (not a minimal placeholder)
- Demo scripts reproduce a full round lifecycle reliably
- Public docs match observed devnet behavior (screenshots/links optional)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 6 — Optimization</strong></summary>

This stage focuses on **tightening compute and binary size** without changing semantics.

**Why it matters**
- Lower deployment friction
- More headroom for future features and safeguards

**Definition of Done**
- Tests remain green after optimizations
- Binary size / compute budgets are improved (target thresholds defined during execution)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 7 — Real oracle ops (devnet)</strong></summary>

The MVP already defines the on-chain pulse verification. This stage makes the off-chain pipeline run reliably against devnet.

**What exists already (conceptually / in prototypes)**
- Beacon fetch + polling (e.g., NIST-style)
- Canonical message construction and signing
- Submission pattern that couples Ed25519 verification with `set_pulse_signed`

**Definition of Done**
- Oracle can publish pulses deterministically on devnet rounds
- Publishing is replay-safe and operationally stable (retries are idempotent)

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 8 — Observability / DX</strong></summary>

This stage makes it easy for testers and contributors to reproduce results and understand failures **without exposing sensitive ops**.

**Scope**
- Minimal runbook for safe public testing
- Error taxonomy and recovery guidance
- Convenience scripts for demo runs (public-safe)

**Definition of Done**
- Clear “how to run the demo” guide (public-safe)
- Minimal troubleshooting guidance for common failures
- Consistent terminology across docs, whitepaper, and scripts

</details>
