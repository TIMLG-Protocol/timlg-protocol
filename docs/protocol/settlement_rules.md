# Settlement Rules (Spec)

This page defines how TIMLG decides outcomes.

## Goals

- Deterministic outcomes given the same inputs
- Minimal ambiguity for auditors and participants
- Incentives aligned with verifiable behavior

## Baseline rules (MVP)

A reveal is **valid** if:
1. A matching commitment exists for `(author, epoch_id)`
2. The reveal reconstructs the same commitment hash
3. The reveal is within the allowed reveal window
4. The payload passes format constraints (schema + canonicalization)

If valid:
- record the log
- update metrics/indexes
- apply rewards/fees per tokenomics policy

If invalid:
- reject the reveal
- optionally apply penalties (spam / non-reveal / invalid reveal)

## Optional oracle inputs

When required, settlement may incorporate oracle-provided deterministic values.

!!! note
    Oracle inputs must be:
    - publicly verifiable (or reproducible)
    - deterministic for a given epoch
    - bounded by clear acceptance rules

## Invariants (must always hold)

- A reveal cannot be accepted without a prior matching commitment
- The same commitment cannot be settled twice
- Treasury movements follow explicit rules (no hidden paths)

## Next steps

- Specify reward/penalty outcomes precisely
- Define metric/index updates (what gets recorded, where, and why)
