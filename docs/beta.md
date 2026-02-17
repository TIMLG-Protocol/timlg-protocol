# Devnet Beta

<div style="display: flex; gap: 10px; margin-bottom: 15px;">
  <button 
    onclick="const ifr = document.getElementById('beta-iframe'); ifr.requestFullscreen ? ifr.requestFullscreen() : ifr.webkitRequestFullscreen ? ifr.webkitRequestFullscreen() : ifr.msRequestFullscreen();" 
    style="background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; transition: transform 0.2s;"
    onmouseover="this.style.transform='scale(1.05)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
    EXPAND TO FULL SCREEN
  </button>
  <a 
    href="../assets/beta/index.html" 
    target="_blank" 
    style="background: #222; color: #fff; border: 1px solid #444; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: all 0.2s;"
    onmouseover="this.style.background='#333'; this.style.borderColor='#666'"
    onmouseout="this.style.background='#222'; this.style.borderColor='#444'"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    OPEN IN NEW TAB
  </a>
</div>

<div style="width:100%; min-height:800px; border:none; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <iframe 
    id="beta-iframe"
    src="../assets/beta/index.html" 
    style="width:100%; height:100%; border:none;"
    title="Devnet Beta App"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    allow="clipboard-read; clipboard-write; camera; fullscreen"
    onload="document.getElementById('beta-loader-msg').style.display='none'"
  ></iframe>
</div>

<script>
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "BETA_RESIZE") {
      const iframe = document.getElementById("beta-iframe");
      if (iframe) {
        iframe.style.height = (e.data.height + 50) + "px";
        iframe.parentElement.style.height = (e.data.height + 50) + "px";
      }
    }
  });
</script>

<p id="beta-loader-msg" style="text-align:center; color:#888; font-size:0.8em; margin-top:10px;">
  <em>If the application does not load automatically, please refresh the page (F5 or Ctrl+R).</em>
</p>
