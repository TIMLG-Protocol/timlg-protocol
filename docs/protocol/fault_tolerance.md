# Fault Tolerance & Risk Management

This document outlines how the TIMLG protocol handles technical failures, oracle outages, and network instability to protect user funds and maintain system integrity.

## 1. Oracle Failures (NIST Outage)

The protocol depends on signed pulses from the NIST Randomness Beacon. If the NIST service is offline or the pulse cannot be retrieved:

| Scenario | Protocol Response | Mitigation |
|---|---|---|
| **Pulse Delay (< 1 hour)** | Round remains in `SET_PULSE` state. | The Supervisor continues retrying until the pulse is available. |
| **Prolonged Outage (> 24 hours)** | Expiration policy applies. | If a pulse is not set before the `refund_deadline_slot`, the round can be invalidated. |
| **Invalid Signature** | Pulse is rejected by the on-chain Ed25519 program. | Prevents corrupted or malicious data from settling rounds. |

## 2. Network Congestion (Solana Delays)

Solana network congestion can delay transactions. The TIMLG timing windows are designed with "buffer zones":

- **Reveal Deadline**: Provides a generous window after the pulse is published to ensure users have enough slots to submit reveals even during high fee periods.
- **Permissionless Settlement**: Any user can trigger `settle_round_tokens` once the reveal window closes, preventing the protocol from getting "stuck" due to specific relayer failures.

## 3. Protocol Safety Switches

The `Config Authority` (eventually a Multisig) has access to safety parameters:

- **Circuit Breakers**: Ability to pause new round creation in case of identified exploits or critical external failures.
- **Refund Logic**: In extreme cases where a round cannot be resolved via pulse, the protocol allows for stake refunds to ensure users are not locked out of their capital.

## 4. Economic Risks

| Risk | Mitigation Strategy |
|---|---|
| **Hyper-inflation** | Balanced mint (wins) vs. burn (losses/expired) mechanics. Statistical expectation is net-neutral or deflationary. |
| **Liquidity Drain** | Rewards are minted on-demand, meaning they don't depend on a pre-funded vault that can be emptied. |
| **Griefing** | Staking requirements and "burn-on-failure" make it economically irrational to attempt to stall the protocol through non-revelation. |
