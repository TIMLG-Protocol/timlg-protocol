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
- **Ticket**: a single participation in a round; it escrows a fixed token stake and settles deterministically.
- **Pulse**: a 512-bit value published by the oracle and verified on-chain (Ed25519).

---

## Canonical objects

### 1) Round header (on-chain state)

A round is identified by its on-chain address (PDA). The round state includes (at minimum):

| Field | Type | Meaning |
|---|---:|---|
| `round` | Pubkey | Round account address (canonical ID) |
| `round_id` | u64 | Numeric round ID stored on-chain |
| `pulse_index_target` | u64 | Which public pulse is targeted (index in the source) |
| `commit_deadline_slot` | u64 | Commit boundary (see Timing Windows) |
| `reveal_deadline_slot` | u64 | Reveal boundary (inclusive in MVP) |
| `pulse` | [64]byte | 512-bit pulse once set (or zeroed pre-pulse) |
| `pulse_set` | bool | Whether pulse is set (one-shot) |
| `finalized` | bool | Whether round is finalized |
| `token_settled` | bool | Whether token settlement has run |
| `swept` | bool | Whether the SOL + SPL sweep has been executed |

> Notes:
> - The program may store additional fields (vault addresses, authority pubkeys, counters).
> - Indexers should treat on-chain state as the source of truth.

---

### 2) Ticket record (indexable from transactions)

Tickets are created and updated by instructions like `commit_ticket` and `reveal_ticket`.

In the MVP implementation, a ticket PDA is derived from:
- `["ticket_v3", round_id_le, user_pubkey, nonce_le]`

For indexing purposes, a **useful minimal record** (aligned with on-chain `Ticket`) is:

| Field | Type | Meaning |
|---|---:|---|
| `round_id` | u64 | Round ID |
| `user` | Pubkey | Ticket owner (wallet) |
| `nonce` | u64 | Ticket nonce |
| `commitment` | [32]byte | Commitment digest submitted in the commit step |
| `stake_amount` | u64 | Fixed stake in **base units** of the TIMLG mint (read from on-chain `Config`) |
| `bit_index` | u16 | Derived bit index (0..511), stored on commit |
| `stake_paid` | bool | Whether stake was transferred to the round vault |
| `stake_slashed` | bool | Whether stake was burned/slashed during settlement |
| `processed` | bool | Whether settlement has processed the ticket (idempotency guard) |
| `revealed` | bool | Whether reveal succeeded |
| `win` | bool | Outcome flag after reveal (true/false) |
| `claimed` | bool | Whether reward claim has executed (winners only) |
| `created_slot` | u64 | Slot when commit landed |
| `revealed_slot` | u64 | Slot when reveal landed (0 if never revealed) |
| `claimed_slot` | u64 | Slot when claim landed (0 if not claimed) |

!!! note "Decimals and base units"
    The protocol accounts in **base units** (`u64`). The TIMLG mint may use different `decimals` across deployments.
    TIMLG uses **`decimals = 9`**. Indexers and tooling should treat `stake_amount` as base units.

---

## Ticket closure (`close_ticket`) and rent reclamation

A ticket PDA holds a **rent-exempt lamport deposit**. The owner can reclaim it by calling `close_ticket`, which closes the ticket account (`close = user`).

Indexers can treat a successful `close_ticket` as the terminal cleanup step for a ticket. The protocol sweep does **not** close user tickets.

---

## Commitment digest (as implemented)


TIMLG uses a standard **commit–reveal** scheme:

- **Commit**: submit a commitment digest during the commit window.
- **Reveal**: later submit `(guess, salt)` so the program can recompute the digest and verify you committed earlier.

### Canonical commitment hash (MVP v1)

The commitment hash is:

- `commitment = SHA256( "commit" || round_id_le || user_pubkey || nonce_le || guess_byte || salt_32 )`

Where:
- `"commit"` is the ASCII prefix (domain separator)
- `round_id_le` is `round_id` as 8 bytes little-endian
- `user_pubkey` is the raw 32-byte pubkey
- `nonce_le` is `nonce` as 8 bytes little-endian
- `guess_byte` is a single byte `0x00` or `0x01`
- `salt_32` is 32 bytes

!!! note "Why include round + user + nonce?"
    This prevents reusing the same reveal across different rounds or users, and makes each ticket unique.

---

## Signed batch message envelopes (relayer-safe)

Some flows support signed batches (for gasless/relayed usage). In those cases, the program checks that an Ed25519
verification instruction exists in the same transaction and that its message bytes match one of the following envelopes.

!!! note "Project prefix"
    The message domain separators use the current project identifier `timlg-protocol:*_v1`.

### Signed commit message (v1)

- `msg = "timlg-protocol:commit_v1" || program_id || round_id_le || user_pubkey || nonce_le || commitment_32`

### Signed reveal message (v1)

- `msg = "timlg-protocol:reveal_v1" || program_id || round_id_le || user_pubkey || nonce_le || guess_byte || salt_32`

### Oracle pulse message (v1)

- `msg = "timlg-protocol:pulse_v1" || program_id || round_id_le || target_pulse_index_le || pulse_64`

Indexers can reconstruct these message bytes exactly from the transaction + on-chain state.

!!! warning "No operational key disclosure"
    Public docs define the byte-level envelope, but do not include signer custody, internal endpoints, or any operational secrets.

---

## Indexer-friendly event schema (off-chain)

You can store a normalized log in JSONL / Parquet. Example (JSONL):

```json
{"type":"round_created","round":"<PUBKEY>","round_id":1,"target_pulse_index":123456,"commit_deadline_slot":999999,"reveal_deadline_slot":1000999,"slot":999000,"sig":"<TX_SIG>"}
{"type":"ticket_committed","round_id":1,"user":"<PUBKEY>","nonce":7,"commitment":"<HEX32>","stake_amount":1,"slot":999100,"sig":"<TX_SIG>"}
{"type":"pulse_set","round_id":1,"target_pulse_index":123456,"pulse_hash":"<HEX32>","slot":999500,"sig":"<TX_SIG>"}
{"type":"ticket_revealed","round_id":1,"user":"<PUBKEY>","nonce":7,"guess_bit":1,"slot":999700,"sig":"<TX_SIG>"}
{"type":"round_finalized","round_id":1,"slot":1001200,"sig":"<TX_SIG>"}
{"type":"round_token_settled","round_id":1,"slot":1001300,"sig":"<TX_SIG>"}
{"type":"ticket_claimed","round_id":1,"user":"<PUBKEY>","nonce":7,"slot":1001400,"sig":"<TX_SIG>"}
```

!!! tip "Minimal is fine"
    You don’t need internal PDAs or private wiring details to build a useful public index. On-chain state + txs are enough.

---

## Versioning rules

- Any change to message encoding must bump the domain separator (e.g., `timlg-protocol:*_v1` → `*_v2`).
- Whitepaper versions should reference the exact encoding version in effect.
- Public docs may describe the current version and keep old versions in the changelog.
