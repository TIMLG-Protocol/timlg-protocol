# Threat Model

| Document Control | Value |
|---|---|
| **Scope** | Public threat summary for the Devnet MVP |
| **Status** | Informational but aligned with current implementation |

This page is a public summary. It is meant to show what classes of failure matter, not to expose private operational detail.

## 1. Main threats and mitigations

| Threat | Failure mode | Current mitigation | Remaining limitation |
|---|---|---|---|
| **Admin key compromise** | Unauthorized config or treasury actions | Restricted authority surfaces, public documentation of roles | Still centralized in MVP |
| **Oracle key compromise** | Malicious pulse accepted | On-chain Ed25519 verification against configured pubkey | Single-signer trust remains |
| **Replay or duplicate execution** | Duplicate pulse, claim, refund, or reveal path | State flags, round binding, timing windows, signature checks | Depends on correct implementation discipline |
| **No-reveal griefing** | Users commit then disappear | Burn-on-no-reveal and deterministic deadlines | UX penalty remains real for inattentive users |
| **Misconfiguration** | Wrong oracle key, mint, or timing | Deterministic config, scripted deployment flows, public parameter docs | Human error is still possible |
| **Operator outage** | Rounds stall or refund path is needed | Timeout and refund path, inspection scripts, automation | Current liveness still depends on operator health |

## 2. Public invariants worth checking

| Invariant | Why it matters |
|---|---|
| No commit after deadline | Protects fairness of the pulse target |
| No reveal before pulse or after reveal deadline | Prevents timing abuse |
| Pulse accepted once only | Prevents contradictory round state |
| Claim cannot succeed twice | Protects supply and payout correctness |
| Sweep cannot pre-empt grace | Preserves winner claim window |
| Refund requires pulse absence | Prevents invalid dual-resolution paths |

## 3. MVP limitations that should be stated plainly

| Limitation | Current status |
|---|---|
| **Single-oracle dependency** | Present in MVP |
| **Centralized admin surfaces** | Present in MVP |
| **Operational liveness** | Strongly helped by the supervisor pipeline |
| **Devnet assumptions** | Parameters and cadence are tuned for testing, not production economics |
