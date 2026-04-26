# Operator Runbook (Devnet)

| Document Control | Value |
|---|---|
| **Purpose** | Practical operational guide for observing and exercising the Devnet MVP |
| **Audience** | Developers, reviewers, operators |

This runbook is intentionally practical. It focuses on how the current Devnet deployment is observed
and operated through the public SDKs, not on aspirational architecture.

## 1. Environment baseline

| Variable | Meaning |
|---|---|
| `RPC_URL` | Devnet RPC endpoint |
| `PROGRAM_ID` | Current deployed program ID (`GeA3JqAjAWBCoW3JVDbdTjEoxfUaSgtHuxiAeGG5PrUP`) |
| `TIMLG_MINT` | Current Devnet mint used by the protocol |
| `ORACLE_KEYPAIR_PATH` | Path to your oracle Ed25519 keypair (only needed if running an oracle node) |
| `RELAYER_KEYPAIR_PATH` | Path to a fee-paying keypair for the supervisor / oracle |

The reference implementations live in the public code repo at
[`github.com/richarddmm/timlg-protocol`](https://github.com/richarddmm/timlg-protocol). Each SDK ships
with a `.env.example` and a README.

## 2. Standard workflow

The off-chain operator layer is split into three SDKs that act only through public, permissionless
or quorum-gated instructions.

### 2.1. Run the round-lifecycle supervisor

```bash
# Continuous tick loop (round creation, quorum assembly, finalize, settle, sweep, close, recovery)
node protocol-supervisor-sdk/index.mjs
```

The supervisor never participates in consensus. It reads on-chain config / registry, computes the
canonical next target, and submits permissionless transactions.

### 2.2. Run an oracle node

```bash
# Continuous attestation loop (NIST fetch + sign + on-chain attestation)
node oracle-node-sdk/index.mjs --action=watch
```

The oracle node only signs and posts attestations. Quorum assembly is left to any relayer (typically
the supervisor).

### 2.3. Run a user / ticket manager

```bash
# Single user lifecycle: commit, reveal, claim, refund, jackpot
node ticket-manager-sdk/index.mjs --actions=commit,reveal,claim,jackpot --daemon=60
```

## 3. Important operational clarifications

| Topic | Current reality |
|---|---|
| **Round creation** | Permissionless via `create_round_permissionless`; the program enforces the canonical-target rule |
| **Pulse acceptance** | `set_pulse_quorum` is the canonical path; single-signer is disabled for betting rounds |
| **Finalization** | `finalize_round` exists explicitly; `settle_round_tokens` will auto-finalize when conditions are met |
| **Settlement** | Permissionless; idempotent thanks to `Ticket.processed` and `Round.settled_count` |
| **Sweep** | Delayed by on-chain `claim_grace_slots`; local prechecks cannot bypass this |
| **Recovery** | Proof-gated `enter_recovery_mode` + `install_nist_anchor_quorum`; permissionless `exit_recovery_mode` after target reached or `RECOVERY_EXIT_TIMEOUT_SLOTS` |
| **Ticket cleanup** | `close_ticket` is user-driven and separate from operator sweep logic |
| **Streak jackpot** | `claim_streak_jackpot` is user-domain only; the supervisor does not participate |

## 4. Verification tasks for reviewers

| Check | Example approach |
|---|---|
| Program identity | `solana program show <PROGRAM_ID>` |
| Round inspection | Read `Round` PDA via the SDK (`fetchRound(roundId)`) |
| Pulse publication path | Observe `set_pulse_quorum` transactions and matching `OracleAttestationRecord` PDAs |
| Settlement consistency | Compare wins, losses, revealed count, pending count, and refunds via `Round` and `UserStats` |
| Streak record | Read `StreakLeaderboard` PDA via the SDK |
| NIST chain integrity | Confirm `Config.last_output_value` matches the `previous_output_value` of new pulses |

## 5. Guardrails

- Never publish private key material, signer files, or privileged operational topology in public docs.
- Treat local convenience scripts as helpers, not as the source of protocol truth.
- When local behavior and on-chain state disagree, the on-chain program wins.
