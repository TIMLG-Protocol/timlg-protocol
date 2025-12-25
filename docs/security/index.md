# Security & Control

This section clarifies what is intentionally **public vs private**, and how TIMLG preserves **authorized control** while avoiding accidental disclosure of sensitive operational details.

TIMLG is currently in an **MVP phase** (localnet validated). The implementation repository and operational tooling remain **private** until a stable devnet release is ready.

!!! warning "Principle"
    Public documentation must never include anything that enables unauthorized control, signing, authority changes, or fund movement.

---

## What is public vs private

| Category | Public (this repo) | Private (not published here) |
|---|---|---|
| Specs & docs | Protocol overview, specs, diagrams, rationale | Internal notes that increase exploitability |
| Roadmap & status | Milestones, progress snapshots | Private scheduling, vendor contacts, infra bills |
| Architecture | High-level component flow | Concrete infra topology (hosts, endpoints, regions) |
| Keys & signers | **Never** | Private keys, seed phrases, signer files, custody procedures |
| Oracle / relayer ops | High-level behavior | Runbooks, automation, secrets, privileged configs |
| Treasury | Conceptual routing rules | Authority handoff procedures, signer topology |

---

## Where to go next

- **Authority surfaces** (who can do what, and why it matters): [Authority Surfaces](authorities.md)  
- **Threat model summary** (public, MVP stage): [Threat Model](threat_model.md)  
- **Responsible disclosure** (how to report issues safely): [Responsible Disclosure](disclosure.md)

---

## Security posture (MVP stage)

- **Goal now:** correctness + replay-safety + deterministic settlement + clear authority boundaries  
- **Goal next:** devnet parity, then hardening (multisig, separation of duties, audits)

This docs site is a **public artifact**. Anything posted here should be treated as public forever.
