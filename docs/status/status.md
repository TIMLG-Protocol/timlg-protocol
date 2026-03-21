# Current Status

TIMLG Protocol is currently in **Public Devnet MVP**. The protocol core, operator layer, user-facing beta flow, and audit surface are all active, but the deployment should still be read as a **development network system under active hardening**, not as a final production release.

## Deployment Summary

| Area | Current State | Notes |
|---|---|---|
| **Network** | Public Devnet | Used as the canonical public environment for the MVP |
| **Program** | Deployed and exercised continuously | Program ID migrated and stabilized during the January 2026 reset cycle |
| **Oracle model** | Single authorized signer | Current operational model; multi-oracle remains future hardening |
| **Operator / supervisor** | Active | Round creation, pulse handling, settlement, sweep, cleanup, and diagnostics are implemented |
| **User flow** | End-to-end operational | Commit, reveal, claim, refund, sweep visibility, and rent recovery are implemented |
| **Audit surface** | Active and traceable | Live audit, CSV export, archive sync, and transaction traceability are present |
| **Documentation** | Technical protocol docs in place | Status, protocol, security, lifecycle, runbook, and troubleshooting are present |

## Protocol Scope Implemented Today

| Capability | State | Evidence from repository history |
|---|---|---|
| **Commit / reveal base flow** | Implemented | Completed and tested in December 2025 |
| **Batch commit / reveal** | Implemented | Normal and signed batching added in December 2025 |
| **Signed oracle pulse path** | Implemented | `set_pulse_signed` hardened and moved away from mock path in December 2025 |
| **Finalize / settle / claim lifecycle** | Implemented | End-to-end lifecycle completed on Devnet in late December 2025 |
| **Round pipelining** | Implemented | NIST-aligned pipelining and automated windows added in January 2026 |
| **Permissionless / auto-assisted settlement paths** | Implemented | Auto-finalize and lazy / claim-driven settlement introduced in January–March 2026 |
| **Refund path** | Implemented | Refund logic hardened across protocol and UI in January 2026 |
| **Sweep and rent recovery** | Implemented | Sweep automation, `close_ticket`, `close_round`, reclaim scripts, and UI support added in January 2026 |
| **User statistics** | Implemented | Robust on-chain stats and reset/session logic added in March 2026 |
| **Audit traceability** | Implemented | Historical archive, Firebase sync, CSV export, tx capture, and proof-oriented export added in February–March 2026 |

## Current Operational Capabilities

### Core protocol

| Surface | Status | Notes |
|---|---|---|
| **Round creation** | Operational | Manual and automated creation paths exist |
| **Commit window enforcement** | Operational | Window checks and pulse-liveness checks were hardened during January 2026 |
| **Reveal window enforcement** | Operational | UI and protocol both track reveal / claim timing |
| **Pulse publication** | Operational | Signed pulse flow uses ed25519 validation and oracle key enforcement |
| **Settlement** | Operational | Lazy settlement, auto-settle assistance, and stale-cache hardening were added progressively |
| **Claim** | Operational | Winner claims are live on Devnet |
| **Sweep** | Operational | Grace-gated sweep and zero-ticket round handling are implemented |
| **Rent recovery** | Operational | Ticket closure and batch reclaim flows are present |

### Operator and maintenance layer

| Surface | Status | Notes |
|---|---|---|
| **Supervisor loop** | Operational | Unified operator supervisor with integrated audit worker |
| **RPC resilience** | Hardened | Multiple rounds of caching, throttling, 429 handling, and dual-RPC fallback |
| **Round cleanup** | Operational | Deep sweep, reclaim, stuck-round diagnostics, skip lists, and zombie filtering exist |
| **Legacy round compatibility** | Partial but implemented | Several fixes explicitly target legacy / migrated / purged rounds |
| **Metrics and observability** | Operational | Recent commits add one-line RPC metrics, operational counters, and richer audit output |

### User-facing surfaces

| Surface | Status | Notes |
|---|---|---|
| **Beta app** | Operational | Public Devnet interface exists, but it is a moving MVP surface |
| **Ticket history** | Mature for Devnet MVP | Filtering, contextual actions, export, and local resilience were added iteratively |
| **Round timeline / modal** | Operational | Timeline, traceability, and explorer links are present |
| **Ticket manager** | Operational | CLI utility supports activity simulation, balance reporting, and session stats |
| **Live audit** | Operational | Audit worker, archive sync, CSV export, and tx traceability are present |

## Current Technical Characteristics

| Topic | Current position |
|---|---|
| **Oracle trust model** | **Trust-minimized**, single-signer model with signed pulse verification and on-chain sequential constraints. Not trustless. See [Oracle Trust Model](../protocol/oracle_trust_model.md). |
| **Settlement model** | Deflationary settlement with automated and lazy settlement paths |
| **Audit model** | Chain-derived data plus synchronized archive / export layers for Devnet observability |
| **Stats model** | On-chain user statistics and streak tracking are present and already used by surrounding tooling |
| **Environment model** | Devnet-first public MVP with frequent protocol and tooling iteration |

## What Is Stable Enough To Rely On

| Safe to treat as current MVP behavior | Why |
|---|---|
| **Devnet is the canonical public environment** | The commit history consistently treats Devnet as the main public operating surface |
| **Single-oracle signed pulse is the current trust model** | Repeated hardening work focuses on signed oracle operation, not production quorum |
| **User flow is complete enough for real protocol exercise** | Commits cover the full lifecycle from commit to rent recovery |
| **Audit and observability are first-class surfaces** | A large portion of February–March 2026 work is dedicated to audit correctness and export quality |
| **User stats are now a real protocol surface** | March 2026 commits add robust on-chain stats, resets, streak handling, and UI consumption |

## Known Constraints

| Constraint | Practical meaning |
|---|---|
| **Devnet-only public posture** | Reliability and economics should be read as MVP behavior, not production guarantees |
| **Single authorized oracle — trust-minimized** | The protocol is **not trustless**: ed25519 verification proves oracle authorization, not NIST pulse authenticity. The operator must be trusted to fetch and publish real pulses. |
| **syncLatestPulse / ORACLE-GAP dependency** | The `latest_finalized_pulse_index` is advanced by admin calls, not purely by sequential pulse publications. This is a liveness mechanism, but also a centralization vector. The program enforces monotonic advancement only. |
| **Legacy migration burden** | Multiple commits exist solely to handle older rounds, old IDLs, and migrated account layouts |
| **Operational complexity still lives off-chain** | The supervisor, audit worker, reclaim tools, and archive sync remain essential components |
| **UI and audit are actively refined** | The surfaces are usable, but their presentation and edge-case handling have evolved continuously |

## Near-Term Documentation Priorities

The repository history suggests these areas should remain explicit in the docs because they changed repeatedly and matter to advanced readers:

| Documentation priority | Why it matters |
|---|---|
| **User statistics and streak semantics** | Stats are now on-chain and can later support streak-based incentives |
| **Operator vs protocol responsibilities** | Many fixes live in the supervisor / audit layer rather than in the on-chain program |
| **Legacy and migration behavior** | Several protocol and UI fixes target old rounds, old IDLs, and purged history |
| **Sweep / claim / rent-recovery boundaries** | These paths are implemented, but easy to misunderstand without precise tables |
| **Audit data sources** | The system combines chain state, synchronized archives, and export layers |

## Interpretation Guide

This page is intentionally conservative.

- It describes **what is operational today**, not every experimental branch or discarded idea.
- It treats the repository history as the source of truth for current status.
- It avoids presenting future work as if it were already part of the canonical public deployment.
