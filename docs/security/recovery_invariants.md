# Recovery and Safety Invariants

| Document Control | Value |
|---|---|
| **Scope** | Core assertions maintaining state integrity during protocol recovery |
| **Audience** | Protocol engineers, auditors, formal verification designers |

The TIMLG protocol implements aggressive safeguards and an automated supervisor to handle desynchronization, oracle faults, and operational hiccups. To ensure these automated interventions cannot be abused, the system enforces strict recovery and safety invariants.

## Core Operational Invariants

### I-01 Pulse Ordering Monotonicity
A newly registered target pulse index must always be strictly greater than the previously finalized pulse index. The system cannot go backward or repeat finalized targets.

### I-02 No Swallowing of Committed Rounds
A recovery anchor or gap-handling operation must target `minCommitted - 1`. Normal operational rounds that have accepted user commitments must never be truncated, skipped, or overwritten by a recovery cycle.

### I-03 Sweep Only After Grace Conditions
Unclaimed funds can only be swept from the reward pool to the protocol treasury after the strict `claim_grace_slots` duration has elapsed since settlement. Operational scripts or operators cannot override or bypass this on-chain rule.

### I-04 Close Only After Sweep Eligibility
A round account can only be permanently closed (and its rent reclaimed) if it has either been fully processed through the standard lifecycle (Claim/Burn) followed by a Sweep, or if it explicitly entered a zero-ticket Orphan state.

### I-05 Expected Retries Are Benign (Idempotency)
Re-submissions of `SetPulse` or settlement transactions do not corrupt state. Duplicate active interventions yield benign runtime failures (such as `PulseAlreadySet`), and the protocol processes them idempotently without creating duplicate payouts or disrupting the state machine.

### I-06 Privileged Actions Must Be Externally Attributable
Every privileged action (such as an anchor installation or a configuration update) permanently mutates observable on-chain program state variables (e.g., `latestFinalizedPulseIndex`, or Config values) and emits transaction logs. Silent canonical pulse replacements are cryptographically impossible without leaving on-chain state evidence.
