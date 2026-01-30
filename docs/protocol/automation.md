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

## 4. TIMLG Supervisor (Devnet Operations)

The protocol's off-chain infrastructure runs a continuous **Supervisor** process (Oracle Operator) to manage rounds.

### 4.1 Standard Operator

The standard operator implementation (`node oracle/run_oracle_devnet.js`) manages the full lifecycle:

*   **Dynamic Commit Windows (NIST Mode)**: Uses `ROUND_SCHEDULER_MODE=nist` to align rounds with external randomness arrival time.
*   **Standardized Reveal**: Uses `1000 slots` (~6.5 min) reveal window.
*   **Pipeline Management**: Maintains a lookahead buffer (Default=7 rounds) to ensure continuous availability.
*   **Heartbeat Tick**: Checks chain state frequently to trigger transitions.

### 4.2 Operational Features

*   **Cost Efficiency**: Checks strict preconditions (including grace periods) before sending transactions.
*   **Sequential Safety**: Enforces strict ordering of pulse indices.
*   **Concurrency**: Capable of handling pulse injection, creation, and settlement in parallel.


---

## User-driven cleanup (ticket rent)

Automation manages **round creation, pulse posting, finalize/settle, and sweeps**. Ticket rent recovery is intentionally **user-driven**:

- `close_ticket` is signed by the ticket owner and returns the ticket PDA’s lamports to the user.
- Sweeps do **not** close user tickets.

This design reduces centralized maintenance and keeps user cleanup permissioned to the owner.

!!! note "Grace windows"
    The canonical sweep eligibility is enforced by the program using `claim_grace_slots` from on-chain `Config`.
    The supervisor may use a shorter local precheck before attempting sweeps, but early attempts will be rejected on-chain.
