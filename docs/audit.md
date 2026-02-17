# Live Protocol Audit <a href="../assets/beta/index.html?mode=audit" target="_blank" title="Open in New Tab" style="margin-left: 8px; opacity: 0.4; color: inherit; text-decoration: none; vertical-align: middle; display: inline-flex; align-items: center; justify-content: center; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.4"><svg fill="currentColor" width="26" height="26" viewBox="0 -0.08 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.93,9.36a.38.38,0,0,0-.37.38V13a.76.76,0,0,1-.75.75H6.19A.76.76,0,0,1,5.44,13V6.89a.75.75,0,0,1,.75-.74h3.94a.38.38,0,0,0,.38-.38.37.37,0,0,0-.38-.37H6.19a1.5,1.5,0,0,0-1.5,1.49V13a1.51,1.51,0,0,0,1.5,1.5h7.62a1.51,1.51,0,0,0,1.5-1.5V9.74A.38.38,0,0,0,14.93,9.36Z"/><path d="M12.06,6.18H14L9.61,9.81a.38.38,0,0,0,.24.67.38.38,0,0,0,.24-.09l4.45-3.7,0,1.56a.38.38,0,0,0,.37.37h0a.38.38,0,0,0,.38-.38l0-2.42a.37.37,0,0,0-.37-.37l-2.85,0h0a.38.38,0,0,0,0,.75Z"/></svg></a>

This real-time dashboard provides transparency into the TIMLG Protocol's current state on the Solana Devnet. Use this page to verify treasury balances, round status, and protocol integrity without needing a wallet.

<div style="width:100%; border:none;">
  <iframe 
    id="audit-iframe"
    src="../assets/beta/index.html?mode=audit" 
    style="width:100%; height:820px; border:none; overflow:hidden;"
    scrolling="no"
    title="TIMLG Protocol Live Audit"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    allow="clipboard-read; clipboard-write; camera; fullscreen"
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
