# TIMLG Protocol — Docs Site

This repository hosts the **public documentation website** for the TIMLG Protocol.

- **Website:** https://timlg.org
- **Code repository:** https://github.com/richarddmm/timlg-protocol
- **Scope of this site:** specs, whitepaper, roadmap, status, security model (public)
- **Out of scope:** private keys, signer custody, privileged operational runbooks (never published here)

## What TIMLG is (Devnet MVP)

TIMLG is a slot-bounded **commit–reveal protocol** on Solana coupled to a publicly verifiable
512-bit randomness pulse (NIST Beacon Chain 2):

1. Users **commit** a hidden guess during the commit window.
2. After the commit window closes, an authorized oracle set publishes a signed pulse.
3. Users **reveal** their guess + salt; the program verifies the commitment and classifies the ticket.
4. Tokens settle deterministically (mint on win, burn on loss / no-reveal), winners **claim**, and
   unclaimed funds can be swept after a configurable grace period.

The Devnet MVP also includes a streak-based incentive layer (Streak Jackpot) on top of the canonical
ticket lifecycle. See the `Protocol` section of the site for the canonical spec.

## Code repository

The on-chain Anchor program, the IDL, and the reference TypeScript SDK are published in a separate
public repository:

> https://github.com/richarddmm/timlg-protocol

That repository contains:

- `programs/timlg_protocol/` — the Solana on-chain program (Rust / Anchor).
- `idl/timlg_protocol.json` — the canonical IDL.
- `sdk/` — the TypeScript SDK (`@timlg/sdk`) with the modular `TimlgPlayer`, `TimlgSupervisor`, and
  `TimlgAdmin` clients, plus reference example scripts (`ticket-manager.mjs`, `oracle-node.mjs`,
  `sweep-tickets.mjs`, `sweep-rounds.mjs`).
- `LICENSE`, `SECURITY.md`, build manifests.

The on-chain program is also reachable through Solana Explorer (verifiable build):

> [`GeA3...PrUP`](https://explorer.solana.com/address/GeA3JqAjAWBCoW3JVDbdTjEoxfUaSgtHuxiAeGG5PrUP?cluster=devnet)

## Security & control

- Do not publish private keys, seed phrases, signer files, RPC secrets, or privileged automation here.
- Prefer multisig and separation of duties for treasury and upgrade authority as the project matures.

## Development (this docs site)

This site uses MkDocs + Material and deploys via GitHub Pages.

### Local preview

```bash
pip install -r requirements.txt
mkdocs serve
```

### Deploy

Pushing to `main` triggers the GitHub Actions workflow that builds and deploys the site.

---

**Last updated:** 2026-04-26
