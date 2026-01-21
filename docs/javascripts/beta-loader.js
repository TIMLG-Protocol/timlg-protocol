(() => {
  const ID_CSS = "beta-embed-css";
  const ID_JS  = "beta-embed-js";

  function log(...args) {
    console.debug("[beta-loader]", ...args);
  }

  function ensureCss(href) {
    if (!href) return;
    const abs = new URL(href, document.baseURI).toString();

    const existing = document.getElementById(ID_CSS);
    if (existing && existing.getAttribute("href") === abs) return;
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.id = ID_CSS;
    link.rel = "stylesheet";
    link.href = abs;
    document.head.appendChild(link);
    log("CSS injected:", abs);
  }

  function ensureModuleScript(src) {
    if (!src) return Promise.resolve();
    const abs = new URL(src, document.baseURI).toString();

    const existing = document.getElementById(ID_JS);
    if (existing && existing.getAttribute("src") === abs) return Promise.resolve();
    if (existing) existing.remove();

    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.id = ID_JS;
      s.type = "module";
      s.src = abs;
      s.onload = () => {
        log("JS injected:", abs);
        resolve();
      };
      s.onerror = (e) => {
        console.error("[beta-loader] script load error:", e);
        reject(e);
      };
      document.head.appendChild(s);
    });
  }

  async function mountIfNeeded() {
    const el = document.getElementById("beta-root");
    if (!el) return;

    const js = el.getAttribute("data-beta-js");
    const css = el.getAttribute("data-beta-css");
    if (!js) {
      log("beta-root found, but missing data-beta-js");
      return;
    }

    try {
      if (typeof window.__unmountBetaApp === "function") {
        window.__unmountBetaApp();
      }
    } catch {}

    try {
      ensureCss(css);
      await ensureModuleScript(js);

      if (typeof window.__mountBetaApp === "function") {
        window.__mountBetaApp();
        log("Mounted via __mountBetaApp()");
      } else {
        log("Bundle loaded; __mountBetaApp not found (bundle may auto-mount).");
      }
    } catch (e) {
      console.error("[beta-loader] mount failed:", e);
    }
  }

  function hookMaterialInstantNav() {
    let attempts = 0;
    const maxAttempts = 200; // ~10s

    const timer = setInterval(() => {
      attempts += 1;

      if (window.document$ && typeof window.document$.subscribe === "function") {
        clearInterval(timer);
        log("Hooking into Material document$");
        window.document$.subscribe(() => setTimeout(mountIfNeeded, 0));
        setTimeout(mountIfNeeded, 0);
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(timer);
        log("document$ not found, fallback to DOMContentLoaded only");
      }
    }, 50);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(mountIfNeeded, 0);
    hookMaterialInstantNav();
  });
})();
