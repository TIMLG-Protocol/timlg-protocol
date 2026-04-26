# Current Status

TIMLG Protocol is currently in **Public Devnet MVP**. The on-chain program, the off-chain SDKs, the
user-facing beta flow, and the live audit surface are all active. The deployment should still be
read as a **development network system under active hardening**, not as a final production release.

## Deployment Summary

| Area | Current State | Notes |
|---|---|---|
| **Network** | Public Devnet | The canonical public environment for the MVP |
| **Program** | Deployed and exercised continuously | Verifiable build at `GeA3...PrUP` |
| **Oracle model** | OracleSet quorum (M-of-N Ed25519) with NIST chaining | Single-signer fallback exists but is disabled for betting rounds |
| **Operator / supervisor** | Active | `protocol-supervisor-sdk` runs the pipeline (round creation, quorum assembly, finalize, settle, sweep, close, recovery) |
| **Oracle nodes** | Active | `oracle-node-sdk` runs as independent attestation publishers; signatures persisted in on-chain Attestation Board PDAs |
| **User flow** | End-to-end operational | Commit, reveal, claim, refund, sweep visibility, rent recovery, jackpot claim |
| **Streak Jackpot** | Active | `StreakLeaderboard` initialized; `claim_streak_jackpot` claimable as soon as the streak record is broken |
| **Audit surface** | Active and traceable | Live audit, CSV export, archive sync, transaction traceability |
| **Public source code** | Public | Smart contract, IDL, and TypeScript SDK at `github.com/richarddmm/timlg-protocol` |
| **Documentation** | Active | Status, protocol, security, lifecycle, runbook, troubleshooting, glossary, streak jackpot |

## Protocol Scope Implemented Today

| Capability | State | Notes |
|---|---|---|
| **Commit / reveal base flow** | Implemented | Single-ticket and batched paths |
| **Batch commit / reveal** | Implemented | Both `commit_batch` / `reveal_batch` and signed variants for relayed flows |
| **Multi-oracle quorum pulse path** | Implemented | `set_pulse_quorum` with on-chain Ed25519 verification per signer |
| **NIST chaining** | Implemented | `last_output_value` and `last_precommitment_value` enforced after first anchor |
| **Permissionless round creation** | Implemented | `create_round_permissionless` + canonical-target rule |
| **Continuity rounds** | Implemented | `RoundKind::Continuity` for technical sequencing without commits |
| **Finalize / settle / claim lifecycle** | Implemented | Lazy / permissionless settlement + auto-finalize |
| **Refund path** | Implemented | Owner and permissionless variants (`recover_funds`, `recover_funds_anyone`) |
| **Sweep and rent recovery** | Implemented | Sweep automation, `close_ticket`, `close_round`, reclaim scripts |
| **User statistics** | Implemented | Counters, longest streak, current streak, `refunded_in_streak_window` |
| **Streak Jackpot** | Implemented | `StreakLeaderboard` PDA + `claim_streak_jackpot` (live) |
| **Recovery mode** | Implemented | `enter_recovery_mode` + `install_nist_anchor_quorum` + `exit_recovery_mode` (proof-gated) |
| **Audit traceability** | Implemented | Historical archive, CSV export, tx capture, proof-oriented export |

## Current Operational Capabilities

### Core protocol

| Surface | Status | Notes |
|---|---|---|
| **Round creation** | Operational | Permissionless via `create_round_permissionless` |
| **Commit window enforcement** | Operational | Includes `PulseTooLate` liveness check |
| **Reveal window enforcement** | Operational | UI and protocol both track reveal / claim timing |
| **Pulse publication** | Operational | Quorum path with Ed25519 + NIST chain verification |
| **Settlement** | Operational | Lazy/permissionless paths and stale-cache hardening |
| **Claim** | Operational | Winner claims live on Devnet |
| **Sweep** | Operational | Grace-gated sweep and zero-ticket round handling |
| **Rent recovery** | Operational | Ticket closure and batch reclaim flows |
| **Streak Jackpot** | Operational | `claim_streak_jackpot` callable by any user whose `current_streak` exceeds the on-chain record |
| **Recovery mode** | Operational | Proof-gated entry, quorum-installed anchor, permissionless exit on target reach or timeout |

### Off-chain operator and oracle layer

| Surface | Status | Notes |
|---|---|---|
| **`protocol-supervisor-sdk`** | Operational | Permissionless tick loop; never participates in consensus |
| **`oracle-node-sdk`** | Operational | Independent oracle nodes publish attestations to the on-chain Attestation Board |
| **`ticket-manager-sdk`** | Operational | User-side commit / reveal / claim / refund / jackpot |
| **TypeScript SDK** | Operational | `TimlgPlayer`, `TimlgSupervisor`, `TimlgAdmin` |
| **RPC resilience** | Hardened | Multiple rounds of caching, throttling, 429 handling, dual-RPC fallback |
| **Metrics and observability** | Operational | One-line RPC metrics, operational counters, richer audit output |

