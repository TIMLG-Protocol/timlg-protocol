# Protocol Automation

To ensure a continuous and reliable experiment, TIMLG uses an automated round management system. This avoids the need for manual intervention for every round creation.

---

## RoundRegistry

The `RoundRegistry` is a singleton PDA that maintains the global state of the automated pipeline.

- **Purpose**: Tracks the next available numeric `round_id`.
- **Instruction**: `initialize_round_registry(start_round_id)` (Admin-only).
- **Invariant**: Ensures that `round_id` values are strictly sequential and never reused.

---

## Automated Creation Flow

The protocol supports a specialized instruction for high-throughput operator pipelines:

### `create_round_auto`

This instruction creates a new round without requiring the operator to provide a manual `round_id`.

1.  **ID Allocation**: Reads `next_round_id` from the `RoundRegistry`.
2.  **State Initialization**: Creates the `Round` PDA and its associated token vaults.
3.  **Registry Update**: Increments `RoundRegistry.next_round_id`.
4.  **Timing Configuration**: Sets the `commit_deadline_slot` and `reveal_deadline_slot` based on the targeted NIST pulse.

---

## Permissionless Settlement & Auto-Finalization

To maximize decentralization and liveness, the settlement process has been hardened:

- **Permissionless**: Any user can trigger `settle_round_tokens` once the reveal window has passed.
- **Auto-Finalization**: If the round has not been manually finalized, the settlement instruction will automatically transition the round to the `Finalized` state if the pulse has been set on-chain.
- **Incremental Processing**: `settle_round_tokens` supports processing batches of tickets, making it gas-efficient for high-volume rounds.

---

---

## TIMLG Supervisor (Devnet Operations)

The devnet environment is driven by a **Supervisor Script** (`run_operator_supervisor_devnet.sh`) that manages the lifecycle of multiple rounds automatically.

### Key Operational Features:

- **Lookahead Buffer (Pipeline Depth)**: The supervisor maintains a queue of **N concurrent rounds** (default=7). This ensures that even if a NIST pulse is delayed or the network is congested, there is always an open `COMMIT` window for users.
- **Heartbeat Tick**: The operator checks the chain every 5 seconds to post pulses, finalize expired windows, and trigger settlement.
- **Sequential Safety**: Each round is strictly bound to a specific NIST pulse index. The supervisor ensures rounds are created in the correct sequence to prevent "pulse skips."

> [!TIP]
> To participate in the devnet beta, the **TIMLG Supervisor** must be running to drive the state transitions of the rounds.
