# Devnet Quickstart

| Document Control | Value |
|---|---|
| **Purpose** | Minimal path to inspect or interact with the current Devnet deployment |
| **Audience** | Developers and technical reviewers |

## 1. Prerequisites

| Requirement | Notes |
|---|---|
| Node.js | v18+ recommended |
| Solana CLI | v1.18+ recommended |
| Anchor CLI | v0.29+ recommended |
| Wallet | Funded Devnet wallet with SOL for fees |

## 2. Minimal environment

```bash
PROGRAM_ID=GeA3JqAjAWBCoW3JVDbdTjEoxfUaSgtHuxiAeGG5PrUP
TIMLG_MINT=7kpdb6snovzpm5T5rU6BKJspX7qMUwaSVv9Ki5zqSHjy
RPC_URL=https://api.devnet.solana.com
```

## 3. Common first steps

| Task | Command |
|---|---|
| Switch local tooling to devnet | `./switch_devnet.sh` |
| Run one end-to-end devnet round flow | `./run_devnet_round.sh` |
| Airdrop SOL | `solana airdrop 1` |
| Inspect a round | `node oracle/print_round_devnet.js --id <ROUND_ID>` |
| Manual settlement helper | `node oracle/settle_round_devnet_manual.js --id <ROUND_ID>` |

## 4. Notes

- Use the **Operator Runbook** for the full operational flow.
- Treat any UI wall-clock estimates as approximations; the protocol enforces slots.
- Ensure the mint and program ID in your environment match the current deployment before interpreting balances.
