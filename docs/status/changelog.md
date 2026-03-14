# Changelog

This changelog is organized by **technical milestones**, not by arbitrary semantic versions. It is intended to help a specialized reader understand how the current Devnet MVP was assembled and hardened.

## March 2026 — Stats hardening, audit traceability, and operator resilience

### Protocol and state handling

| Date | Area | Change |
|---|---|---|
| 2026-03-11 | **Protocol / stats** | Added robust on-chain stats, `last_reset_slot`, and standardized Anchor 0.32 contexts |
| 2026-03-11 | **Protocol / stats** | Completed robust stats fixes and ensured `UserStats` initialization inside batch instructions |
| 2026-03-11 | **Protocol / settlement** | Made settlement resilient to stale ticket cache conditions and added diagnostic tooling for error 6017 |
| 2026-03-07 | **Contract / tokenomics** | Switched burn logic to balance-based handling for guaranteed deflation |

### Audit and observability

| Date | Area | Change |
|---|---|---|
| 2026-03-13 | **Audit / operator** | Added operational metrics, empty-round sweep, and zombie-skip logic |
| 2026-03-12 | **Audit / export** | Completed CSV traceability with slots, NIST target, minted / burned values, and transaction hashes |
| 2026-03-12 | **Audit / runtime** | Added proxy-based RPC metrics with one-line reporting |
| 2026-03-11 | **Audit / dashboard** | Stored pulse, finalize, settle, and sweep transactions for merged audit visibility |
| 2026-03-11 | **Audit / robustness** | Adjusted ticket count logic to survive post-sweep zeroing and swept-round edge cases |
| 2026-03-08 to 2026-03-09 | **Audit / archive** | Restored treasury reserve stats, active round counts, archive-first logic, and chunked fetching |

### Operator and maintenance

| Date | Area | Change |
|---|---|---|
| 2026-03-12 | **Operator / perf** | Reduced log noise and unnecessary RPC calls in maintenance logic |
| 2026-03-11 | **Operator / reliability** | Finalized persistent skip-list handling and Oracle stability improvements |
| 2026-03-04 | **Operator / architecture** | Unified supervisor with integrated audit worker and stronger cleanup logic |

### User-facing surfaces

| Date | Area | Change |
|---|---|---|
| 2026-03-11 | **Beta app** | Ensured `Reveal All` executes sequentially by nonce to preserve streak correctness |
| 2026-03-11 | **Beta app** | Improved reset, close-ticket, and pending-ticket behavior using on-chain stats |
| 2026-03-11 | **Ticket manager** | Added balance display on every run |

## February 2026 — Audit system expansion, Devnet operations, and protocol cleanup

### Audit platform

| Date | Area | Change |
|---|---|---|
| 2026-02-16 to 2026-02-17 | **Audit / architecture** | Introduced server-side audit indexer, lightweight dashboard sync model, and Firebase Realtime Database integration |
| 2026-02-17 | **Audit / UX** | Added transparency links, network volume metrics, treasury precision, and financial clarity layouts |
| 2026-02-20 to 2026-02-22 | **Audit / export** | Added single-range export, proof-oriented JSON export, historical CSV fixes, and technical backfill improvements |
| 2026-02-21 to 2026-02-22 | **Audit / correctness** | Fixed duplicate rounds, volume inflation, stale state, empty-round handling, and integrity indicators |
| 2026-02-27 to 2026-02-28 | **Audit / polish** | Improved explorer links, precision handling, and export fallback addresses |

### Protocol, operator, and Devnet hardening

| Date | Area | Change |
|---|---|---|
| 2026-02-08 | **Protocol / economics** | Added SOL-neutrality, fund recovery, treasury withdrawal instructions, and service-fee infrastructure |
| 2026-02-21 to 2026-02-22 | **Protocol / operations** | Added empty-round auto-sweep, pulse bypass for zero-ticket rounds, and lifecycle-aware sync fixes |
| 2026-02-07 to 2026-02-11 | **Operator / resilience** | Added deep-sweep and diagnostic tools, improved IDL sourcing, background reclaim execution, RPC fallback, and remote-server support |
| 2026-02-18 | **Operator / safety** | Prevented concurrent reclaimer execution in the Devnet supervisor |
| 2026-02-22 | **Operator / efficiency** | Skipped NIST work for empty rounds and reduced worker / operator poll overhead |

### UI and UX evolution

