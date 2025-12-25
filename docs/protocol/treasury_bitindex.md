# Treasury & BitIndex

TIMLG uses treasury accounts to receive:

- **SOL sweeps** (unclaimed SOL after the grace period)
- **Token penalties** for no-reveal tickets (SPL transfers)

Public documentation intentionally avoids privileged operational details.

---

## Treasury flows (MVP)

### Treasury (SOL)

- Each round has a system-owned SOL vault.
- After the grace period, the vault can be swept into a treasury SOL account.
- Sweeping is gated and idempotent (`swept` flag).

### Treasury (SPL token)

- Each round has a token vault funded for payouts.
- During token settlement:
  - no-reveal allocations are transferred to the treasury token account.

---

## BitIndex (canonical)

BitIndex is how each ticket selects a single bit from the 512-bit pulse.

### Derivation

`bit_index = H(round_id, user, nonce) mod 512`

Where `H` is the canonical hash described in **Log Format**.

### Why BitIndex exists

- It avoids everyone reading the same bit.
- It makes the user’s “target bit” unpredictable before commit.
- It keeps verification deterministic and cheap on-chain.

---

## Operational notes (intentionally high-level)

- Treasury authority and upgrade authority must be managed with best practices:
  multisig, separation of duties, and secure key custody.
- Public docs should never include signer locations, runbooks, or endpoint details.