### User-facing surfaces

| Surface | Status | Notes |
|---|---|---|
| **Beta app** | Operational | Public Devnet interface with full lifecycle support |
| **Ticket history** | Mature for Devnet MVP | Filtering, contextual actions, export, local resilience |
| **Round timeline / modal** | Operational | Timeline, traceability, explorer links |
| **Live audit** | Operational | Audit worker, archive sync, CSV export, tx traceability |

## Current Technical Characteristics

| Topic | Current position |
|---|---|
| **Oracle trust model** | **Trust-minimized** with M-of-N quorum and NIST chaining. See [Oracle Trust Model](../protocol/oracle_trust_model.md) |
| **Settlement model** | Deflationary settlement with permissionless / lazy paths |
| **Round creation model** | Permissionless with on-chain canonical-target rule |
| **Audit model** | Chain-derived data + synchronized archive / export layers |
| **Stats model** | On-chain `UserStats` and `StreakLeaderboard` are first-class protocol surfaces |
| **Environment model** | Devnet-first public MVP with frequent protocol and tooling iteration |

## What Is Stable Enough To Rely On

| Behaviour | Why |
|---|---|
| **Devnet is the canonical public environment** | The release pipeline targets Devnet for the public MVP |
| **Quorum + NIST chain is the current trust model** | Single-signer is disabled for betting rounds; quorum is the default acceptance path |
| **User flow is complete enough for real protocol exercise** | Full lifecycle from commit to rent recovery and jackpot claim |
| **Streak Jackpot is a live on-chain surface** | The pool is funded by the SOL service fee and claimable by any record-breaking user |
| **Audit and observability are first-class surfaces** | Continuous work on audit correctness and export quality |
| **Public source code is now available** | Anchor program, IDL, and SDK published at `github.com/richarddmm/timlg-protocol` |

## Known Constraints

| Constraint | Practical meaning |
|---|---|
| **Devnet-only public posture** | Reliability and economics should be read as MVP behavior, not production guarantees |
| **Threshold-trusted oracle set** | Quorum reduces single-signer risk, but full collusion of `threshold` oracles is not detectable on-chain. zkTLS / NIST-binding proof remains future hardening |
| **Treasury withdrawal guard not yet active** | `TREASURY_WITHDRAW_MAX_ACTIVE_WINNERS` is defined in constants but **not wired** into `withdraw_treasury_tokens`; scheduled for a future upgrade |
| **SOL service fee has no on-chain cap** | `update_sol_service_fee` has no upper bound; admin discretion still applies |
| **Operational complexity still lives off-chain** | Supervisor, oracle nodes, audit worker, and reclaim tools remain essential — though all act through public, permissionless on-chain instructions |
| **UI and audit are actively refined** | The surfaces are usable, but their presentation and edge-case handling continue to evolve |

## Near-Term Documentation Priorities

| Documentation priority | Why it matters |
|---|---|
| **Streak Jackpot semantics** | The on-chain mechanic is live; users need a clear claim flow and audit surface |
| **Quorum + NIST chaining** | The current trust model differs from older single-signer descriptions and needs to be unambiguous |
| **Recovery mode operator workflow** | Replaces the legacy `syncLatestPulse` mechanism; entry / exit conditions matter to operators |
| **Public SDK guidance** | Now that the SDK is public, examples and integration patterns deserve clean documentation |

## Direction (non-binding)

!!! note "Forward-looking, not committed"
    This section describes the **direction** the protocol is moving in. It is **not a roadmap with
    deadlines** and it is **not a commitment**. What is operational today is documented in the tables
    above; what has actually shipped is documented in the [Changelog](changelog.md). Anything below is
    a working hypothesis that may change without notice.

| Working item | What we are exploring | Status |
|---|---|---|
| **Mainnet hardening** | Audits, deployment topology, governance multisig, parameter freezing | Planning |
| **Public relayer for gasless participation** | An open relayer surface that accepts user-signed envelopes (`commit_batch_signed` and friends), submits them on-chain, and is replaceable by anyone | Research / API design |
| **zkTLS / NIST-binding proof** | A protocol-level cryptographic proof that the pulse delivered to the program is the one published by NIST, removing residual trust on the oracle quorum | Research |
| **Tokenomics and treasury parameter governance** | Moving SOL service fee, threshold, grace windows, and treasury withdrawal limits to a governance-controlled change path | Conceptual |
| **Strategy / research SDK** | Higher-level tooling for participants who want to script bit-prediction experiments on top of the public SDK | Backlog |

These are working notes for technical reviewers, not promises. The single source of truth for what
the protocol does today is the [Architecture Overview](../protocol/overview.md), the on-chain program,
and the [Changelog](changelog.md).

## Interpretation Guide

This page is intentionally conservative.

- It describes **what is operational today**, not every experimental branch or discarded idea.
- It treats the program source code at `github.com/richarddmm/timlg-protocol` as the source of truth.
- It avoids presenting future work as if it were already part of the canonical public deployment.