| Date | Area | Change |
|---|---|---|
| 2026-02-01 to 2026-02-04 | **Beta app** | Built a richer round timeline, ticket detail traceability, export metadata, and stronger local persistence |
| 2026-02-08 to 2026-02-10 | **Beta app** | Unified terminology, improved onboarding, stabilized RPC behavior, and polished the dashboard / controls |
| 2026-02-13 | **Packaging** | Added Electron wrapper, PWA support, and activity monitor tooling |
| 2026-02-26 | **Embedding** | Removed resize restrictions for smoother MkDocs embedding |

## January 2026 — Public Devnet MVP formation, migration, and lifecycle completion

### Public beta and Devnet surface

| Date | Area | Change |
|---|---|---|
| 2026-01-04 to 2026-01-07 | **Beta app** | Brought the public Devnet beta online with faucet support, Play tab, MyTickets, and ticket actions |
| 2026-01-11 to 2026-01-19 | **UI / operator** | Added NIST pipelining, commit-window timing, multi-round visibility, countdowns, and pulse-centric interaction |
| 2026-01-20 to 2026-01-24 | **UI / analytics** | Introduced Wallet Sankey, refined history flows, improved exports, and strengthened telemetry surfaces |

### Protocol lifecycle and recovery

| Date | Area | Change |
|---|---|---|
| 2026-01-13 | **Protocol / rent recovery** | Added `close_round`, automated sweep step, and reclaim tooling |
| 2026-01-15 | **Protocol / settlement** | Added permissionless settlement path, contract auto-finalize behavior, and frontend crank support |
| 2026-01-25 | **Protocol / recovery** | Implemented permissionless fund recovery and strengthened sweep behavior |
| 2026-01-27 | **Protocol / liveness** | Enforced `PulseTooLate` checks and hardened refund safety |
| 2026-01-29 to 2026-01-30 | **Protocol / migration** | Performed the nuclear migration to the current Program ID and mint, then added robust rent recovery and tokenomics update tooling |

### Migration and compatibility

| Date | Area | Change |
|---|---|---|
| 2026-01-22 | **Branding / architecture** | Rebranded the program globally to TIMLG Protocol and synchronized docs, scripts, and seeds |
| 2026-01-28 | **Protocol / state model** | Upgraded the protocol to a v3 state layout and synchronized frontend and operator derivation logic |
| 2026-01-28 to 2026-01-31 | **Migration / UI** | Added mint-based filtering, aggressive cache clearing, history reconstruction, and browser resilience across redeployments |

## December 2025 — Protocol foundation and first Devnet end-to-end flow

### Core protocol completion

| Date | Area | Change |
|---|---|---|
| 2025-12-19 | **Protocol / batching** | Added batch commit / reveal for multi-ticket localnet flow |
| 2025-12-20 | **Protocol / signing** | Completed signed batching and locked down deterministic `derive_bit_index` behavior |
| 2025-12-21 | **Protocol / oracle** | Closed the canonical signed pulse path using ed25519 introspection and claim-grace enforcement |
| 2025-12-22 | **Protocol / balances** | Verified burn-on-commit, reveal outcome assignment, and reward minting with balance-based tests |
| 2025-12-23 | **Protocol / lifecycle** | Completed the whitepaper-aligned lifecycle, including finalize, sweep, claim, replay protection, and signed-path hardening |
| 2025-12-28 | **Protocol / settlement** | Made token settlement incremental and idempotent with `settled_count` and processed tickets |
| 2025-12-29 | **Devnet** | Added RoundRegistry, auto round creation, one-shot E2E runner, tokenomics initialization, and signed NIST oracle scripts |
| 2025-12-31 | **Devnet** | Fixed tokenomics PDA resolution and enabled winner reward claims on Devnet |

### Security and trust boundaries

| Date | Area | Change |
|---|---|---|
| 2025-12-24 | **Oracle security** | Added NIST fetcher and signed messenger scaffolding |
| 2025-12-27 | **Oracle security** | Moved oracle keys out of the repository, added guardrails, and tested oracle rotation |
| 2025-12-28 | **Oracle administration** | Added OracleSet allowlist and threshold administration tooling |
| 2025-12-29 | **ed25519 verification** | Hardened instruction introspection by requiring self-contained indices |

## Earlier baseline

| Date | Area | Change |
|---|---|---|
| 2025-12-19 | **Repository** | Initial public development baseline for the MVP codebase |

## Reading Notes

- This changelog is optimized for **technical comprehension**, not for listing every UI polish commit.
- Repeated micro-fixes were consolidated into milestone-level entries where the underlying technical theme was the same.
- The purpose of the page is to show **how the current protocol and Devnet surface were assembled**, not to reproduce raw `git log` output.
