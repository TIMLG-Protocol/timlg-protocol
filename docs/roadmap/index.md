# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  
It is intentionally written to be accurate without exposing sensitive operational details.

**Last updated:** 2025-12-25

---

## Current state (snapshot)

- **Localnet MVP:** ✅ working end-to-end (commit → oracle pulse → reveal → finalize → settle → claim → sweep)
- **Devnet parity:** 🧱 blocked (funding / faucet constraints and deployment parity work)
- **Public docs:** 🟡 in progress (aligning wording and diagrams with the MVP implementation)
- **Code visibility:** the implementation repo stays **private** until we have a stable devnet release

---

## Milestones

<div class="grid cards" markdown>

-   **Stage 0 — Docs & public hub**  
    **Output:** Website + navigation  
    **Status:** 🟡 In progress  

    **Definition of Done**
    - Core pages populated
    - Diagrams render (no Mermaid errors)
    - No broken links / nav entries

-   **Stage 1 — Core on-chain MVP (localnet)**  
    **Output:** Anchor program + tests  
    **Status:** ✅ Done  

    **Definition of Done**
    - Tests pass consistently on localnet
    - Full round lifecycle works end-to-end

-   **Stage 2 — Gasless / signed paths**  
    **Output:** Relayer-friendly flows  
    **Status:** ✅ Done  

    **Definition of Done**
    - Batch/signed commit & reveal paths validated in tests

-   **Stage 3 — Oracle signed pulse (on-chain)**  
    **Output:** `set_pulse_signed`  
    **Status:** ✅ Done  

    **Definition of Done**
    - Ed25519 verification on-chain
    - Pulse is one-shot and replay-safe

-   **Stage 4 — Lifecycle & treasuries**  
    **Output:** finalize / settle / claim / sweep  
    **Status:** ✅ Done  

    **Definition of Done**
    - Token settlement gates claims
    - Sweep works after grace period

-   **Stage 5 — Devnet parity + reproducible demo**  
    **Output:** Devnet deploy + scripted demo  
    **Status:** 🧱 Blocked  

    **Definition of Done**
    - Program deployed on devnet
    - One script reproduces the full round lifecycle
    - Docs match observed devnet behavior

-   **Stage 6 — Optimization (optional)**  
    **Output:** Size / compute tightening  
    **Status:** ⚠️ Optional  

    **Definition of Done**
    - Not required for devnet demo
    - Improves resilience and cost

-   **Stage 7 — Real oracle ops (devnet)**  
    **Output:** Beacon → signer → tx  
    **Status:** 🧱 Blocked  

    **Definition of Done**
    - Deterministic pulse ingestion runs reliably on devnet
    - Replay-safe publishing and indexing

-   **Stage 8 — Observability / DX**  
    **Output:** Minimal monitoring + runbook  
    **Status:** ❌ Pending  

    **Definition of Done**
    - Error taxonomy + recovery guidance
    - Minimal telemetry hooks for ops

</div>

---

## What “Devnet parity” means here

Devnet parity is not just “it deploys”. It means:

- deterministic scripts can create a round, commit, set a signed pulse, reveal, finalize, settle, claim, and sweep
- all constraints behave the same as localnet (PDAs, token accounts, slot windows)
- the public docs match the observed behavior

---

## Near-term plan (next 2–3 sessions)

1. **Finish documentation alignment**
   - “Protocol” pages reflect the MVP objects and naming (Round/Ticket, slots, pulse, settlement gates)
   - Add/verify diagrams (architecture, lifecycle, state machine, token flow)

2. **Prepare the devnet demo pack**
   - One command to deploy
   - One script to run the full round lifecycle
   - One script to publish the oracle pulse (signed)

3. **Unblock devnet**
   - Secure enough SOL for test loops
   - Stabilize configuration and accounts used by the demo

---

## Public releases strategy

- **Docs site:** updated continuously (living documentation)
- **Whitepaper PDF:** versioned releases (v0.1, v0.2, …)
- **Code repo:** published once devnet release is stable, with tags matching the whitepaper

---

## Risks & constraints (public)

- Limited devnet funding can slow iteration and reproducible demos
- Oracle ops must remain deterministic and replay-safe
- Treasury and authorities must be hardened (multisig / separation of duties) before mainnet readiness

---

If you want the “live checklist” view, see the **Status** page.
