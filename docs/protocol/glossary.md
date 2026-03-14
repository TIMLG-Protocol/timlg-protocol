# Glossary

| Metadata | Specification |
|---|---|
| **Document ID** | TP-REFR-005 |
| **Status** | Canonical definitions |

| Term | Definition |
|---|---|
| **BitIndex** | Deterministic number in the range `0..511` assigned to a ticket and used to select the deciding bit from the pulse. |
| **Commitment** | SHA-256 hash of the hidden guess and salt submitted during commit. |
| **Hawking Wall** | Timing rule that ensures the commit window closes before the deciding pulse is knowable. |
| **NIST Randomness Beacon** | Public randomness source used by the protocol for pulse data. |
| **PDA** | Program Derived Address controlled by the Solana program. |
| **Pulse** | The 512-bit randomness value used to evaluate tickets for a round. |
| **Round** | A slot-bounded experiment window with commit, reveal, and settlement stages. |
| **Stake** | TIMLG amount escrowed for one ticket. |
| **Sweep** | Post-grace cleanup operation for eligible unclaimed round-level balances. |
| **TIMLG** | Native protocol token used for ticket participation and rewards. |
| **Ticket** | One participation record created by a commit. |
| **UserStats** | Wallet-level statistics account containing aggregated counters such as played, won, lost, claimed, and streak metrics. |
| **Current streak** | Current consecutive-win run for a wallet according to the protocol's stats model. |
| **Longest streak** | Maximum confirmed consecutive-win run recorded for a wallet. |
| **Streak reward** | Future incentive layer that may use `UserStats` as eligibility input; not part of current MVP settlement. |
