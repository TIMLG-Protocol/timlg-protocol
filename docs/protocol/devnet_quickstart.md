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

## 3. Get the public source

The on-chain Anchor program, the IDL, and the TypeScript SDK are public:

```bash
git clone https://github.com/richarddmm/timlg-protocol.git
cd timlg-protocol

# Build the SDK
cd sdk
npm install
npm run build
cd ..

# Inspect the IDL
cat idl/timlg_protocol.json | jq '.instructions[].name'
```

## 4. Common first steps

| Task | Command |
|---|---|
| Airdrop SOL | `solana airdrop 1 --url $RPC_URL` |
| Verify the program | `solana program show $PROGRAM_ID --url $RPC_URL` |
| Run the player demo | `node sdk/examples/ticket-manager.mjs --action=all --daemon=60` |
| Run the oracle demo | `node sdk/examples/oracle-node.mjs --action=watch` |
| Reclaim ticket rent | `node sdk/examples/sweep-tickets.mjs <KEYPAIR_PATH>` |

## 5. Programmatic access

```ts
import { TimlgClient } from "@timlg/sdk";

const client = await TimlgClient.create(wallet, { cluster: "devnet" });

// Read state
const config       = await client.player.fetchConfig();
const stats        = await client.player.fetchUserStats(wallet.publicKey);
const leaderboard  = await client.player.fetchStreakLeaderboard();

// User actions
const { receipt }  = await client.player.commit(roundId, guess, { timlgMint, userTimlgAta });
await client.player.reveal(receipt);
await client.player.claim(receipt, { timlgMint, userTimlgAta });
```

## 6. Notes

- Treat any UI wall-clock estimates as approximations; the protocol enforces slots.
- Ensure the mint and program ID in your environment match the current deployment before
  interpreting balances.
- Use the [Operator Runbook](../runbook-devnet.md) for the supervisor / oracle flows.
