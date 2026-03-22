# Operator Runbook (Devnet)

| Document Control | Value |
|---|---|
| **Purpose** | Practical operational guide for observing and exercising the Devnet MVP |
| **Audience** | Developers, reviewers, operators |

This runbook is intentionally practical. It focuses on how the current devnet deployment is observed and operated, not on aspirational architecture.

## 1. Environment baseline

| Variable | Meaning |
|---|---|
| `RPC_URL` | Devnet RPC endpoint |
| `PROGRAM_ID` | Current deployed program ID |
| `TIMLG_MINT` | Current devnet mint used by the protocol |
| `ORACLE_PUBKEY` | Authorized pulse signer public key |

## 2. Standard workflow

| Phase | Typical tool / script | Purpose |
|---|---|---|
| **Prepare devnet config** | `./switch_devnet.sh` | Align local environment with current devnet deployment |
| **Create / maintain rounds** | `node index.mjs --actions=scheduler` | Supervisor-driven loop ensuring commit windows remain open |
| **Post pulses** | `node index.mjs --actions=pulse` | Supervisor-driven automated entropy submission |
| **Finalize / settle / recover** | `node index.mjs --actions=settle,recover` | Supervisor-driven handling of normal outcomes, salvage, and gap recoveries |
| **Inspect state** | Live Audit UI | Verify round, anchor, and ticket status reliably without private scripts |
| **Sweep / cleanup** | `node index.mjs --actions=sweep,close` | Supervisor-driven delayed cleanup after strict grace slots |

## 3. Important operational clarifications

| Topic | Current reality |
|---|---|
| **Finalization** | `finalize_round` is an explicit admin path; settlement logic may auto-finalize under valid conditions |
| **Settlement** | `settle_round_tokens` is the key accounting step for burns and winner preparation |
| **Sweep** | Sweep is delayed by on-chain `claim_grace_slots`; local prechecks cannot bypass this |
| **Ticket cleanup** | `close_ticket` remains user-driven and separate from operator sweep logic |

## 4. Verification tasks for reviewers

| Check | Example approach |
|---|---|
| Program identity | `solana program show <PROGRAM_ID>` |
| Round inspection | `node oracle/print_round_devnet.js --id <ROUND_ID>` |
| Pulse publication path | Observe `set_pulse_signed` transactions and matching state changes |
| Settlement consistency | Compare wins, losses, revealed count, pending count, and refunds |

## 5. Guardrails

- Never publish private key material, signer files, or privileged operational topology in public docs.
- Treat local convenience scripts as helpers, not as the source of protocol truth.
- When local behavior and on-chain state disagree, the on-chain program wins.
