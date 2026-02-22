# Whitepaper Changelog

## v1.2 (2026-02-22)
- **Live Audit Infrastructure**:
    - Integrated real‑time token flow analysis and categorical integrity proofs.
    - Added the Audit Dashboard as a core evidential layer for decentralized transparency.
- **Economic Stabilization**:
    - Finalized the **SOL Service Fee** requirement for participation.
    - Documented the active **100 bps (1\%)** Reward Fee on winning outcomes.
    - Clarified the **dual-treasury** architecture (SOL for operations, SPL for rewards/governance).
- **Roadmap Advancement**:
    - Marked Phase 1 (operational core) and Phase 2 (audit tools) as successfully deployed/integrated.
    - Updated focus towards Decentralized Relayers and UX Hardening.

## v1.1 (2026-02-02)
- **Technical Alignment**:
    - Synchronized documentation with current Devnet parameters (420s betting horizon, 1000 slot reveal window).
    - Clarified settlement rules: stake return + reward mint for winners; stake burn for losers/no-reveals.
- **Protocol Refinements**:
    - Added explicit cross-references for technical appendices.
    - Improved formatting for PDF generation (Prime/ArXiv style stability).

## v1.0-beta (2026-01-25)
- **Protocol Implementation alignment**:
    - Bit extraction fixed to LSB-first convention.
    - BitIndex derived deterministically from SHA256 of metadata.
    - Commitment formula corrected to include all domain-separated fields.
- **Tokenomics**:
    - **NO-REVEAL burn**: non-revealed tickets are now burned instead of forfeited to treasury.
    - **Reward fee**: introduced protocol fee on rewards.
    - **Sweep mechanism**: added graceful recovery of unclaimed tokens.
- **Security**:
    - Transitioned to single-oracle Ed25519 signature verification for v1.0.
    - Defined explicit message schemas for commit, reveal, and pulse.
- **Infrastructure**:
    - Round-specific vaults (SOL + SPL) and slot-based refund logic.

## v0.1 (2025-12-18)
- Documentation site online
- Initial public structure and conceptual draft
