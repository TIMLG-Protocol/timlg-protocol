# TIMLG Protocol — Docs Site

This repository hosts the **public documentation website** for the TIMLG Protocol.

- **Website:** https://timlg-protocol.github.io/timlg-protocol/
- **Scope:** specs + whitepaper + roadmap + status (public)
- **Non-scope:** private keys, privileged infrastructure, and operational runbooks (never published here)

## What TIMLG is (MVP)

TIMLG is a slot‑bounded **commit–reveal protocol** that uses a publicly verifiable **randomness pulse**:

1. Users **commit** a ticket during the commit window.
2. An oracle publishes a 512‑bit pulse after commits close.
3. Users **reveal** their guess + salt; the program verifies the commitment.
4. The round is finalized, token settlement runs, winners **claim**, and unclaimed SOL can be swept after a grace period.

## Code repository

The on-chain program and oracle tooling are maintained in a **separate private repository** while the MVP is being stabilized and deployed to devnet.  
When the devnet release is ready, the code will be published alongside a tagged whitepaper release.

## Security & control

- Do not publish private keys, seed phrases, signer files, RPC secrets, or privileged automation here.
- Prefer multisig and separation of duties for treasury and upgrade authority as the project matures.

## Development (docs)

This site uses MkDocs + Material and deploys via GitHub Pages.

### Local preview

```bash
pip install -r requirements.txt
mkdocs serve
```

### Deploy

Pushing to `main` triggers the GitHub Actions workflow that builds and deploys the site.

---

**Last updated:** 2025-12-25
