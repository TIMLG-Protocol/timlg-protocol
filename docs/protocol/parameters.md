# Parameters (Devnet vs Mainnet)

This page summarizes the **key parameters** that shape the user experience and protocol economics.

- **Devnet** values are intentionally short for rapid testing.
- **Mainnet** will use larger values (especially for claim grace) to match real user behavior.

> The protocol enforces timing in **slots**. Any wall-clock time shown in UI is approximate.

---

## Devnet (demo / testing)

Devnet runs with shorter windows so rounds complete quickly.

| Parameter | Devnet value | What it means |
|---|---|---|
| Stake per ticket | **1 token** | The amount paid per commit (TIMLG whole-token unit). |
| Commit window | **120 slots** | betting window (default devnet config). |
| Reveal window | **120 slots** | Window to reveal your guess after pulse publication. |
| Claim Grace | **0 slots** | Default grace period before a sweep is allowed (configurable). |
| Refund timeout | **150 slots** | Safety window (~1 min) to recover stake if the Oracle fails (permissionless). |
| Reward fee | **100 bps (1%)** | Fee taken from winner rewards to the protocol fee pool. |
| Operator pipeline depth | **7 rounds** | Number of future rounds maintained by the operator. |
| Operator tick | **5 seconds** | Frequency of the automated maintenance loop. |

**Notes**
- Devnet numbers may change frequently during testing.
- The Devnet Beta UI reads live state from chain; if the UI shows different values, the UI is the correct reference.

---

## Mainnet (planned)

Mainnet parameters will be tuned for real users and reliable claims across time zones.

| Parameter | Mainnet policy (planned) | Why |
|---|---|---|
| Stake per ticket | **TBD (announced before launch)** | Depends on target economy and incentives. |
| Commit window | **Longer than Devnet** | Gives users time to participate and handles network variance. |
| Reveal window | **Longer than Devnet** | Reduces accidental “NO-REVEAL” outcomes. |
| Claim Grace | **Significantly longer** | Supports realistic claim habits (e.g. 24h - 48h). |
| Reward fee | **Stable + announced** | Predictable economics; avoid frequent changes. |
| Operator pipeline depth | **Conservative (≥ Devnet)** | Resilience against temporary oracle delays. |
| Operator tick | **Tuned for reliability** | Balanced for cost and responsiveness. |

---

## Change policy (responsible disclosure)

- During **Devnet**, parameters can change as part of iteration.
- Before **Mainnet**, final values will be **published and versioned** as part of the launch announcement.
- On Mainnet, parameter changes are intended to be **tightly controlled** (e.g., admin/multisig policy) to protect users.

---

## Glossary (quick)

- **Commit window:** time allowed to submit commitments (tickets).
- **Reveal window:** time allowed to reveal guesses after the randomness pulse is posted.
- **Claim Grace:** the safety period (in slots) after the **Reveal Deadline** during which winners can claim. The round **cannot** be swept until this grace expires. After this window, remaining tokens are swept to Treasury.
- **Fee (bps):** basis points; 100 bps = 1%.
- **Pipeline depth:** how many future rounds the operator keeps ready.
