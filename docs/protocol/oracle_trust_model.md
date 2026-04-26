# Oracle Trust Model

| Document Control | Value |
|---|---|
| **Document ID** | TP-SAFE-003 |
| **Status** | Approved for Devnet MVP — revised April 2026 |
| **Purpose** | State the trust assumptions for pulse publication clearly and without ambiguity |

The protocol depends on an external pulse source (NIST Beacon Chain 2) and an authorized oracle set
that proves on-chain that the pulse submitted on-chain matches the pulse the protocol intended to
accept. This document is deliberately conservative about what the on-chain verification actually proves.

---

## 1. Current model

| Aspect | Current MVP rule |
|---|---|
| **Acceptance model** | M-of-N quorum: `set_pulse_quorum` requires Ed25519 signatures from at least `OracleSet.threshold` distinct oracles in the allowlist |
| **Signature scheme** | Ed25519, verified by Solana's native ed25519 verify program; one ed25519 instruction per signer in the same transaction |
| **NIST chaining** | The `Config` PDA stores `last_output_value` (the NIST `outputValue` of the previously accepted pulse) and `last_precommitment_value`. Each new pulse is checked against the chain |
| **Anchor / bootstrap** | The first pulse is accepted without chain (`has_nist_anchor = false`). Once anchored, every subsequent pulse must satisfy the chain |
| **Authority to change oracle set** | Admin via `add_oracle`, `remove_oracle`, `set_oracle_threshold` |
| **Single-signer fallback** | `set_pulse_signed` exists but is **disabled for betting rounds** (`LegacyModeDisabled`); kept for development paths |
| **Source referenced by deployment** | NIST Randomness Beacon Chain 2 |

---

## 2. What "ed25519 + NIST chain verification" proves — and what it does not

This distinction matters for any honest security characterization of the protocol.

| What it **does** prove | What it **does not** prove |
|---|---|
| At least `threshold` distinct allowlisted oracles signed the exact canonical message bytes | That the bytes are the real NIST Beacon value (no zk-attestation of NIST itself yet) |
| The signed message fields (programId, roundId, pulseIndexTarget, pulseBytes) match round context | How each oracle fetched the pulse or whether their key custody is independently audited |
| The new pulse's `previous_output_value` equals the previously accepted `last_output_value` | That every oracle is operationally independent — collusion within the threshold is not detectable on-chain |
| `SHA-512(output_value)` matches the prior `last_precommitment_value` (NIST precommit chain) | The off-chain organisational separation between operators of different oracle keys |
| The pulse was applied to only one round (one-shot per round) | |

In short: **ed25519 quorum + NIST chaining proves operator authorization plus integrity of the pulse
sequence under threshold trust assumptions, not unconditional NIST authenticity.** The chain between
real NIST bytes and what gets published is reduced — but not eliminated — by requiring a quorum of
independent operators.

---

## 3. User trust assumptions

| Assumption | Meaning |
|---|---|
| **Source integrity (collective)** | At least `threshold` of the allowlisted oracles correctly fetch NIST Beacon Chain 2 without substitution |
| **Signer custody (per oracle)** | Each oracle private key is not compromised |
| **Anti-collusion** | Fewer than `threshold` of the allowlisted oracles collude |
| **Availability** | At least `threshold` oracles publish their attestations in time |
| **Configuration correctness** | The stored `OracleSet.oracles` list and `threshold` are what the deployment intends |

---

## 4. What the protocol enforces on-chain

| Enforced on-chain | Not enforced on-chain |
|---|---|
| Each signature in `set_pulse_quorum` is verified by Solana's native ed25519 verify program | How any individual oracle fetched the external pulse |
| Every signer must be a distinct member of `OracleSet` and signatures must be sorted (`InvalidQuorumSignatureOrdering`) | Internal operator infrastructure topology |
| Pulse acceptance is one-shot per round (`PulseAlreadySet`) | Operational signing pipelines (kept private) |
| `set_pulse_quorum` enforces `previous_output_value == config.last_output_value` once anchored (`NistChainBroken`) | Whether the source NIST values are the real beacon values (no on-chain proof of NIST itself) |
| `SHA-512(output_value)` must match `config.last_precommitment_value` (`NistPrecommitmentBroken`) | |
| `pulse_index_target` must equal the round's stored target (`PulseIndexMismatch`) | |
| `latest_finalized_pulse_index` (LFP) advances monotonically; non-sequential pulses are rejected (`NonSequentialPulse`) | The rate at which the OracleSet publishes |
| Hardcaps on stake, fee, and window parameters (constants) | Admin behavior within those caps |

---

## 5. Recovery mode (replaces the legacy `syncLatestPulse` mechanism)

The old `syncLatestPulse` ORACLE-GAP mechanism has been **removed** and replaced by a proof-gated
recovery flow that is itself permissionless and quorum-based.

### Entry — `enter_recovery_mode`

Recovery is only entered when **both** are true:

1. `recovery_target > LFP + 1` (a real gap exists), and
2. A `Round` account already exists in `Announced` state with `pulse_index_target == recovery_target`
   (concrete proof that the gap is blocking real pending work).

Either condition failing returns `RecoveryProofInvalid` or `NoSequenceGap`.

### Repair — `install_nist_anchor_quorum`

Inside recovery mode, the OracleSet can install a new NIST anchor by quorum:

- `payload` carries `pulse_index`, `output_value`, and `precommitment_value`
- M-of-N anchor signatures must be verified
- Outside recovery mode, `pulse_index` must equal `LFP + 1` (`PulseIndexNotNext`); inside recovery
  mode, multi-pulse jumps are allowed but only up to `recovery_target`
- The anchor advances LFP and refreshes `last_output_value` / `last_precommitment_value`

### Exit — `exit_recovery_mode`

- Permissionless once `LFP >= recovery_target` **or** `RECOVERY_EXIT_TIMEOUT_SLOTS` have elapsed
  since `recovery_entered_at`
- Otherwise admin-only

This design replaces the old admin-controlled `syncLatestPulse`: every recovery action is now visible
on-chain, requires real pending work as proof, and either runs through quorum or times out.

---

## 6. Precise characterization of current trust level

> **The protocol is trust-minimized and approaching trust-distributed.**

| Property | Current state |
|---|---|
| On-chain settlement logic | Deterministic and rule-enforced |
| Outcome given a pulse | Trustless — deterministic given the bytes |
| Pulse authenticity | Threshold-trusted: requires collusion of `threshold` allowlisted oracles plus a NIST chain break to corrupt |
| Pulse sequencing | Rule-enforced: monotonic LFP, NIST chain check, one-shot per round |
| LFP advancement | Quorum-gated within recovery; sequential under normal flow |
| Recovery entry | Proof-gated (real pending round + real gap) |
| Recovery exit | Permissionless after target reached or timeout |
| Escrow safety | Strong — PDA-controlled, admin cannot extract round vault funds directly |
| Fee and parameter caps | Trustless — hardcoded maximums in `constants.rs` |

---

## 7. Future hardening

| Planned area | Rationale |
|---|---|
| Larger / external oracle set | More independent operators, lower collusion risk |
| zkTLS or equivalent NIST-binding proof | Prove on-chain that published bytes match NIST Beacon directly, removing the residual operator trust |
| Stronger authority separation | Reduce key concentration for admin / oracle / treasury / upgrade authorities |
| DAO-governed `OracleSet` updates | Replace admin-driven add/remove with on-chain governance |
