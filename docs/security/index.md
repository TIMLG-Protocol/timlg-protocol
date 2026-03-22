# Security and Control

| Document Control | Value |
|---|---|
| **Scope** | Public security summary for the Devnet MVP |
| **Audience** | Developers, reviewers, integrators |

This section explains what is intentionally public, what remains private, and which control surfaces matter in the current MVP.

!!! warning "Public documentation boundary"
    This site must never disclose private keys, signer files, seed phrases, privileged operational topology, or any instruction sequence that would enable unauthorized control.

## 1. Public vs private by category

| Category | Public in this site | Private by design |
|---|---|---|
| **Protocol rules** | Timing, settlement, account roles, trust assumptions | Internal exploit analysis and sensitive review notes |
| **Architecture** | High-level component boundaries and control surfaces | Detailed infrastructure topology and privileged endpoints |
| **Authorities** | Which authority classes exist and what they control | Exact custody, signing workflow, hardware layout |
| **Operator behavior** | High-level lifecycle automation description | Private automation configuration, key handling, alert routing |
| **Treasury** | Routing model and account purpose | Signer custody and withdrawal procedures |

## 2. Current security posture

| Area | Current MVP posture | Hardening direction |
|---|---|---|
| **Oracle trust** | Single authorized signer | Oracle set / threshold model |
| **Admin control** | Centralized authority surfaces | Multisig, role split, stronger governance |
| **Replay safety** | Program/state guards + signed pulse verification | Additional versioned verification tooling |
| **Operational secrecy** | Private runbooks and signer custody remain off-site | Formalized separation of duties |

## 3. Where to read next

| Topic | Page |
|---|---|
| Explicit bounds on privileged abuse | [Privileged Adversary Model](privileged_adversary.md) |
| Operational invariants preventing state corruption | [Recovery and Safety Invariants](recovery_invariants.md) |
| Authority classes and implications | [Authorities](authorities.md) |
| Public threat summary | [Threat Model](threat_model.md) |
| Issue reporting | [Disclosure](disclosure.md) |
