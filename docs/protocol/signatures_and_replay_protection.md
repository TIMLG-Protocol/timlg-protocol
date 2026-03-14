# Signatures and Replay Protection

| Document Control | Value |
|---|---|
| **Document ID** | TP-SPEC-003 |
| **Status** | Approved for Devnet MVP |
| **Purpose** | Explain the current message-binding and anti-replay model without exposing sensitive operations |

The protocol relies on signed messages for oracle pulse publication and on state-based guards for idempotency and replay resistance.

## 1. Current replay protection layers

| Layer | Current role |
|---|---|
| **Program ID binding** | Prevents signatures from being meaningfully reused against a different deployment context |
| **Round binding** | Ties pulse acceptance and ticket actions to one round |
| **User / nonce binding** | Prevents one commitment from being reused as if it belonged to a different ticket |
| **State flags** | Prevent repeated execution after pulse, reveal, claim, or refund has already occurred |
| **Timing windows** | Reject signatures or actions outside valid commit / reveal / refund windows |

## 2. What is verified today

| Flow | Verification approach |
|---|---|
| **Pulse publication** | The transaction must include a valid Ed25519 verification instruction that matches the expected message and oracle pubkey |
| **Reveal** | The program recomputes the commitment hash from revealed inputs and compares it with the ticket state |
| **Claim / refund** | Ticket and round state must show the operation is eligible and not already consumed |

## 3. Practical meaning for reviewers

| Question | Current answer |
|---|---|
| Can a pulse be replayed into the wrong round? | Not if the signed message and round binding are checked correctly |
| Can a winner claim twice? | No, claim is state-guarded |
| Can a user reveal a different guess than the committed one? | No, the recomputed commitment must match the stored commitment |
| Can a timeout refund coexist with a valid pulse? | It should not, because refund eligibility depends on the absence of a valid pulse |

## 4. Scope note

This page intentionally avoids publishing byte-level message templates or operational signing procedures that would be more appropriate in private implementation documentation.
