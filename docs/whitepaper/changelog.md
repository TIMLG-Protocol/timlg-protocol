# Whitepaper Changelog

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
