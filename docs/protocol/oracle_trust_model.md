# Oracle Trust Model

| Document Control | Value |
|---|---|
| **Document ID** | TP-SAFE-003 |
| **Status** | Approved for Devnet MVP — revised March 2026 |
| **Purpose** | State the trust assumptions for pulse publication clearly and without ambiguity |

The protocol depends on an external pulse source and an authorized signer that proves the pulse submitted on-chain is the pulse the protocol intended to accept. This document is deliberately conservative about what the on-chain verification actually proves.

---

## 1. Current model

| Aspect | Current MVP rule |
|---|---|
| **Acceptance model** | One configured oracle public key is accepted by `set_pulse_signed` |
| **Signature scheme** | Ed25519 verification instruction must be present and must match the expected message |
| **Authority to change oracle key** | Admin-controlled configuration path |
| **Source referenced by deployment** | Public randomness pulse sourced from NIST Randomness Beacon Chain 2 |
| **LFP advancement** | `syncLatestPulse(n)` advances the `latest_finalized_pulse_index` — admin-gated, monotonically increasing only |

---

## 2. What "ed25519 verification" proves — and what it does not

This distinction matters for any honest security characterization of the protocol.

| What it **does** prove | What it **does not** prove |
|---|---|
| The configured oracle public key signed these exact bytes | That those bytes are the real NIST Beacon value for the stated pulse index |
| The signed message fields (programId, roundId, pulseIndexTarget, pulseBytes) match the expected round context | How the operator fetched the pulse or whether the oracle key is independently audited |
| The oracle key has not been rotated without an on-chain admin transaction | Whether the oracle private key is under independent custody |
| The pulse was applied to only one round (once-per-round enforcement) | Organizational controls around the signer |

In short: **ed25519 on-chain verification proves oracle authorization, not pulse authenticity**. The chain between NIST bytes and what gets published is currently an operator trust assumption, not a cryptographic proof anchored on-chain.

---

## 3. User trust assumptions

| Assumption | Meaning |
|---|---|
| **Source integrity** | The operator correctly fetches NIST Beacon Chain 2 pulses without substitution |
| **Signer custody** | The oracle private key is not compromised or used dishonestly |
| **Availability** | The pulse is posted in time for a valid reveal window |
| **Configuration correctness** | The stored oracle pubkey is the one the deployment intends to trust |
| **syncLatestPulse honesty** | The `latest_finalized_pulse_index` is advanced correctly, not misused to reposition the pulse assignment window |

---

## 4. What the protocol enforces on-chain

| Enforced on-chain | Not enforced on-chain |
|---|---|
| Signature matches the configured oracle pubkey | How the off-chain operator fetched the external pulse |
| Signed message fields match expected round context | Internal operator infrastructure topology |
| Pulse is only set once per round | Organizational controls around the signer |
| `syncLatestPulse` can only advance LFP, never decrease it (`SyncPulseWouldDecrease` error) | The rate or frequency of LFP advancement |
| Pulse must be sequential: target == LFP + 1 at publication time (`NonSequentialPulse` error) | Whether skipped indices correspond to real NIST pulses |
| Hardcaps on fee, stake, and window parameters (enforced in constants) | Admin behavior within those caps |

---

## 5. The ORACLE-GAP mechanism and its trust implications

The `syncLatestPulse` instruction is the primary liveness mechanism. The supervisor uses it in an "ORACLE-GAP" pattern when it detects that the on-chain LFP has fallen behind the pipeline of pending rounds.

**What it does operationally:**
- Advances `latest_finalized_pulse_index` to the minimum value needed to unblock the round with the lowest pending target
- Is bounded: can only advance, never retreat

**Why it exists:**
- The on-chain program has no access to the NIST Beacon directly
- The LFP must be advanced by the operator before a matching pulse can be published for any round
- Without it, the pipeline stalls permanently if empty rounds consume pulse indices

**Trust implication:**
- The current causal anchor (`latest_finalized_pulse_index`) is not purely derived from sequential pulse publications. It is partly derived from administrative `syncLatestPulse` calls.
- This means the system is **trust-minimized**, not trustless. The operator controls the LFP window, which determines which rounds become eligible for pulse publication.

**What protects against abuse:**
- `SyncPulseWouldDecrease`: the LFP cannot be walked back to reposition past targets
- The advancement is always visible on-chain and auditable
- The sequential constraint on `set_pulse_signed` limits manipulation of individual pulse-to-round assignment

---

## 6. Precise characterization of current trust level

> **The protocol is trust-minimized, not trustless.**

| Property | Current state |
|---|---|
| On-chain settlement logic | Deterministic and rule-enforced |
| Outcome given a pulse | Trustless — deterministic given the bytes |
| Pulse authenticity | Trust-minimized — requires trusting the operator/oracle |
| LFP advancement | Trust-minimized — admin-controlled but monotonically constrained |
| Escrow safety | Strong — PDA-controlled, admin cannot extract directly |
| Fee and parameter caps | Trustless — hardcoded maximums enforced by the program |

---

## 7. Future hardening

| Planned area | Rationale |
|---|---|
| Oracle set / threshold acceptance (M-of-N) | Reduce single-signer dependency; `OracleSet` model already present in program state |
| Better public verification tooling | Make third-party checking of oracle behaviour easier |
| zkTLS or similar proof layer | Prove on-chain that published bytes match NIST Beacon without trusting the oracle key |
| Stronger authority separation | Reduce key concentration for oracle and admin paths |
| Deterministic pulse scheduling | Derive round targets algorithmically from LFP to reduce operator scheduling discretion |
