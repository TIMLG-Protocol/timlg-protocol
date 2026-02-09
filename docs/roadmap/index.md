# Roadmap

The TIMLG roadmap outlines a rigorous path from cryptographic foundation to mainnet-scale production. Over 85% of the core protocol and infrastructure is already functional on Devnet. 
Devnet is live; ongoing hardening focuses on RPC rate-limits (HTTP/WebSocket 429) and late pulse handling (PulseTooLate).

**Last updated:** 2026-02-09

---

## Technical Milestones

Each stage represents a critical piece of the protocol's architecture.

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 1: Multi-Round Cryptographic Core</h3>
</div>
<div class="roadmap-content" markdown="1">
The engine that enforces the "Hawking Wall" principle.
- **Focus**: Secure slot-bounded commitment and revelation phases.
- **Status**: Production-ready. Verified on Localnet and Devnet.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 2: Deterministic Oracle & Pulse Verification</h3>
</div>
<div class="roadmap-content" markdown="1">
Anchoring the protocol to public, verifiable randomness.
- **Focus**: Ed25519 on-chain verification of signed NIST pulses.
- **Status**: Integrated. Supporting 24/7 autonomous rounds.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 3: Escrow & Signed Participation (Gasless-Ready)</h3>
</div>
<div class="roadmap-content" markdown="1">
Building the foundation for zero-SOL user participation.
- **Focus**: On-chain escrow accounts and batched, signed participation instructions.
- **Status**: Logic implemented in Rust and ready for Relayer integration.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 4: Automated Lifecycle & Settlement Engine</h3>
</div>
<div class="roadmap-content" markdown="1">
Removing manual intervention from the protocol's daily operations.
- **Focus**: The "Supervisor" system that handles round creation, state transitions, and prize distribution.
- **Status**: Operational on Devnet.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 5: High-Trust Tokenomics & Burn Mechanics</h3>
</div>
<div class="roadmap-content" markdown="1">
Aligning incentives and ensuring the protocol's economic security.
- **Focus**: Deflationary burn for losses and unrevealed stakes, with transparent fee routing.
- **Status**: Deployed on Devnet; parameters subject to tuning.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 6: Premium Non-Custodial Beta</h3>
</div>
<div class="roadmap-content" markdown="1">
A world-class interface for the TIMLG experiment.
- **Focus**: Pro-grade dashboard with real-time P&L, ticket history, and NIST pulse tracking.
- **Status**: [Live on Devnet](/beta/) — Try it now.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-gold"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 7: Resource Recycling & SOL Sustainability</h3>
</div>
<div class="roadmap-content" markdown="1">
Optimizing the protocol's on-chain storage footprint.
- **Focus**: Automated `close_round` mechanics to reclaim rent and cycle lamports back to the treasury.
- **Status**: Integrated and operational on Devnet.
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-silver"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 8: Public Relayer & Scale Testing</h3>
</div>
<div class="roadmap-content" markdown="1">
Opening the protocol to users without SOL balances.
- **Focus**: Decentralized relayer infrastructure to submit user-signed envelopes on-chain.
- **Status**: Research and API development stage (Stage 8).
</div>
</div>

<div class="roadmap-stage">
<div class="roadmap-header">
<span class="roadmap-medal medal-bronze"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.21 13.89L7 23l5-3l5 3l-1.21-9.12"></path><circle cx="12" cy="8" r="7"></circle></svg></span>
<h3 class="roadmap-title">Stage 9: Mainnet Alpha & Fundraising Launch</h3>
</div>
<div class="roadmap-content" markdown="1">
Hardening the protocol for institutional-grade production.
- **Focus**: Multisig governance, security audits, and production Timings.
- **Status**: Planning.
</div>
</div>

---

## Future Trajectory

- **Cross-Chain Expansion**: Bringing TIMLG entropy to other high-performance chains.
- **DAO Governance**: Handing protocol parameters to the community via TIMLG token voting.
- **Advanced Strategy SDK**: Tooling for researchers to automate their bit-prediction experiments.
