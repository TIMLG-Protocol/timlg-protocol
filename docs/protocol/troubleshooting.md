# Troubleshooting

| Document Control | Value |
|---|---|
| **Document ID** | TP-SAFE-002 |
| **Status** | Approved for Devnet MVP |

## 1. Transaction and environment issues

| Symptom | Likely cause | Recommended action |
|---|---|---|
| `Airdrop 429 Too Many Requests` | Devnet faucet rate limit | Retry later or use another funded wallet |
| `AccountOwnedByWrongProgram` | Wrong `PROGRAM_ID` or mint in environment | Re-check environment variables against current deployment |
| Claim fails with `NotWinner` | Ticket is not in winning claimable state | Verify the ticket outcome in the app or round inspection script |
| Missing TIMLG balance | Faucet or mint mismatch | Confirm mint address and use the current faucet path in the app/tooling |

## 2. Lifecycle issues

| Symptom | Likely cause | Recommended action |
|---|---|---|
| Pulse not posted | Oracle pipeline delayed or unavailable | Wait for timeout path; inspect operator logs or refund eligibility |
| Round appears finalized but reward not claimable | Settlement may not have processed the ticket batch yet | Verify `settle_round_tokens` status for the round |
| Refund not available | Pulse may still be unset but timeout not yet reached | Check slot-based refund eligibility rather than wall-clock time |
| Too many token accounts / confusing wallet view | Normal SPL account proliferation | Inspect by mint and associated account, not by raw account count alone |

## 3. Build and tooling issues

| Symptom | Likely cause | Recommended action |
|---|---|---|
| Anchor build failure | Toolchain mismatch | Align Rust, Solana CLI, and Anchor versions with the repository guidance |
| Script cannot find instruction in IDL | Local IDL mismatch | Refresh the IDL used by the script or compare against the deployed build |
| UI values do not match local scripts | Stale environment or wrong RPC | Confirm RPC, program ID, and mint addresses |
