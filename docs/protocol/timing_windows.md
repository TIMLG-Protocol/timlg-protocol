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
| `commit_deadline_slot` | u64 | Commit window boundary (see phase gating below) |
| `reveal_deadline_slot` | u64 | Reveal window boundary (inclusive in MVP) |
| `claim_grace_slots` | u64 | Grace period after reveal deadline before sweep is allowed |

---

## Phase gating (what can happen when)

<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Slot / state condition</th>
      <th>Allowed actions (high-level)</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Commit</strong></td>
      <td><code>slot &lt;= commit_deadline_slot</code> and <code>pulse_set == false</code></td>
      <td>Commit tickets (<code>commit_ticket</code>)</td>
      <td>
        In the MVP, commits are accepted up to and including <code>commit_deadline_slot</code>,
        but are rejected once <code>pulse_set</code> becomes true.
      </td>
    </tr>
    <tr>
      <td><strong>Pulse publication</strong></td>
      <td><code>slot &gt;= commit_deadline_slot</code> and <code>pulse_set == false</code></td>
      <td>Oracle may publish pulse (<code>set_pulse_signed</code>)</td>
      <td>
        This creates an effective handoff: oracle can post from the boundary onward, while commits stop once pulse is set.
      </td>
    </tr>
    <tr>
      <td><strong>Reveal</strong></td>
      <td><code>pulse_set == true</code> and <code>slot &lt;= reveal_deadline_slot</code></td>
      <td>Reveal tickets (<code>reveal_ticket</code>)</td>
      <td>Reveals are only meaningful once a pulse exists.</td>
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
      <td>Burns losers and routes NO-REVEAL to SPL treasury. Winners become claimable.</td>
    </tr>
    <tr>
      <td><strong>Claim</strong></td>
      <td>after token settlement and <code>swept == false</code></td>
      <td>Users claim rewards (<code>claim_reward</code>)</td>
      <td>Claim pays refund + mints reward. Claims are blocked once swept.</td>
    </tr>
    <tr>
      <td><strong>Sweep (SOL-only)</strong></td>
      <td><code>slot &gt; reveal_deadline_slot + claim_grace_slots</code> and round finalized</td>
      <td>Sweep native SOL leftovers (<code>sweep_unclaimed</code>)</td>
      <td>
        MVP sweep transfers lamports from a system vault to SOL treasury and marks the round swept (closing claims).
      </td>
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
- the pulse bytes (64 bytes)
- an oracle signature proving which pulse was chosen

!!! warning "Anti-leakage requirement"
    The commit window must close before participants can reliably know the targeted pulse.

---

## Edge cases and rules of thumb

### 1) Boundary overlap at `commit_deadline_slot`
In the MVP, commits allow `slot <= commit_deadline_slot`, while pulse publication allows `slot >= commit_deadline_slot`.

The on-chain safety invariant is:
- **commits are rejected once `pulse_set == true`**

Operationally, the oracle should post at/after the boundary as soon as appropriate.

### 2) Late commits / late reveals
- If `pulse_set == true`, commits are rejected even if the slot is still within the boundary.
- If a reveal lands after `reveal_deadline_slot`, it is rejected (ticket becomes NO-REVEAL).

### 3) Slot-time vs wall-clock time
Slots are the only timing source the program can rely on. User-facing tooling may display approximate wall-clock times,
but correctness must be enforced using slots.

---

## Recommended parameter sizing (public guidance)

For devnet/localnet demos:

- Choose commit/reveal windows with enough slots to absorb normal network variance.
- Prefer conservative spacing: commit closes well before the targeted pulse can be known.
- Keep `claim_grace_slots` long enough for users in different time zones.

The exact numbers are deployment- and network-dependent, so the docs avoid hardcoding constants.
