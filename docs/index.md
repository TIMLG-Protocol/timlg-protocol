# TIMLG Protocol

**TIMLG** is a verifiable **time-log protocol** for **reproducible coordination**.

[Read the Whitepaper](whitepaper/){ .md-button .md-button--primary }
[Protocol Specs](protocol/overview/){ .md-button }
[Roadmap](roadmap/){ .md-button }
[Status](status/){ .md-button }

---

## What TIMLG does

TIMLG provides a structured way to **commit**, **reveal**, and **settle** time-logged work so results can be compared, verified, and incentivized.

- **Commit–reveal** reduces copying and supports delayed disclosure.
- **Audit-friendly settlement** turns logs into deterministic outcomes.
- **Treasury rules** support long-term sustainability.

!!! note "Docs-first public hub"
    This repository is the **public documentation site**.  
    Implementation details (keys, privileged configs, production oracle/relayer operations) are intentionally not published here.

---

## How it works (high level)

1. **Commit** — submit a commitment hash for your log/claim  
2. **Reveal** — reveal evidence + metadata  
3. **Verify & settle** — apply deterministic rules and update protocol state

```mermaid
flowchart LR
  A[Participant] -->|Commit| B[(On-chain Program)]
  A -->|Reveal| B
  C[Relayer (optional)] -->|Batch txs| B
  B --> D[Treasury / Incentives]
```

---

## Where to start

<div class="grid cards" markdown>

-   **Whitepaper**

    System model, assumptions, and rationale.

    [Open Whitepaper](whitepaper/)

-   **Protocol Specs**

    Mechanics, tokenomics, treasury rules, and settlement model.

    [Read Specs](protocol/overview/)

-   **Roadmap**

    What gets built next, and what “done” means for each milestone.

    [View Roadmap](roadmap/)

-   **Status**

    A public snapshot of progress, blockers, and next actions.

    [View Status](status/)

</div>

---

## Support (optional)

Donations are optional and are used to fund infrastructure, development, and (future) security reviews.  
See **Support** in the top menu.
