# Roadmap

This page is a **public, high-level execution plan** for TIMLG.  
It is intentionally written to be accurate without exposing sensitive operational details.

For the “live” view of what is happening right now (focus, blockers, next actions), see **Status**.

**Last updated:** 2025-12-25

---

## Milestones

<table class="roadmap-milestones">
  <colgroup>
    <col style="width:6%">
    <col style="width:20%">
    <col style="width:20%">
    <col style="width:10%">
    <col style="width:44%">
  </colgroup>
  <thead>
    <tr>
      <th>Stage</th>
      <th>Goal</th>
      <th>Output</th>
      <th>Status</th>
      <th>Definition of Done</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0</strong></td>
      <td>Docs &amp; public hub</td>
      <td>Website + navigation</td>
      <td>🟡 In progress</td>
      <td>
        <ul>
          <li>Core pages populated</li>
          <li>Diagrams render (no Mermaid errors)</li>
          <li>No broken links / nav entries</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>1</strong></td>
      <td>Core on-chain MVP (localnet)</td>
      <td>Anchor program + tests</td>
      <td>✅ Done</td>
      <td>
        <ul>
          <li>Tests pass consistently on localnet</li>
          <li>Full round lifecycle works end-to-end</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>2</strong></td>
      <td>Gasless / signed paths</td>
      <td>Relayer-friendly flows</td>
      <td>✅ Done</td>
      <td>
        <ul>
          <li>Batch/signed commit &amp; reveal paths validated in tests</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>3</strong></td>
      <td>Oracle signed pulse (on-chain)</td>
      <td><code>set_pulse_signed</code></td>
      <td>✅ Done</td>
      <td>
        <ul>
          <li>Ed25519 verification on-chain</li>
          <li>Pulse is one-shot and replay-safe</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>4</strong></td>
      <td>Lifecycle &amp; treasuries</td>
      <td>finalize/settle/claim/sweep</td>
      <td>✅ Done</td>
      <td>
        <ul>
          <li>Token settlement gates claims</li>
          <li>Sweep works after grace period</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>5</strong></td>
      <td>Devnet parity + reproducible demo</td>
      <td>Devnet deploy + scripted demo</td>
      <td>🧱 Blocked</td>
      <td>
        <ul>
          <li>Program deployed on devnet</li>
          <li>One script reproduces the full round lifecycle</li>
          <li>Docs match observed devnet behavior</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>6</strong></td>
      <td>Optimization (optional)</td>
      <td>Size / compute tightening</td>
      <td>⚠️ Optional</td>
      <td>
        <ul>
          <li>Not required for devnet demo</li>
          <li>Improves resilience and cost</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>7</strong></td>
      <td>Real oracle ops (devnet)</td>
      <td>Beacon → signer → tx</td>
      <td>🧱 Blocked</td>
      <td>
        <ul>
          <li>Deterministic pulse ingestion runs reliably on devnet</li>
          <li>Replay-safe publishing and indexing</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>8</strong></td>
      <td>Observability / DX</td>
      <td>Minimal monitoring + runbook</td>
      <td>❌ Pending</td>
      <td>
        <ul>
          <li>Error taxonomy + recovery guidance</li>
          <li>Minimal telemetry hooks for ops</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

## What “Devnet parity” means here

Devnet parity is not just “it deploys”. It means:

- deterministic scripts can create a round, commit, set a signed pulse, reveal, finalize, settle, claim, and sweep
- all constraints behave the same as localnet (PDAs, token accounts, slot windows)
- the public docs match the observed behavior

---

## Public releases strategy

- **Docs site:** updated continuously (living documentation)
- **Whitepaper PDF:** versioned releases (v0.1, v0.2, …)
- **Code repo:** published once devnet release is stable, with tags matching the whitepaper

---

## Risks & constraints (public)

- Limited devnet funding can slow iteration and reproducible demos
- Oracle ops must remain deterministic and replay-safe
- Treasury and authorities must be hardened (multisig / separation of duties) before mainnet readiness
