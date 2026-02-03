# Operator Runbook (Devnet)

This document provides a technical walkthrough for developers and grant reviewers to observe and verify the **TIMLG Protocol** on Solana Devnet.

> [!NOTE]
> This runbook is designed to work with the `public_export` repository structure, focusing on verification and the core oracle infrastructure.

---

## 1. Prerequisites

- **Solana CLI**: `solana 1.18.x` or higher.
- **Node.js**: `v18.x` or `v20.x`.
- **Anchor Framework**: `v0.29.0`.

---

## 2. Environment Setup

The oracle scripts rely on a `.env` file for RPC and Program addresses.

```bash
# RPC Configuration
RPC_URL="https://api.devnet.solana.com"

# Protocol Identities
PROGRAM_ID="GeA3JqAjAWBCoW3JVDbdTjEoxfUaSgtHuxiAeGG5PrUP"
TIMLG_MINT="7kpdb6snovzpm5T5rU6BKJspX7qMUwaSVv9Ki5zqSHjy"
```

---

## 3. Protocol Observation & Verification

### Phase A: Verifying the Program
The protocol leverages **verifiable builds**. Anyone can verify that the code in the repository matches the on-chain binary using the `solana-verify` tool.

```bash
# Verify on-chain binary against this repository
solana-verify verify-from-repo \
  -u https://api.devnet.solana.com \
  --program-id [PROGRAM_ID] \
  [REPO_URL]
```

### Phase B: Observing the Oracle
The operator node manages the lifecycle of rounds, aligning them with NIST pulses.

```bash
# Observe the core oracle logic in action
node oracle/run_oracle_devnet.js
```

### Phase C: Strategic Interaction
Developers can use the provided infrastructure scripts to simulate protocol behaviors.

```bash
# Simulate automated round creation
node oracle/create_round_auto_devnet.js

# Trigger settlement for a completed round
node oracle/settle_round_tokens_auto_devnet.js
```

---

## 4. Key Logic (Showcase)

The following files in the `oracle/` directory contain the core logic for the verifiable timing mechanism:

- `nist.js`: Handles pulse fetching and Ed25519 signature verification.
- `keys.js`: Management of protocol-derived addresses and signing identities.
- `run_oracle_devnet.js`: High-level supervisor loop for round pipelines.

---

## 5. Security & Safety

- **Read-Only Verification**: Most oversight can be done via `solana program show` or the Solana Explorer.
- **Permissionless Settlement**: Any participant can trigger the finalization of a round once the pulse is set, ensuring the protocol cannot be stalled by the operator.
