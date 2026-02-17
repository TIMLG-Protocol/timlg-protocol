# Live Protocol Audit

This real-time dashboard provides transparency into the TIMLG Protocol's current state on the Solana Devnet. Use this page to verify treasury balances, round status, and protocol integrity without needing a wallet.

<div style="width:100% border:none;">
  <iframe 
    id="audit-iframe"
    src="../assets/beta/index.html?mode=audit" 
    style="width:100%; height:820px; border:none; overflow:hidden; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"
    scrolling="no"
    title="TIMLG Protocol Live Audit"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    allow="clipboard-read; clipboard-write; camera"
    onload="document.getElementById('audit-loader-msg').style.display='none'"
  ></iframe>
</div>

<p id="audit-loader-msg" style="text-align:center; color:#888; font-size:0.8em; margin-top:10px;">
  <em>Syncing with Solana Devnet...</em>
</p>

---

### Auditable Areas

*   **TVL (Total Value Locked)**: Aggregated SOL held in active round vaults.
*   **Round Integrity**: Verification of `Announced` vs `Finalized` rounds.
*   **Security Policies**: Live links to on-chain verified builds and disclosure documents.
