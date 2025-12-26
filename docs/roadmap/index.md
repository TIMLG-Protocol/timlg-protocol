# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  
It is intentionally written to be accurate without exposing sensitive operational details.

**Last updated:** 2025-12-25

---

## Milestones

<details open>
<summary><strong>🟡 Stage 0 — Docs &amp; public hub</strong></summary>

**Goal:** professional public hub (docs + whitepaper)  
**Output:** website + navigation

**Definition of Done**
- Core pages populated (Whitepaper / Protocol / Roadmap / Security / Support)
- Diagrams render (no Mermaid errors)
- No broken links / nav entries
- Public wording stays “spec-level” (no ops secrets)

</details>

<details open>
<summary><strong>✅ Stage 1 — Core on-chain MVP (localnet)</strong></summary>

**Goal:** end-to-end commit → reveal → finalize → settle → claim → sweep on localnet  
**Output:** Anchor program + tests

**Definition of Done**
- Tests pass consistently on localnet
- Full round lifecycle works end-to-end
- Deterministic settlement from public state

</details>

<details open>
<summary><strong>✅ Stage 2 — Gasless / signed paths</strong></summary>

**Goal:** relayer-friendly flows  
**Output:** signed/batched paths validated

**Definition of Done**
- Batch/signed commit &amp; reveal paths validated in tests
- Replay-safe payload patterns

</details>

<details open>
<summary><strong>✅ Stage 3 — Oracle signed pulse (on-chain)</strong></summary>

**Goal:** verify pulse authenticity on-chain  
**Output:** <code>set_pulse_signed</code>

**Definition of Done**
- Ed25519 verification on-chain
- Pulse is one-shot and replay-safe

</details>

<details open>
<summary><strong>✅ Stage 4 — Lifecycle &amp; treasuries</strong></summary>

**Goal:** finalize/settle/claim/sweep complete  
**Output:** deterministic lifecycle gates + treasury routing

**Definition of Done**
- Token settlement gates claims
- Sweep works after grace period
- Authority boundaries are explicit (MVP)

</details>

<details>
<summary><strong>🟡 Stage 5 — Devnet parity + reproducible demo</strong></summary>

**Goal:** reproducible devnet behavior matching localnet constraints  
**Output:** devnet deploy + scripted demo pack

**Definition of Done**
- Program deployed on devnet
- One script reproduces the full round lifecycle end-to-end
- Docs match observed devnet behavior

</details>

<details>
<summary><strong>⚠️ Stage 6 — Optimization (optional)</strong></summary>

**Goal:** size/compute tightening  
**Output:** resilience + cost improvements

**Definition of Done**
- Not required for the devnet demo
- Improves robustness and reduces compute/size risk

</details>

<details>
<summary><strong>🟡 Stage 7 — Real oracle ops (devnet)</strong></summary>

**Goal:** run a deterministic beacon → signer → tx pipeline on devnet  
**Output:** reliable pulse publishing + indexing

**Definition of Done**
- Deterministic pulse ingestion runs reliably on devnet
- Replay-safe publishing and indexing

</details>

<details>
<summary><strong>🟡 Stage 8 — Observability / DX</strong></summary>

**Goal:** minimal monitoring + runbook (public-safe)  
**Output:** error taxonomy + recovery guidance

**Definition of Done**
- Error taxonomy + recovery guidance
- Minimal telemetry hooks (public-safe) for ops

</details>

---

## What “Devnet parity” means here

Devnet parity is not just “it deploys”. It means:

- deterministic scripts can create a round, commit, set a signed pulse, reveal, finalize, settle, claim, and sweep
- all constraints behave the same as localnet (PDAs, token accounts, slot windows)
- the public docs match the observed behavior

---

## Public releases strategy

- **Docs site:** updated continuously (living documentation)
- **Whitepaper PDF:** versioned releases (v0.1, v0.2, …)
- **Code repo:** published once devnet release is stable, with tags matching the whitepaper

---

## Constraints (public)

- Oracle ops must remain deterministic and replay-safe
- Authorities and treasuries must be hardened (multisig / separation of duties) before mainnet readiness
