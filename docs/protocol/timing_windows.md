# Timing Windows

TIMLG rounds are **slot-bounded**: each phase is gated by Solana slot numbers recorded on-chain.

The timing model is designed to enforce the “Hawking Wall” principle: commitments must be made **before** the target
randomness pulse is knowable.

---

## Round parameters (MVP)

A round is created with parameters that define its timing and target:

| Parameter | Type | Meaning |
|---|---:|---|
| `target_pulse_index` | u64 | Which public randomness pulse is targeted (e.g., NIST index) |
| `commit_deadline_slot` | u64 | End of the commit window (exclusive boundary) |
| `reveal_deadline_slot` | u64 | End of the reveal window (exclusive boundary) |
| `claim_grace_slots` | u64 | Grace period after settlement before sweep is allowed |

**Exclusive boundary** means: an instruction is valid only if `current_slot < deadline_slot`.

!!! note
    The exact boundaries are implementation-defined, but the docs assume the conservative interpretation:
    *deadline slots are the first slot that is no longer allowed*.

---

## Phase gating (what can happen when)

<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Slot condition</th>
      <th>Allowed actions (high-level)</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Round open</strong></td>
      <td><code>slot &lt; commit_deadline_slot</code></td>
      <td>Commit tickets (<code>commit_ticket</code>)</td>
      <td>No pulse is accepted yet.</td>
    </tr>
    <tr>
      <td><strong>Commit closed</strong></td>
      <td><code>slot ≥ commit_deadline_slot</code></td>
      <td>Oracle may publish pulse (<code>set_pulse_signed</code>)</td>
      <td>Commits are rejected past this boundary.</td>
    </tr>
    <tr>
      <td><strong>Reveal window</strong></td>
      <td><code>pulse is set</code> and <code>slot &lt; reveal_deadline_slot</code></td>
      <td>Reveal tickets (<code>reveal_ticket</code>)</td>
      <td>Reveals are only meaningful once a pulse exists.</td>
    </tr>
    <tr>
      <td><strong>Finalize</strong></td>
      <td><code>slot ≥ reveal_deadline_slot</code></td>
      <td>Finalize round (<code>finalize_round</code>)</td>
      <td>Locks the round for settlement.</td>
    </tr>
    <tr>
      <td><strong>Settlement</strong></td>
      <td>after finalize</td>
      <td>Settle (<code>settle_round_tokens</code>) → enable claims</td>
      <td>Accounting is computed deterministically.</td>
    </tr>
    <tr>
      <td><strong>Claim</strong></td>
      <td>after settlement</td>
      <td>Users claim rewards (<code>claim_reward</code>)</td>
      <td>Claims are gated by token/vault rules.</td>
    </tr>
    <tr>
      <td><strong>Sweep</strong></td>
      <td><code>slot ≥ settlement_slot + claim_grace_slots</code></td>
      <td>Sweep leftovers (<code>sweep_unclaimed</code>)</td>
      <td>Moves unclaimed funds to the treasury policy path.</td>
    </tr>
  </tbody>
</table>

---

## The target pulse and “knowability”

The protocol assumes the pulse is derived from a **public randomness source** that is:

- publicly observable,
- time-indexed,
- and not controllable by participants.

The MVP is designed around sources like the **NIST Randomness Beacon**, but the on-chain program only needs:

- a pulse index (`target_pulse_index`)
- the pulse bytes (or hash)
- an oracle signature proving which pulse was chosen

!!! warning "Anti-leakage requirement"
    The commit window must close before participants can reliably know the targeted pulse.

---

## Edge cases and rules of thumb

### 1) Late commits / late reveals
- If a commit lands at or after `commit_deadline_slot`, it must be rejected.
- If a reveal lands at or after `reveal_deadline_slot`, it must be rejected (ticket becomes NO-REVEAL).

### 2) Pulse arrives “late”
If the oracle does not publish the pulse in time, the round cannot settle. Operationally this is handled off-chain (retry,
alternate oracle paths), but the public invariant is simple:

- settlement only happens after a valid pulse is set

### 3) Slot-time vs wall-clock time
Slots are the only timing source the program can rely on. User-facing tooling may display approximate wall-clock times,
but correctness must be enforced using slots.

---

## Recommended parameter sizing (public guidance)

For devnet/localnet demos:

- Choose commit/reveal windows with enough slots to absorb normal network variance.
- Prefer conservative spacing: **commit closes** well before the targeted pulse can be known.
- Keep `claim_grace_slots` long enough for users in different time zones.

The exact numbers are deployment- and network-dependent, so the docs avoid hardcoding constants.
