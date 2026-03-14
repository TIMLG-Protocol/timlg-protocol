# Oracle Trust Model

| Document Control | Value |
|---|---|
| **Document ID** | TP-SAFE-003 |
| **Status** | Approved for Devnet MVP |
| **Purpose** | State the trust assumptions for pulse publication clearly and narrowly |

The protocol depends on an external pulse source and an authorized signer that proves the pulse submitted on-chain is the pulse the protocol intended to accept.

## 1. Current model

| Aspect | Current MVP rule |
|---|---|
| **Acceptance model** | One configured oracle public key is accepted by `set_pulse_signed` |
| **Signature scheme** | Ed25519 verification instruction must be present and must match the expected message |
| **Authority to change oracle key** | Admin-controlled configuration path |
| **Source referenced by deployment** | Public randomness pulse sourced from the NIST Randomness Beacon workflow used by the operator |

## 2. User trust assumptions

| Assumption | Meaning |
|---|---|
| **Source integrity** | The operator fetches the intended public pulse correctly |
| **Signer custody** | The oracle private key is not compromised |
| **Availability** | The pulse is posted early enough for a valid reveal window |
| **Configuration correctness** | The stored oracle pubkey is the one the deployment intends to trust |

## 3. What the protocol verifies on-chain

| Verified on-chain | Not verified on-chain |
|---|---|
| Signature matches the configured oracle pubkey | How the off-chain operator fetched the external pulse |
| Signed message fields match the expected round context | Internal operator infrastructure topology |
| Pulse is only set once per round | Organizational controls around the signer |

## 4. Future hardening

| Planned area | Rationale |
|---|---|
| Oracle set / threshold acceptance | Reduce single-signer dependency |
| Better public verification tooling | Make third-party checking easier |
| Stronger authority separation | Reduce operational key concentration |
