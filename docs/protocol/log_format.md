# Log Format (Spec)

This page defines the **canonical formats** that make commits/reveals verifiable and replayable.

> Note: The MVP on-chain implementation follows these rules. Public docs avoid operational details (keys, infra).

## Definitions

- `round_id`: `u64`
- `user`: Solana public key (`32 bytes`)
- `nonce`: `u64` chosen by the user to prevent correlation / replay across rounds
- `guess`: `u8` ∈ {0,1}
- `salt`: `32 bytes` secret chosen by the user
- `pulse`: `64 bytes` (512 bits)

---

## Commitment hash (canonical)

A ticket’s commitment is:

- `commitment = SHA256( "commit" || round_id_le || user || nonce_le || guess || salt )`

Where:

- `"commit"` is the ASCII string `commit` (5 bytes)
- `round_id_le` is `round_id` as **little-endian** 8 bytes
- `nonce_le` is `nonce` as **little-endian** 8 bytes
- `guess` is a single byte: `0x00` or `0x01`
- `salt` is 32 raw bytes

This is the **only** valid commitment format.

---

## BitIndex derivation (canonical)

Each ticket derives a fixed bit position inside the 512-bit pulse:

- `bit_index = (u16_le(first2bytes(SHA256("bitindex" || round_id_le || user || nonce_le)))) mod 512`

This ensures:

- Each ticket reads exactly one bit from the pulse.
- The bit position is unpredictable before the commit, but reproducible later.

### Pulse bit extraction

Given `pulse[0..63]` and `bit_index`:

- `byte_i = bit_index // 8`
- `bit_i  = bit_index % 8`
- `bit    = (pulse[byte_i] >> bit_i) & 1`

---

## Oracle pulse message (signed)

The oracle signs a canonical message for the pulse:

- `msg = "chronology:pulse_v1" || program_id || round_id_le || pulse_index_target_le || pulse`

Where:

- `"chronology:pulse_v1"` is ASCII
- `program_id` is 32 bytes
- `pulse_index_target_le` is `u64` little-endian (8 bytes)
- `pulse` is the 64-byte payload

The on-chain program validates an Ed25519 signature over this message (the signature itself is supplied via an Ed25519 instruction immediately before the program instruction).

---

## Versioning notes

- Any change to:
  - commitment preimage fields/order,
  - bit index derivation,
  - or oracle message prefix
  **must** bump a protocol version and remain backward compatible via explicit handling.
