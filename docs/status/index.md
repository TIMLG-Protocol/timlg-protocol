# Status

**Last updated:** 2025-12-25

This page is a **living snapshot** of where the project stands, what is being worked on, and what is intentionally kept private for security.

---

## Snapshot

- **MVP (localnet):** ✅ end-to-end round lifecycle works
- **Devnet parity:** 🧱 blocked (funding / faucet constraints + deployment parity loop)
- **Docs site:** 🟡 active polish + spec alignment
- **Implementation repo:** 🔒 private until a stable devnet release

---

## Current focus (this week)

1. **Documentation polish (public)**
   - Ensure wording matches the MVP implementation (Round/Ticket, slot windows, signed pulse, settlement gates)
   - Fix any Mermaid rendering issues
   - Improve navigation and readability

2. **Devnet unblock (private ops)**
   - Acquire enough SOL to iterate on devnet
   - Stabilize deploy + demo scripts
   - Validate deterministic behavior (same constraints as localnet)

---

## Public vs private boundary

### ✅ What is public (this repo)

- Whitepaper (**web + PDF**)
- High-level protocol specs (safe abstraction)
- Roadmap + status snapshots
- Diagrams that explain the system at a conceptual level

### 🔒 What stays private (by design)

- Private keys, seed phrases, signers, privileged configs
- Production oracle/relayer operational details (endpoints, automation, infra)
- Anything that could enable unauthorized authority changes or fund movement
- Internal runbooks that contain sensitive operational steps

> **Security principle:** public documentation must never include anything that enables unauthorized signing, authority changes, or treasury movement.

---

## MVP capabilities (localnet)

The MVP is considered complete locally when the following flow works end-to-end:

- commit
- oracle pulse (signed on-chain)
- reveal
- finalize
- settle
- claim
- sweep (after grace)

✅ **Localnet status:** completed and repeatable.

---

## Devnet readiness checklist (public)

These items define “devnet parity” for the public milestone.

- [ ] Program deployed on devnet with stable IDs
- [ ] One script reproduces full lifecycle (create round → commit → pulse → reveal → finalize → settle → claim → sweep)
- [ ] Docs match observed devnet behavior (no divergence between text and reality)
- [ ] Minimal demo instructions (single page runbook without secrets)

---

## Documentation checklist (public)

- [ ] Whitepaper web sections populated (overview + system model)
- [ ] Log format + hashing described (high level)
- [ ] Timing windows + edge cases documented
- [ ] Settlement rules + invariants documented
- [ ] Diagrams: architecture + lifecycle + commit–reveal

---

## Change log (public)

- 2025-12-25: status refresh + checklists aligned with MVP implementation

---

## Where to go next

- See **Roadmap** for the full milestone plan.
- See **Protocol** pages for specs and diagrams.
- See **Security & Control** for the public boundary of what is intentionally not documented.
