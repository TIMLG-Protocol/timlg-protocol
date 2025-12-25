# Log Format

This page defines **publicly shareable, reproducible** data fields for TIMLG rounds and tickets.

The goal is that independent indexers can reconstruct the experiment history from on-chain transactions **without**
needing any privileged operational context (keys, internal endpoints, signer infrastructure).

!!! warning "Security principle"
    Public documentation must never include private keys, signer infrastructure, or any detail that enables unauthorized
    signing, authority changes, or fund movement.

---

## Terminology

- **Round**: a slot-bounded unit targeting a future public randomness pulse (e.g., NIST Randomness Beacon).
- **Ticket**: a single participation in a round; it escrows **exactly 1 token** and settles deterministically.
- **Pulse**: a 512-bit value published by the oracle and verified on-chain (Ed25519).

---

## Canonical objects

### 1) Round header (on-chain state)

A round is identified by its on-chain address (PDA). The round state includes (at minimum):

| Field | Type | Meaning |
|---|---:|---|
| `round` | Pubkey | Round account address (canonical ID) |
| `target_pulse_index` | u64 | Which public pulse is targeted (index in the source) |
| `commit_deadline_slot` | u64 | Commits must land before this slot boundary |
| `reveal_deadline_slot` | u64 | Reveals must land before this slot boundary |
| `pulse_hash` | [32]byte | Hash of the 512-bit pulse once finalized (or empty pre-finalization) |
| `status` | enum | Lifecycle state (Open → Finalized → Settled, etc.) |

> Notes:
> - The program may store additional fields (vault addresses, authority pubkeys, counters).
> - Indexers should treat on-chain state as the source of truth.

---

### 2) Ticket record (indexable from transactions)

Tickets are created and updated by instructions like `commit_ticket` and `reveal_ticket`.

A ticket is uniquely identified by `(round, participant, ticket_index)` depending on implementation.
For indexing purposes, the minimal record is:

| Field | Type | Meaning |
|---|---:|---|
| `round` | Pubkey | Round ID |
| `participant` | Pubkey | Wallet that committed (or authorized the commit) |
| `commitment` | [32]byte | Commitment digest submitted in the commit step |
| `stake_amount` | u64 | Fixed stake (MVP: exactly **1 token**) |
| `commit_slot` | u64 | Slot where commit landed |
| `reveal_slot` | u64? | Slot where reveal landed (if any) |
| `outcome` | enum? | WIN / LOSE / NO-REVEAL (available after settlement) |

---

## Commitment digest

TIMLG uses a standard **commit–reveal** scheme:

- **Commit**: submit a commitment digest during the commit window.
- **Reveal**: later submit `(guess, salt)` so the program can recompute the digest and verify you committed earlier.

### Canonical commitment message (MVP-friendly)

To avoid ambiguity, the commitment must be computed over a **domain-separated** message that includes the round ID.

A safe, implementation-agnostic definition is:

- `commitment = SHA256( "TIMLG:v1" || round_pubkey || participant_pubkey || guess || salt )`

Where:

- `"TIMLG:v1"` is an ASCII prefix (domain separator)
- `round_pubkey` and `participant_pubkey` are 32-byte raw pubkey bytes
- `guess` is encoded deterministically (see below)
- `salt` is 32 bytes of entropy (random)

!!! note "Why include round + participant?"
    This prevents reusing the same reveal across different rounds or different participants (replay/cut-and-paste).

### Guess encoding

The whitepaper framing is “predict future bits”. For the MVP, the canonical guess is:

- `guess_bit ∈ {0,1}` encoded as a single byte `0x00` or `0x01`

If later versions support multi-bit guesses, the encoding must be explicitly versioned (e.g., `TIMLG:v2`).

---

## Pulse message (oracle-signed)

The oracle publishes a 512-bit pulse (64 bytes) via `set_pulse_signed`.

Indexers should treat the on-chain Ed25519 verification as the canonical validity check. Public documentation should only
state the **message envelope**, not operational key management.

### Canonical pulse attestation (public envelope)

A recommended message envelope for signing is:

- `msg = SHA256( "TIMLG:PULSE:v1" || round_pubkey || target_pulse_index || pulse_64_bytes )`

The on-chain instruction verifies:

- Ed25519 signature over `msg`
- signer pubkey equals the configured oracle pubkey (governance-controlled)

---

## Indexer-friendly event schema (off-chain)

You can store a normalized log in JSONL / Parquet. Example (JSONL):

```json
{"type":"round_created","round":"<PUBKEY>","target_pulse_index":123456,"commit_deadline_slot":999999,"reveal_deadline_slot":1000999,"slot":999000,"sig":"<TX_SIG>"}
{"type":"ticket_committed","round":"<PUBKEY>","participant":"<PUBKEY>","commitment":"<HEX32>","stake_amount":1,"slot":999100,"sig":"<TX_SIG>"}
{"type":"pulse_set","round":"<PUBKEY>","target_pulse_index":123456,"pulse_hash":"<HEX32>","slot":999500,"sig":"<TX_SIG>"}
{"type":"ticket_revealed","round":"<PUBKEY>","participant":"<PUBKEY>","guess_bit":1,"slot":999700,"sig":"<TX_SIG>"}
{"type":"round_settled","round":"<PUBKEY>","slot":1001000,"sig":"<TX_SIG>"}
```

!!! tip "Minimal is fine"
    You don’t need internal PDAs, seeds, or vault authority wiring to build a useful public index.

---

## Versioning rules

- **Any change** to message encoding must bump the domain separator (`TIMLG:v1` → `TIMLG:v2`).
- Whitepaper versions should reference the exact encoding version in effect.
- Public docs may describe the *current* version and keep old versions in the changelog.
