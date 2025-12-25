# Settlement Rules (Spec)

This page specifies how outcomes are determined and how funds/tokens move **conceptually**.
It matches the MVP on-chain behavior at a high level.

## Outcome determination

Given:

- a ticket with `(round_id, user, nonce, commitment)`
- a pulse `pulse[64]`
- the derived `bit_index ∈ [0..511]`

A reveal provides `(guess ∈ {0,1}, salt[32])` and is valid if:

1. `commit_hash(round_id, user, nonce, guess, salt) == commitment`
2. `derived_bit_index(round_id, user, nonce) == ticket.bit_index`
3. `pulse is set` for the round
4. reveal happens within the reveal window

Then:

- `pulse_bit = get_pulse_bit(pulse, bit_index)`
- `win = (pulse_bit == guess)`

---

## Settlement phases (MVP implementation)

TIMLG separates settlement into **two layers**:

1. **Truth settlement** (deterministic):
   - establish `win/lose` per ticket from the pulse bit.

2. **Economic settlement** (MVP):
   - applies rules for rewards and penalties using SOL vaults and a round token vault.

### Phase 0 — Commit stake

On commit:

- a ticket is created
- the user pays a stake into the round’s SOL vault (system-owned PDA)

### Phase 1 — Finalization gate

A round becomes finalizable only if:

- pulse is set, and
- reveal window has ended

### Phase 2 — Token settlement gate (required before claim)

An admin/governance action runs token settlement once the round is finalized.
This step prepares the token vault for claims and applies penalties.

**Conceptual rules in MVP:**

- **Losers**: their per-ticket allocation is **burned** from the round token vault.
- **No-reveal**: their per-ticket allocation is transferred to the **treasury token account**.
- A round is marked `token_settled = true` once complete.

### Phase 3 — Claiming (winners only)

A user can claim only if:

- round is `token_settled`
- ticket was revealed
- ticket is a winner
- claim is before a sweep occurs

When claiming (MVP):

- transfers `stake_amount` tokens from the round token vault to the user
- mints an additional `stake_amount` tokens as the reward (see Tokenomics)

### Phase 4 — Sweeping unclaimed SOL

After a configurable grace period, any remaining SOL in the round vault can be swept to a treasury SOL account.

---

## Safety properties

- **No early claim**: winners cannot claim before `token_settled`.
- **No claim after sweep**: sweep permanently closes the claim window.
- **Idempotent settlement**: penalty application uses per-ticket guards to prevent double settlement.
