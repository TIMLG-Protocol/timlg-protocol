# Protocol Overview

TIMLG (TimeLog) is a **verifiable time-log protocol**: participants commit during a commit window, an oracle publishes a public randomness pulse after commits close, participants reveal their guess, and the program settles outcomes deterministically.

This documentation is **public** and intentionally avoids operational or privileged details.

!!! warning "Security principle"
    Public documentation must never include anything that enables unauthorized signing, authority changes, or treasury movement.

!!! note "Stability vs versioning"
    The **core concept** is stable (commit–reveal against a publicly verifiable 512-bit pulse; deterministic settlement with WIN/LOSE/NO-REVEAL).
    Some **protocol surfaces** may still evolve while moving from localnet → devnet/mainnet readiness. If they change, they will be **explicitly versioned** (e.g., v1 → v2) to preserve auditability for indexers and independent verifiers.
    Examples: signed message domain separators, relayer/gasless flows, authority hardening (multisig/rotation), and sweep/claim semantics.

---

## Architecture (high level)

```mermaid
flowchart TB
  P[Participant] -->|commit_ticket / reveal_ticket| S[On-chain Program]
  R[Relayer (optional, not part of MVP UX)] -->|batch submit (if enabled)| S
  O[Oracle] -->|set_pulse_signed| S

  S --> V[Round Token Vault (escrowed TIMLG)]
  S --> SV[Round SOL Vault (optional, for sweeps)]
  S --> TT[Treasury Token Account (receives NO-REVEAL stake)]
  S --> TS[Treasury SOL Account (receives SOL sweep)]
```

!!! note "MVP vs optional components"
    In the current MVP, the **core user flow** is user-paid commit → reveal → (win) claim.
    Relayer/batched flows exist as an optional design surface and may require additional on-chain/off-chain plumbing (see below).

---

## Roles

- **Participant**: commits a ticket, later reveals it, and (if winning) claims.
- **Oracle**: publishes a **pulse** (64 bytes / 512 bits) tied to a publicly verifiable source and verified on-chain.
- **Admin/Governance**: creates rounds and executes admin-gated lifecycle steps (finalize, settle, optional sweep).
- **Relayer (optional)**: submits transactions on behalf of users (batching/gasless patterns).  
  **Note:** “gasless” typically still requires the user to have pre-funded an on-chain mechanism (e.g., escrow) depending on implementation.

---

## Core objects (MVP implementation)

### Config (global)

The **Config** account defines deployment-wide parameters, including:

- `admin` (governing authority for admin-gated instructions)
- `mint` (TIMLG SPL token mint)
- `stake_amount` (integer, in mint base units; designed for decimals = 0 so `stake_amount = 1` means 1 TIMLG)
- treasury endpoints (token treasury account; SOL treasury account)
- timing knobs (e.g., claim grace slots)

!!! info "Whole-token unit (no decimals)"
    TIMLG is designed as a **whole-unit token** (`decimals = 0`) so that the base unit equals the user-facing unit.

### Round

A **Round** defines:

- `round_id`
- `pulse_index_target`
- `commit_deadline_slot` and `reveal_deadline_slot`
- `pulse` (set once after commits close)
- lifecycle flags: `pulse_set`, `finalized`, `token_settled`, `swept`
- vault references (token vault; optionally a SOL vault used for sweeps)

### Ticket

A **Ticket** binds a participant to a single commitment:

- `round_id`, `participant`, `nonce`
- `commitment` (32 bytes)
- `bit_index` (0–511), derived from `(round_id, participant, nonce)`
- reveal markers (`revealed`, `guess` as 0/1) and outcome (`win`)
- claim guards (`claimed`, `claimed_slot` or equivalent)

!!! note "Stake amount location"
    The stake amount is **not a per-ticket parameter** in the MVP; it is defined in the global **Config** and applied consistently to tickets in a round.

---

## Lifecycle (happy path)

```mermaid
sequenceDiagram
  participant A as Admin/Governance
  participant U as User
  participant O as Oracle
  participant P as Program

  A->>P: create_round
  U->>P: commit_ticket (<= commit_deadline_slot)
  Note over P: commits close (no commits once pulse is set)
  O->>P: set_pulse_signed (>= commit_deadline_slot)
  U->>P: reveal_ticket (<= reveal_deadline_slot)
  Note over P: reveal closes
  A->>P: finalize_round
  A->>P: settle_round_tokens
  U->>P: claim_reward (winners)
  A->>P: sweep_unclaimed (after grace, SOL-only)
```

### Key invariants

- **Commitments are immutable**: a reveal must match the commitment.
- **Pulse is one-shot**: a round’s pulse can only be set once.
- **Timing gates are enforced** by slots.
- **Settlement gates claiming**: claim happens only after token settlement.
- **Treasury routing is deterministic**:
  - LOSE → burned during settlement
  - NO-REVEAL → routed to token treasury
  - WIN → refundable stake + minted reward (on claim)

---

## Notes on optional / advanced flows

### Relayer / batching (optional)
Relayer-based flows (batching / sponsored fees) may be supported, but they typically require:

- a clear “who pays rent?” model (ticket account creation still costs SOL rent)
- a clear “where do staked tokens come from?” model (often escrow-based)
- strict message-format versioning for signed payloads

If/when enabled, relayer mode will be documented as a **versioned protocol surface**.

### SOL vault / sweep (optional)
`sweep_unclaimed` is **SOL-only** and assumes a SOL-holding vault exists for a given round.

- In some deployments, that vault is explicitly created/funded as part of setup (e.g., a `fund_vault` step).
- If sweep is not used, the SOL vault can be considered optional.

---

## Where to go deeper

- **Log Format** → canonical hashing and commitment rules, message formats, versioning
- **Timing Windows** → slot-based windows and edge cases
- **Settlement Rules** → how winners/losers/no-reveal are handled
- **Tokenomics** → how the MVP distributes and accounts for value
- **Treasury & BitIndex** → treasury flows and how bit indexes are derived
