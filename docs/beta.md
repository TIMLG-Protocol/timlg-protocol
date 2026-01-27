# Devnet Beta

<div style="width:100%; min-height:800px; border:none;">
  <iframe 
    id="beta-iframe"
    src="../assets/beta/index.html" 
    style="width:100%; height:100%; border:none; overflow:hidden;"
    scrolling="no"
    title="Devnet Beta App"
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
