# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  
It is intentionally written to be accurate without exposing sensitive operational details.

**Last updated:** 2025-12-25

---

## Current state (snapshot)

- **Localnet MVP:** ✅ working end-to-end (commit → oracle pulse → reveal → finalize → settle → claim → sweep)
- **Public docs:** 🟡 in progress (aligning wording and diagrams with the MVP implementation)
- **Code visibility:** the implementation repo stays **private** until we have a stable devnet release

---

## Milestones

Below, each stage is **collapsible**: click the title (or the “+”) to expand details.

<details class="roadmap-stage" markdown="1" open>
<summary>🟡 <strong>Stage 0 — Docs &amp; public hub</strong> <span class="roadmap-stage-meta">Website + navigation</span></summary>

**Output:** Website + navigation

**Definition of Done**
- Core pages populated
- Diagrams render (no Mermaid errors)
- No broken links / nav entries

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 1 — Core on-chain MVP (localnet)</strong> <span class="roadmap-stage-meta">Anchor program + tests</span></summary>

**Output:** Anchor program + tests

**Definition of Done**
- Tests pass consistently on localnet
- Full round lifecycle works end-to-end

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 2 — Gasless / signed paths</strong> <span class="roadmap-stage-meta">Relayer-friendly flows</span></summary>

**Output:** Relayer-friendly flows

**Definition of Done**
- Batch/signed commit &amp; reveal paths validated in tests

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 3 — Oracle signed pulse (on-chain)</strong> <span class="roadmap-stage-meta"><code>set_pulse_signed</code></span></summary>

**Output:** <code>set_pulse_signed</code>

**Definition of Done**
- Ed25519 verification on-chain
- Pulse is one-shot and replay-safe

</details>

<details class="roadmap-stage" markdown="1" open>
<summary>✅ <strong>Stage 4 — Lifecycle &amp; treasuries</strong> <span class="roadmap-stage-meta">finalize / settle / claim / sweep</span></summary>

**Output:** finalize / settle / claim / sweep

**Definition of Done**
- Token settlement gates claims
- Sweep works after grace period

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 5 — Devnet parity + reproducible demo</strong> <span class="roadmap-stage-meta">Devnet deploy + scripted demo</span></summary>

**Output:** Devnet deploy + scripted demo

**Definition of Done**
- Program deployed on devnet
- One script reproduces the full round lifecycle
- Docs match observed devnet behavior

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 6 — Optimization</strong> <span class="roadmap-stage-meta">Size / compute tightening</span></summary>

**Output:** Size / compute tightening

**Definition of Done**
- Not required for devnet demo
- Improves resilience and cost

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 7 — Real oracle ops (devnet)</strong> <span class="roadmap-stage-meta">Beacon → signer → tx</span></summary>

**Output:** Beacon → signer → tx

**Definition of Done**
- Deterministic pulse ingestion runs reliably on devnet
- Replay-safe publishing and indexing

</details>

<details class="roadmap-stage" markdown="1">
<summary>🟡 <strong>Stage 8 — Observability / DX</strong> <span class="roadmap-stage-meta">Minimal monitoring + runbook</span></summary>

**Output:** Minimal monitoring + runbook

**Definition of Done**
- Error taxonomy + recovery guidance
- Minimal telemetry hooks for ops

</details>
