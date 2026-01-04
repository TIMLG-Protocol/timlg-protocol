(() => {
  const INDEX_REL = "../assets/beta/index.html";

  const ID_CSS = "beta-embed-css";
  const ID_JS = "beta-embed-js";

  function log(...args) {
    // comenta esta línea si no quieres logs
    console.debug("[beta-mount]", ...args);
  }

  function isOnBetaPage() {
    // La forma más fiable: existe el contenedor
    return Boolean(document.getElementById("beta-root"));
  }

  function removeIfExists(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  async function mountBeta() {
    if (!isOnBetaPage()) return;

    const mountEl = document.getElementById("beta-root");
    if (!mountEl) return;

    // Limpia el contenedor (por si vuelves con navigation.instant)
    mountEl.innerHTML = "";

    // Quita assets previos para forzar re-ejecución del módulo
    removeIfExists(ID_CSS);
    removeIfExists(ID_JS);

    const indexUrl = new URL(INDEX_REL, document.baseURI).toString();
    log("Loading beta index:", indexUrl);

    const resp = await fetch(indexUrl, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Cannot fetch beta index.html (HTTP ${resp.status})`);

    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Vite suele generar 1 stylesheet principal y 1 module script principal
    const cssHref =
      doc.querySelector('link[rel="stylesheet"][href]')?.getAttribute("href") || null;

    const jsSrc =
      doc.querySelector('script[type="module"][src]')?.getAttribute("src") ||
      doc.querySelector("script[src]")?.getAttribute("src") ||
      null;

    if (!jsSrc) throw new Error("Cannot find JS bundle <script src=...> in beta index.html");

    const cssUrl = cssHref ? new URL(cssHref, indexUrl).toString() : null;
    const jsUrl = new URL(jsSrc, indexUrl).toString();

    log("Detected:", { cssUrl, jsUrl });

    if (cssUrl) {
      const link = document.createElement("link");
      link.id = ID_CSS;
      link.rel = "stylesheet";
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.id = ID_JS;
    script.type = "module";
    script.src = jsUrl;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  function safeMount() {
    // Deja que Material termine de pintar el contenido
    setTimeout(() => {
      mountBeta().catch((e) => {
        console.error("[beta-mount] Failed:", e);
      });
    }, 0);
  }

  // Hook para Material for MkDocs (navigation.instant)
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => safeMount());
  } else {
    // Fallback si no existe document$ (por si cambias theme/features)
    document.addEventListener("DOMContentLoaded", safeMount, { once: true });
    window.addEventListener("popstate", safeMount);
  }
})();
