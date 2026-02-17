# Live Protocol Audit

This real-time dashboard provides transparency into the TIMLG Protocol's current state on the Solana Devnet. Use this page to verify treasury balances, round status, and protocol integrity without needing a wallet.

<div style="display: flex; gap: 10px; margin-bottom: 15px;">
  <button 
    onclick="const ifr = document.getElementById('audit-iframe'); ifr.requestFullscreen ? ifr.requestFullscreen() : ifr.webkitRequestFullscreen ? ifr.webkitRequestFullscreen() : ifr.msRequestFullscreen();" 
    style="background: linear-gradient(135deg, #f5af19 0%, #f12711 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; transition: transform 0.2s;"
    onmouseover="this.style.transform='scale(1.05)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
    EXPAND TO FULL SCREEN
  </button>
  <a 
    href="../assets/beta/index.html?mode=audit" 
    target="_blank" 
    style="background: #222; color: #fff; border: 1px solid #444; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: all 0.2s;"
    onmouseover="this.style.background='#333'; this.style.borderColor='#666'"
    onmouseout="this.style.background='#222'; this.style.borderColor='#444'"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    OPEN IN NEW TAB
  </a>
</div>

<div style="width:100%; border:none; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <iframe 
    id="audit-iframe"
    src="../assets/beta/index.html?mode=audit" 
    style="width:100%; height:820px; border:none;"
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
