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

| Stage | Goal | Output | Status | Definition of Done |
|------:|------|--------|--------|--------------------|
| 0 | Docs & public hub | Website + navigation | 🟡 In progress | Core pages populated, diagrams render, no broken links |
| 1 | Core on-chain MVP (localnet) | Anchor program + tests | ✅ Done | Tests consistently pass on localnet; round lifecycle works |
| 2 | Gasless / signed paths | Relayer-friendly flows | ✅ Done | Batch/signed commit & reveal paths validated in tests |
| 3 | Oracle signed pulse (on-chain) | `set_pulse_signed` | ✅ Done | Ed25519 verification on-chain; pulse one-shot; replay-safe |
| 4 | Lifecycle & treasuries | finalize/settle/claim/sweep | ✅ Done | Token settlement gates claims; sweep works after grace |
| 5 | Devnet parity + reproducible demo | Devnet deploy + scripted demo | 🧱 Blocked | Program deployed on devnet; demo script reproduces full flow |
| 6 | Extra optimization | Size / compute tightening | ⚠️ Optional | Not required for devnet demo; improves resilience |
| 7 | Real oracle ops (devnet) | Beacon → signer → tx | 🧱 Blocked | Deterministic pulse ingestion runs reliably on devnet |
| 8 | Observability / DX | minimal monitoring + docs | ❌ Pending | Basic runbook, error taxonomy, and telemetry hooks |

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
