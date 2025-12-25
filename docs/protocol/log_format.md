# Log Format (Spec)

This page defines the **canonical structure** of a TIMLG time-log.

!!! note
    We keep this spec **implementation-friendly** (fields, constraints, canonicalization) while avoiding sensitive operational details.

## Goals

- A log format that is easy to serialize, hash, and verify
- Forward-compatible versioning
- Clear separation of **evidence** vs **metadata**

## Suggested structure (high level)

- `version`: schema version (e.g., `v0.1`)
- `epoch_id`: coordination window identifier
- `author`: participant identifier (pubkey / address)
- `timestamp_range`: start/end (or bounded proof of time)
- `claim_type`: category (experiment, benchmark, task, etc.)
- `inputs`: structured inputs (hashes or references)
- `outputs`: structured outputs (hashes or references)
- `evidence`: hashes/URIs or bundled proofs (avoid publishing private raw data here)
- `tags`: optional labels for discovery

## Canonicalization

Define a canonical encoding before hashing:
- stable key ordering
- stable numeric and timestamp formats
- strict UTF-8
- explicit schema versioning

## Commitments (concept)

A commitment binds a future reveal:

- commitment = `H(domain_sep || epoch_id || author || payload_hash || nonce)`

Where:
- `payload_hash` is the hash of the canonicalized reveal payload
- `nonce` is secret until reveal (prevents guessing)

!!! tip
    We can refine hashing primitives (SHA-256 / Keccak / etc.) later. What matters now is **determinism** and **domain separation**.

## Open questions

- Which fields must be on-chain vs referenced (hash + URI)?
- How do we represent time bounds in a verifiable way?
- What is the minimal evidence set for the MVP?
