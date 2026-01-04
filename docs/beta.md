# Devnet Beta

Connect Phantom, request devnet SOL, then claim CHRONO from the faucet.

<div id="beta-embed" class="beta-embed">
  <div class="beta-embed__loading">
    Loading Devnet Beta…
  </div>
</div>

<link rel="stylesheet" href="/stylesheets/beta.css">

<script>
  (async () => {
    const mount = document.getElementById("beta-embed");

    // Reescribe rutas del build Vite para que SIEMPRE cuelguen de /assets/beta/
    const toBetaPath = (p) => {
      if (!p) return p;

      // deja URLs absolutas externas intactas
      if (p.startsWith("http://") || p.startsWith("https://")) return p;

      // convierte "/assets/x" -> "/assets/beta/assets/x"
      if (p.startsWith("/")) return "/assets/beta" + p;

      // convierte "assets/x" o "./assets/x" -> "/assets/beta/assets/x"
      return "/assets/beta/" + p.replace(/^\.\//, "");
    };

    try {
      const res = await fetch("/assets/beta/index.html", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load beta index.html (HTTP ${res.status})`);

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      // limpia loader
      mount.innerHTML = "";

      // mete el body del index.html (normalmente contiene el div root)
      Array.from(doc.body.childNodes).forEach((n) => {
        mount.appendChild(document.importNode(n, true));
      });

      // CSS: link rel=stylesheet
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'));
      links.forEach((lnk) => {
        const href = lnk.getAttribute("href");
        const out = document.createElement("link");
        out.rel = "stylesheet";
        out.href = toBetaPath(href);
        document.head.appendChild(out);
      });

      // JS: script type=module
      const scripts = Array.from(doc.querySelectorAll('script[type="module"][src]'));
      scripts.forEach((scr) => {
        const src = scr.getAttribute("src");
        const out = document.createElement("script");
        out.type = "module";
        out.src = toBetaPath(src);
        document.body.appendChild(out);
      });
    } catch (e) {
      mount.innerHTML = `
        <div class="beta-embed__error">
          <b>Devnet Beta failed to load.</b><br/>
          ${String(e && e.message ? e.message : e)}<br/><br/>
          Try: <a href="/assets/beta/" target="_blank" rel="noreferrer">Open Devnet Beta in a new tab</a>
        </div>
      `;
    }
  })();
</script>

!!! note
    If the app doesn't load, hard refresh (Ctrl+Shift+R). If you still see a blank page, open DevTools → Console/Network and check for 404s.

[Open Devnet Beta in a new tab](/assets/beta/)
