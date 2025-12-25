# Protocol Overview

TIMLG is a protocol for **verifiable time-logs** that can be used to coordinate and settle reproducible work.

## High-level components

- **Participants:** produce time-logs (claims) and later reveal evidence.
- **Commit–reveal flow:** reduces copying and enables delayed disclosure.
- **Relayer (optional):** batches submissions for better UX.
- **Settlement rules:** determine rewards/penalties and final outcomes.
- **Treasury model:** funds incentives and long-term sustainability.

## Minimal flow (conceptual)

1. **Commit:** a participant commits to a hash of their log / claim.
2. **Reveal:** the participant reveals the preimage (evidence + metadata).
3. **Verify:** rules validate structure and timing.
4. **Settle:** protocol distributes rewards and updates global state.

!!! warning "Public docs vs private implementation"
    This repository is docs-first. Production infrastructure details, signers, and privileged configs are **not** published here.

## Next steps for this page

- Add the precise data model (log format)
- Define roles and permissions
- Specify timing windows and edge cases
- Add a diagram of commit–reveal + settlement
