# Threat Model (Public Summary)

This is a short, public summary suitable for the MVP phase. Detailed operational analysis stays private.

---

## Key threats and mitigations

| Threat | What it looks like | Impact | Mitigation (MVP / planned) |
|---|---|---|---|
| Key compromise (upgrade/config/treasury) | attacker gets a privileged key | takeover / fund loss | multisig + hardware keys + separation of duties (planned hardening) |
| Oracle key compromise | attacker signs pulses | outcome manipulation | strict custody; rotation policy; hardened signer pipeline (private ops) |
| Pulse spoofing | unsigned/wrong messages | invalid pulse accepted | on-chain Ed25519 verification + canonical message envelope |
| Replay attacks | reuse old signatures/tx patterns | double submit / bypass intent | canonical payloads + replay guards + instruction verification |
| No-reveal griefing | commit then refuse to reveal | fairness/UX degradation | slot windows + NO-REVEAL slashing policy + deterministic settlement |
| DoS / spam | mass ticket creation/tx spam | degraded UX | economic constraints + optional relayer policies (future) |
| Misconfiguration | wrong params/oracle pubkey | broken rounds | staged config changes + deterministic devnet scripts |

---

## Public invariants (auditable)

1. No commits after commit deadline  
2. No reveals after reveal deadline  
3. Pulse is verified on-chain and set only once  
4. Settlement depends only on public state + finalized pulse  
5. Claims are idempotent (no double-claims)  
6. Sweep cannot occur before grace period  
