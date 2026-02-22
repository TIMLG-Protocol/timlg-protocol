# Error Reference

The TIMLG Protocol uses custom error codes to signal specific failure conditions. Below are the most common error codes encountered by users and operators.

| Error Code | Description |
|---|---|
| `PulseAlreadySet` | Attempted to set a pulse for a round that already has one. |
| `CommitWindowClosed` | Attempted to commit a ticket after the `commit_deadline_slot`. |
| `RevealWindowClosed` | Attempted to reveal a ticket after the `reveal_deadline_slot`. |
| `RevealWindowNotOpen` | Attempted to reveal before the oracle pulse has been submitted. |
| `InvalidCommitment` | The provided guess and salt do not match the on‑chain commitment hash. |
| `StakeAlreadyPaid` | Attempted to pay a stake for a ticket that has already been funded. |
| `InsufficientFunds` | The user's wallet does not have enough TIMLG or SOL to complete the transaction. |
| `SweepTooEarly` | Attempted to sweep unclaimed funds before the `claim_grace_slots` period has passed. |
| `MissingOrInvalidEd25519Ix` | The transaction is missing the required Ed25519 signature verification instruction. |
| `Ed25519PubkeyMismatch` | The public key in the Ed25519 instruction does not match an authorized oracle. |
| `Ed25519MessageMismatch` | The signed message does not match the expected round data. |
