# Roadmap

The TIMLG roadmap outlines a rigorous path from cryptographic foundation to mainnet-scale production. Over 85% of the core protocol and infrastructure is already functional on Devnet. 
Devnet is live; ongoing hardening focuses on RPC rate-limits (HTTP/WebSocket 429) and late pulse handling (PulseTooLate).

**Last updated:** 2026-02-09

---

## Technical Milestones

Each stage represents a critical piece of the protocol's architecture.

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 1: Multi-Round Cryptographic Core</strong></summary>

The engine that enforces the "Hawking Wall" principle.
- **Focus**: Secure slot-bounded commitment and revelation phases.
- **Status**: Production-ready. Verified on Localnet and Devnet.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 2: Deterministic Oracle & Pulse Verification</strong></summary>

Anchoring the protocol to public, verifiable randomness.
- **Focus**: Ed25519 on-chain verification of signed NIST pulses.
- **Status**: Integrated. Supporting 24/7 autonomous rounds.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 3: Escrow & Signed Participation (Gasless-Ready)</strong></summary>

Building the foundation for zero-SOL user participation.
- **Focus**: On-chain escrow accounts and batched, signed participation instructions.
- **Status**: Logic implemented in Rust and ready for Relayer integration.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 4: Automated Lifecycle & Settlement Engine</strong></summary>

Removing manual intervention from the protocol's daily operations.
- **Focus**: The "Supervisor" system that handles round creation, state transitions, and prize distribution.
- **Status**: Operational on Devnet.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 5: High-Trust Tokenomics & Burn Mechanics</strong></summary>

Aligning incentives and ensuring the protocol's economic security.
- **Focus**: Deflationary burn for losses and unrevealed stakes, with transparent fee routing.
- **Status**: Deployed on Devnet; parameters subject to tuning.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 6: Premium Non-Custodial Beta</strong></summary>

A world-class interface for the TIMLG experiment.
- **Focus**: Pro-grade dashboard with real-time P&L, ticket history, and NIST pulse tracking.
- **Status**: [Live on Devnet](/beta/) — Try it now.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon success"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> <strong>Stage 7: Resource Recycling & SOL Sustainability</strong></summary>

Optimizing the protocol's on-chain storage footprint.
- **Focus**: Automated `close_round` mechanics to reclaim rent and cycle lamports back to the treasury.
- **Status**: Integrated and operational on Devnet.
</details>

<details class="roadmap-stage" markdown="1" open>
<summary><span class="roadmap-icon progress"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> <strong>Stage 8: Public Relayer & Scale Testing</strong></summary>

Opening the protocol to users without SOL balances.
- **Focus**: Decentralized relayer infrastructure to submit user-signed envelopes on-chain.
- **Status**: Research and API development stage (Stage 8).
</details>

<details class="roadmap-stage" markdown="1">
<summary><span class="roadmap-icon planned"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg></span> <strong>Stage 9: Mainnet Alpha & Fundraising Launch</strong></summary>

Hardening the protocol for institutional-grade production.
- **Focus**: Multisig governance, security audits, and production Timings.
- **Status**: Planning.
</details>

---

## Future Trajectory

- **Cross-Chain Expansion**: Bringing TIMLG entropy to other high-performance chains.
- **DAO Governance**: Handing protocol parameters to the community via TIMLG token voting.
- **Advanced Strategy SDK**: Tooling for researchers to automate their bit-prediction experiments.
