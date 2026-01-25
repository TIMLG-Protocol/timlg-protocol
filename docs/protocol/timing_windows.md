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
| `commit_open_slot` | u64 | Slot when the commit window opens |
| `commit_deadline_slot` | u64 | Last slot where commits are accepted |
| `reveal_deadline_slot` | u64 | Last slot where reveals are accepted |
| `claim_grace_slots` | u64 | Grace period after reveal deadline before sweep closes claims |

Notes:

- **Slots** are the source of truth for enforcement. Wall-clock displays are approximate.
- `target_pulse_index` is informational until the oracle posts the pulse; the on-chain checks rely on `pulse_set` and slot gating.
- `claim_grace_slots` is configured at the protocol level (in `Config`) and applied by the operator.

---

## Phase gating (what can happen when)

<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Gate condition</th>
      <th>Allowed actions</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Commit</strong></td>
      <td><code>slot &lt;= commit_deadline_slot</code> and <code>pulse_set == false</code></td>
      <td>Create tickets (<code>commit_ticket</code>, batches)</td>
      <td>
        Commit stops at <code>commit_deadline_slot</code>. The pulse must not be set during commit.
      </td>
    </tr>
    <tr>
      <td><strong>Pulse posting</strong></td>
      <td><code>slot &gt;= commit_deadline_slot</code> and <code>pulse_set == false</code></td>
      <td>Oracle posts pulse (<code>set_pulse_signed</code>)</td>
      <td>
        The pulse must be posted after commits close. This overlap is intentional: the oracle can post from the boundary onward, while commits stop once the pulse is set.
      </td>
    </tr>
    <tr>
      <td><strong>Reveal</strong></td>
      <td><code>pulse_set == true</code> and <code>slot &lt;= reveal_deadline_slot</code></td>
      <td>Reveal tickets (<code>reveal_ticket</code>)</td>
      <td>Reveals are only valid once a pulse exists.</td>
    </tr>
    <tr>
      <td><strong>Finalize</strong></td>
      <td><code>slot &gt; reveal_deadline_slot</code> and <code>pulse_set == true</code></td>
      <td>Finalize round (<code>finalize_round</code>)</td>
      <td>Locks the round for settlement.</td>
    </tr>
    <tr>
      <td><strong>Token settlement</strong></td>
      <td><code>slot &gt; reveal_deadline_slot</code> and round finalized</td>
      <td>Settle (<code>settle_round_tokens</code>) → enable claims</td>
      <td>Burns losers and burns NO-REVEAL stake. Winners become claimable.</td>
    </tr>
    <tr>
      <td><strong>Claim</strong></td>
      <td>after token settlement and <code>swept == false</code></td>
      <td>Users claim rewards (<code>claim_reward</code>)</td>
      <td>Claim refunds stake + mints reward. Claims are blocked once swept.</td>
    </tr>
    <tr>
      <td><strong>Sweep (SOL + SPL)</strong></td>
      <td><code>slot &gt; reveal_deadline_slot + claim_grace_slots</code> and round finalized</td>
      <td>Sweep SOL and tokens (<code>sweep_unclaimed</code>)</td>
      <td>
        MVP sweep transfers lamports to the SOL treasury and remaining tokens to the SPL treasury, then marks the round swept (closing claims).
      </td>
    </tr>
  </tbody>
</table>

---

## The target pulse and “knowability”

The protocol assumes a public randomness source that is:

- **Unpredictable** before it is published (e.g., NIST beacon pulses)
- **Publicly verifiable** after publication

The “Hawking Wall” principle is enforced by:

- requiring commits to happen before the pulse is posted (`pulse_set == false`)
- only allowing reveals after the pulse exists (`pulse_set == true`)
- binding each ticket to a bit index derived from ticket inputs (so users can’t choose the bit after seeing the pulse)

---

## Edge cases and rules of thumb

### 1) Pulse arrives early or late (relative to expectations)

The oracle may be delayed or the network may vary. The protocol remains safe as long as:

- the oracle does not post the pulse while commits are still allowed
- users cannot reveal before the pulse is posted

### 2) Users commit at the boundary slot

The boundary is defined in slots. If a commit lands at exactly `commit_deadline_slot`, it is still within the window.

- If a reveal lands after `reveal_deadline_slot`, it is rejected (the ticket becomes NO-REVEAL).

### 3) Slot-time vs wall-clock time

Slots are the only timing source the program can rely on. User-facing tooling may display approximate wall-clock times,
but correctness must be enforced using slots.

---

## Deployment phases: Devnet vs Mainnet

- **Devnet**: Used for end-to-end testing and UI/UX validation. Operator automation may be more permissive.
- **Mainnet**: Requires hardened oracle operations, rate limiting, and stricter monitoring.

---

## Gasless UX: the relayer role (TBD)

The protocol supports “gasless” variants where:

- users sign messages (ed25519) instead of transactions
- a relayer pays fees and submits the on-chain transaction

Current status:

- **Gasless commit**: Implemented via `commit_batch_signed`.
- **Gasless reveal**: Implemented via `reveal_batch_signed`.
- **State**: Operational details (spam prevention, per-user quotas) are still to be defined.
- **Goal**: Users should only need the stake token to participate.

---

## Recommended parameter sizing (public guidance)

For devnet/localnet demos:

- Choose commit/reveal windows with enough slots to absorb normal network variance.
- Prefer conservative spacing: commit closes well before the targeted pulse can be knowable.
- Keep `claim_grace_slots` long enough for users in different time zones.

Exact numbers are deployment- and network-dependent, so the docs avoid hardcoding constants.
