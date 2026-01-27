# <img src="assets/icon_vector_logo.svg" width="40" style="vertical-align: bottom; margin-right: 10px;"> TIMLG Protocol

TIMLG is a **public, auditable experiment protocol** built on Solana.

It runs slot-bounded **commit–reveal rounds** against a publicly verifiable **512-bit randomness pulse**. The goal is to measure whether any strategy can predict a bit **under strict anti-leakage constraints** (“Hawking Wall”) — and to make that measurement reproducible by anyone.

<div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0;"><a href="/beta/" class="md-button md-button--primary" style="margin: 0; display: flex; align-items: center; gap: 8px;">Try the Devnet Beta <span style="background: #ffeb3b; color: #000; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">New</span></a></div>

!!! warning "Experimental Phase (Devnet)"
    TIMLG is currently in an **experimental phase on Solana Devnet**. Timing parameters are intentionally short to facilitate testing. Tokens and results on this network have no real-world value.

---

## Token Specifications

<div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.08); margin-bottom: 2em; display: flex; flex-direction: column; gap: 24px;">

  <!-- Header: Identity & Network -->
  <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
    <div style="background: #eff6ff; padding: 12px; border-radius: 12px;">
      <img src="assets/icon_vector_logo.svg" width="64" height="64" style="display: block;">
    </div>
    
    <div style="flex-grow: 1;">
      <h3 style="margin: 0; font-size: 1.8em; line-height: 1.2; color: #111827; font-weight: 800;">TIMLG Protocol</h3>
      <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
        <span style="background: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 600;">$TIMLG</span>
        <span style="color: #9ca3af;">•</span>
        <span style="color: #6b7280; font-size: 0.95em;">Solana Devnet</span>
      </div>
    </div>
  </div>

  <div style="height: 1px; background: #f3f4f6; width: 100%;"></div>

  <!-- Specs Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
    
    <!-- Token Type -->
    <div>
      <div style="font-size: 0.8em; color: #9ca3af; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">TOKEN STANDARD</div>
      <div style="color: #111827; font-weight: 600; font-size: 1.1em;">SPL Token</div>
    </div>

    <!-- Precision -->
    <div>
      <div style="font-size: 0.8em; color: #9ca3af; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">PRECISION</div>
      <div style="color: #111827; font-weight: 600; font-size: 1.1em;">0 Decimals <span style="font-weight: 400; color: #9ca3af;">(Whole Units)</span></div>
    </div>

    <!-- Contract -->
    <div>
      <div style="font-size: 0.8em; color: #9ca3af; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">MINT ADDRESS</div>
      <a href="https://explorer.solana.com/address/7nJ9vaCpjo3zDY1fzZv1KicjoZ6yPpzHFcKq3HDh8cEf/attributes?cluster=devnet" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 99px; font-family: monospace; font-weight: 700; text-decoration: none; font-size: 1em; white-space: nowrap;">
        <span>7nJ9...8cEf</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
    </div>

  </div>
</div>

---

## How it works (The Play Loop)

The protocol operates in continuous, overlapping rounds. Users participate via the interface:

1.  **Commit**: Choose a bit (Bear/Bull) and stake 1 TIMLG.
2.  **Wait**: The commit window closes, and the protocol waits for the Oracle Pulse.
3.  **Reveal**: Once the pulse is published, you reveal your encrypted guess.
4.  **Settle**: Winners claim rewards; losers' stakes are burned.

![TIMLG Play Card Interface](assets/start_guide/4-playcard.png){ width="100%" style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;" }

---

## What TIMLG is trying to achieve (Scientific Goals)

### 1) Audit randomness providers
Many systems rely on "randomness" provided by an oracle. TIMLG turns that into an **audit trail**: if the "randomness" is manipulable or leaky, a winning strategy will emerge on-chain.

### 2) Measure "predictability under constraints"
If a strategy claims an edge, it must survive commit–reveal timing and deterministic settlement.

### 3) Visual Evidence (Sankey Audit)
Every token is accounted for. The protocol provides radical transparency on where funds go: claimed, burned (loss), or swept (unclaimed wins).

![Flow Analysis - Sankey Diagram](assets/start_guide/15-walletoverview-analitics&flowchart.png){ width="100%" style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;" }

---

## Economics per ticket (MVP)

Per ticket, exactly **1 TIMLG unit** is escrowed.

| Outcome | Condition | What happens (MVP) |
|---|---|---|
| **WIN** | Matches the ticket’s target bit | Winner Claims: stake refund + **1 TIMLG minted reward** |
| **LOSE** | Does not match | Stake is **burned** |
| **NO-REVEAL** | No valid reveal by deadline | Stake is **burned** |

---

## Interpretation: The Hypothesis Ladder

TIMLG follows a pre-registered scientific ladder to interpret results, avoiding sensationalism:

*   **H0 — Null:** no effect (ordinary randomness).
*   **H1 — Bug:** implementation error.
*   **H2 — Leakage:** timing/data exposure.
*   **H3 — Oracle bias:** source manipulation.
*   **H4 — Unknown strategy:** a real advantage survives constraints.
*   **H5 — Exotic framing:** last resort explanation.

The practical rule is: **an anomaly is a reason to tighten constraints and replicate**, not to declare victory.

---

## Where to start

<div class="grid cards" markdown>

-   **Whitepaper**

    Canonical narrative: motivation, non-claims, hypothesis ladder, and design rationale.

    [Open Whitepaper](whitepaper/index.md)

-   **Protocol**

    MVP specification: timing windows, settlement rules, treasury routing, and log formats.

    [Read Protocol Specs](protocol/overview.md)

-   **Roadmap**

    Milestones and “definition of done” (MVP → devnet parity → hardening).

    [View Roadmap](roadmap/index.md)

-   **Support**

    If you want to support development, see the support page.

    [Support](support/index.md)

</div>
