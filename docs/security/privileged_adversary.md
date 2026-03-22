# Privileged Adversary Model

| Document Control | Value |
|---|---|
| **Scope** | Operational boundaries and safeguards against privileged abuse |
| **Audience** | Security reviewers, technical operators, integrators |

TIMLG currently operates with privileged roles during the MVP phase. The security objective is not to deny that privileged control exists, but to make privileged actions constrained, observable, and operationally auditable.

This section documents what a privileged operator can do, what safeguards currently limit abuse, and which residual risks remain until quorum-controlled execution replaces single-operator flows.

## 1. Privileged Actions

A privileged administrator (via Config or Oracle Authority) can currently perform the following actions:

- Update parameters in the protocol configuration (`update_config`).
- Rotate the authorized oracle public key (`set_oracle_pubkey`).
- Oversee automated lifecycle maintenance and recovery (`enter_recovery_mode`, `install_anchor`).
- Trigger settlement operations or sweep unclaimed funds (`sweep_unclaimed`, `close_round`).
- Deploy program upgrades (if the upgrade authority is retaining control).
- Reroute certain internal endpoints, provided the program design permits.

## 2. Current Safeguards

While the administrator holds privileges, the following invariants and safeguards constrain abuse without leaving cryptographic or operational evidence on-chain:

- **No Invisible Pulse Generation:** Arbitrary pulse synthesis is impossible. Every pulse must pass strict Ed25519 signature verification against the authorized oracle public key. It must also be coherent with the specific round and target pulse requirements.
- **Observable Recovery Paths:** Administrators cannot invisibly rewrite or skip rounds. Operations like Boot Recovery, Gap Recovery, and Anchor Installation are explicitly logged in the round state and lifecycle. There is no silent swallowing of committed rounds.
- **Verifiable Outcome Routing:** Outcomes strictly follow the on-chain state machine. A round cannot be silently diverted; the audit trail clearly marks its transition into Claim, Burn, Refund, Sweep, or Close paths.
- **Retrospective Non-Malleability:** Committed tickets cannot be altered retrospectively without breaking observable invariants.

## 3. Threat Matrix

| Actor | Capability | Abuse Scenario | Current Mitigation | Residual Risk | Planned Hardening |
|---|---|---|---|---|---|
| **Malicious Config Authority** | Update protocol config | Manipulating fee tiers, grace periods, or routing rules | Explicit on-chain event emissions; external diffability | Single-signer can still update config parameters | Multi-sig and DAO governance transition |
| **Malicious Oracle Signer** | Sign and submit pulses | Colluding to submit predictable pulses or denying service | Ed25519 signature enforcement; Gap recovery protocols | Oracle controls the randomness source timing | Threshold oracle and diverse entropy feeds |
| **Compromised Treasury Signer** | Move swept/collected funds | Unauthorized withdrawal of swept TIMLG/SOL | Sweeps are delayed by `claim_grace_slots`; strict PDA routing | Authorized signer retains final custody | Move custody to multi-sig or timelock smart contracts |
| **Malicious Upgrade Authority** | Deploy new program bytecode | Introducing backdoors or breaking invariants | Upgrades are detectable on-chain | Authority can unilaterally upgrade | Transition to Squads/Multisig program management |
| **Admin + Oracle Collusion** | Both roles act maliciously | Coordinated manipulation of timelines and pulses | Outcomes are deterministically tied to public NIST entropy | Both authorities are centralized in MVP | Separation of duties and quorum consensus |

## 4. Residual Risks

The current control model assumes privileged operators exist. Security is therefore framed in terms of abuse visibility, lifecycle integrity, and bounded operational authority, rather than absolute trust minimization.

- **Single-Operator Control:** The MVP relies on a single-operator model for critical maintenance and configuration.
- **Key Custody:** Config and Oracle authorities are highly sensitive and currently not fully quorum-controlled.
- **Governance:** The upgrade path remains centralized pending the transition to a decentralized governance module.
