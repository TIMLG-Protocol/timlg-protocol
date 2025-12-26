# Status

**Last updated:** 2025-12-25

This page is the **live progress view**: what we are doing now, what is blocked, and what is next.

For the long-term plan and definitions of done, see **Roadmap**.

---

## Current focus (this week)

- Documentation polish + spec migration (public)
- Devnet demo pack preparation (scripts + reproducible lifecycle)
- Keep implementation repo private until devnet behavior is stable

---

## Active blockers

- **Devnet SOL constraints**: faucet limits and funding availability slow test loops
- **Deployment parity work**: ensure PDAs, token accounts, and slot windows match localnet behavior

---

## What is public (this repo)

- Docs website (specs, diagrams, navigation)
- Whitepaper (web + PDF)
- Roadmap + public progress updates

## What stays private (by design)

- Private keys, seed phrases, privileged configs
- Production oracle/relayer runbooks and automation
- Any script/config that can move funds or change authorities

---

## Next milestone checklist (near-term)

- [ ] Verify Protocol pages reflect MVP naming and constraints
- [ ] Ensure diagrams render everywhere (no Mermaid errors)
- [ ] Prepare a one-command devnet deploy script (private until stable)
- [ ] Prepare a one-command demo script for a full round lifecycle (private until stable)
- [ ] Update docs to match observed devnet behavior once parity is reached
