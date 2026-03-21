# Technical Architecture: Operational Automation

| Metadata | Specification |
|---|---|
| **Document ID** | TP-OPER-001 |
| **Component** | Supervisor, Cranker & Relayer Strategy |
| **Last updated** | March 2026 |

To ensure a continuous and reliable protocol, TIMLG uses an automated round management system. The current production implementation is the `protocol-supervisor-sdk` (Node.js), which handles the full lifecycle: round creation, pulse publication, finalization, settlement, sweep, and cleanup.

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

1. **ID Allocation**: Reads `next_round_id` from the `RoundRegistry`.
2. **State Initialization**: Creates the `Round` PDA and its associated token vaults.
3. **Registry Update**: Increments `RoundRegistry.next_round_id`.
4. **Timing Configuration**: Sets the `commit_deadline_slot` and `reveal_deadline_slot` based on the targeted NIST pulse.

---

## Permissionless Settlement & Auto-Finalization

To maximize decentralization and liveness, the settlement process has been hardened:

- **Permissionless**: Any user can trigger `settle_round_tokens` once the reveal window has passed.
- **Auto-Finalization**: If the round has not been manually finalized, the settlement instruction will automatically transition the round to the `Finalized` state if the pulse has been set on-chain.
- **Incremental Processing**: `settle_round_tokens` supports processing batches of tickets, making it gas-efficient for high-volume rounds.

---

## Protocol Supervisor SDK

The current off-chain infrastructure is implemented in `protocol-supervisor-sdk/index.mjs`. It runs as a continuous loop and manages the full round lifecycle.

### Architecture

The supervisor is organized into distinct functional modules executed each tick:

| Module | Responsibility |
|---|---|
| **boot** | Reads on-chain config (commit/reveal window sizes) and chain state at the start of each tick |
| **audit** | Scans the on-chain `RoundRegistry` for all active rounds and their current states |
| **scheduler** | Determines the next round to create based on the NIST pulse pipeline; calls `create_round_auto` |
| **ORACLE-GAP** | Advances `latest_finalized_pulse_index` if the pipeline is blocked by empty or skipped rounds |
| **pulses** | Fetches NIST Beacon Chain 2 and publishes `set_pulse_signed` for rounds that are ready |
| **maintenance/finalize** | Calls `finalize_round` for rounds that have passed their reveal deadline and have a pulse |
| **settlement** | Calls `settle_round_tokens` for finalized rounds with tickets |
| **maintenance/sweep** | Calls `sweep_unclaimed` for rounds past the claim grace period |
| **cleanup/close** | Calls `close_round` for swept rounds to recover rent |

### Tick cycle

Each tick takes approximately 10–15 seconds and covers all modules in sequence. State read at boot is shared across modules within the same tick. This means the supervisor effectively targets a ~6 rounds-per-minute throughput ceiling at peak scheduling.

### Scheduler logic

The scheduler picks the next `pulseIndexTarget` from the pool of unregistered pulse indices. A round will be skipped (not created) if:

- The target pulse is already registered in the pipeline
- The current NIST betting window for that pulse is below the minimum required duration
- The target would be beyond the `MAX_FUTURE_PULSE_WINDOW` (protects against creating rounds too far ahead of the current chain state)

!!! note "Round creation and slots"
    Round commit and reveal deadlines are derived from the **current chain slot** at creation time, not from the current wall-clock time. NIST pulses arrive approximately every 60 seconds but slot timing may drift. The scheduler uses the current slot as the reference point when computing window offsets.

---

## The ORACLE-GAP mechanism

`syncLatestPulse` is an admin-gated instruction that advances the on-chain `latest_finalized_pulse_index` (LFP). The supervisor uses it when it detects the LFP has fallen behind the earliest pending round's pulse target.

### When it triggers

```
current LFP < (earliest active round's pulseIndexTarget - 1)
```

### What it does

1. Reads all active rounds from the pipeline
2. Computes the minimum LFP needed to allow the earliest blocked round to become eligible for pulse publication
3. Calls `syncLatestPulse(target)` with that minimum value

### Constraints

- The program enforces `SyncPulseWouldDecrease`: the LFP can only advance, never retreat
- Each `syncLatestPulse` call is an on-chain transaction, fully auditable
- The sequential constraint on `set_pulse_signed` (`NonSequentialPulse`) limits how many rounds a misaligned LFP can affect

### Trust implication

The ORACLE-GAP mechanism is a **liveness tool with an admin trust dependency**. It resolves deadlocks that arise when empty rounds consume pulse index slots. However, because the LFP is app-level state and is advanced by the operator rather than by independent on-chain consensus, this remains a centralized operation bounded by on-chain constraints.

See [Oracle Trust Model](oracle_trust_model.md) for the full trust characterization.

---

## User-driven cleanup (ticket rent)

Automation manages **round creation, pulse posting, finalize/settle, and sweeps**. Ticket rent recovery is intentionally **user-driven**:

- `close_ticket` is signed by the ticket owner and returns the ticket PDA's lamports to the user.
- Sweeps do **not** close user tickets.

This design reduces centralized maintenance and keeps user cleanup permissioned to the owner.

!!! note "Grace windows"
    The canonical sweep eligibility is enforced by the program using `claim_grace_slots` from on-chain `Config`.
    The supervisor may use a shorter local precheck before attempting sweeps, but early attempts will be rejected on-chain.

---

## Empty round handling

Rounds created without any ticket commits are detected by the supervisor during the pulse module. For rounds with zero tickets:

- The pulse step is skipped (no `set_pulse_signed` sent)
- The sweep step runs immediately after the reveal deadline passes
- The close step reclaims rent after sweep

This reduces unnecessary RPC calls and keeps the pipeline clean without modifying the on-chain program.
