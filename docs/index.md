# TIMLG Protocol

TIMLG is a **commit–reveal protocol** for verifiable coordination using **slot‑bounded rounds** and a publicly verifiable **randomness pulse**.

[Read the Whitepaper](whitepaper/){
  .md-button .md-button--primary
}
[Protocol (MVP Specs)](protocol/overview/){ .md-button }
[Roadmap](roadmap/){ .md-button }
[Status](status/){ .md-button }

---

## What TIMLG does (in one minute)

TIMLG lets participants:

1) **Commit** a private guess during a round’s commit window  
2) An **oracle publishes** a 512‑bit pulse (tied to a public source) after commits close  
3) **Reveal** the guess + salt so the program can verify the commitment  
4) The program **settles** outcomes deterministically and enables **claims** (winners)

This site is the **public documentation hub**. It describes *what the protocol does* and how it behaves at the MVP level, without exposing operational secrets.

!!! note "Public docs vs private operations"
    We intentionally do **not** publish private keys, signer infrastructure, privileged configs, or production oracle/relayer runbooks.

---

## How it works (as implemented in the MVP)

```mermaid
sequenceDiagram
  participant A as Admin/Governance
  participant U as Participant
  participant O as Oracle
  participant P as Program

  A->>P: create_round (commit_deadline_slot, reveal_deadline_slot, pulse_index_target)
  U->>P: commit_ticket (commitment, nonce)
  Note over P: commits close
  O->>P: set_pulse_signed (public pulse, oracle signature)
  U->>P: reveal_ticket (guess, salt)
  A->>P: finalize_round
  A->>P: settle_round_tokens
  U->>P: claim_reward (winners)
  A->>P: sweep_unclaimed (after grace)
```

---

## Where to start

<div class="grid cards" markdown>

-   **Whitepaper**

    Canonical narrative: motivation, system model, and design rationale.

    [Open Whitepaper](whitepaper/)

-   **Protocol**

    MVP‑aligned specs: log format, timing windows, settlement rules, token flow, treasury.

    [Read Protocol](protocol/overview/)

-   **Roadmap**

    Milestones and “definition of done” for each stage (MVP → devnet → hardening).

    [View Roadmap](roadmap/)

-   **Status**

    Current progress and the next concrete tasks.

    [View Status](status/)

</div>

---

## Support (optional)

If you want to support development, see **Support** in the top menu.
