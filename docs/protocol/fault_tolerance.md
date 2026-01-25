# Fault Tolerance & Risk Management

This document outlines how the TIMLG protocol handles technical failures, oracle outages, and network instability to protect user funds and maintain system integrity.

## 1. Oracle Failures (NIST Outage)

TIMLG depends on signed pulses from the NIST Randomness Beacon. If a pulse cannot be retrieved or is never set on-chain, the protocol provides a **slot-based refund path** to protect users.

### Refund availability (slot-based)

A ticket becomes refundable when **all** of the following are true:

- The round has **no valid pulse set** (`pulse_set == false`).
- The reveal window has ended (the round reached `reveal_deadline_slot`).
- The current slot exceeds the refund safety timeout:

`current_slot > reveal_deadline_slot + REFUND_TIMEOUT_SLOTS`

`REFUND_TIMEOUT_SLOTS` is a protocol parameter (see `parameters.md`). On Devnet it is typically **150 slots**.

### How refunds are executed

There are two refund instructions:

- **`recover_funds`**: the ticket owner triggers the refund.
- **`recover_funds_anyone`**: **permissionless** refund — anyone can trigger the refund on behalf of the ticket owner (useful for bots/operators to guarantee refunds even if users do not return promptly).

Refunds return the original stake (SPL tokens) from the round’s token vault to the user’s associated token account and close/mark the ticket to prevent double-refunds.

### Notes

- All timeouts are expressed in **Solana slots**; real wall-clock time depends on cluster conditions.
- If a pulse is posted later and becomes valid before refund conditions are met, the round proceeds normally and refunds are not available.

---

## 2. Network Congestion (Solana Delays)

Solana network congestion can delay transactions. TIMLG timing windows include safety margins to absorb these variations:

- **Reveal Deadline**: Provides a buffer after pulse publication to ensure users can submit reveals even during high-fee periods.
- **Permissionless Settlement**: Once a round is finalized, any user can trigger `settle_round_tokens`, preventing the protocol from stalling due to specific operator failures.

---

## 3. Protocol Safety Switches

The `Config Authority` (intended for Multisig management) controls critical safety parameters:

- **Circuit Breakers**: The ability to **pause** the protocol via `set_pause`, which stops new rounds and most core instructions until the system is restored.
- **Parameter Tuning**: Authorities can adjust window sizes and timeouts (within safe bounds) to adapt to changing network conditions.

---

## 4. Economic Risks & Invariants

| Risk | Mitigation Strategy |
|---|---|
| **Hyper-inflation** | Balanced mint (wins) vs. burn (losses/expired) mechanics. The protocol is statistically designed to be net-neutral or deflationary. |
| **Liquidity Drain** | **Reward Minting**: Rewards are minted on-demand at claim time, eliminating the risk of an emptied reward vault. |
| **Griefing** | **Burn-on-failure**: Tickets that are not revealed are burned during settlement, making it economically irrational to stall the protocol. |

!!! note "Timing Note"
    All timeouts and deadlines are expressed and enforced in **Solana slots**. Any wall-clock time shown in the UI is an approximation based on current cluster performance.
