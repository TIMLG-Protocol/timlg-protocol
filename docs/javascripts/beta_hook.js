(function () {
  function ensureCss(href) {
    if (!href) return;
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some((l) => l.getAttribute("href") === href);
    if (exists) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function ensureModuleScript(src) {
    if (!src) return Promise.resolve();
    const exists = Array.from(document.querySelectorAll('script[type="module"]'))
      .some((s) => s.getAttribute("src") === src);
    if (exists) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  async function bootBeta() {
    const el = document.getElementById("beta-root");
    if (!el) return;

    const js = el.getAttribute("data-beta-js");
    const css = el.getAttribute("data-beta-css");

    try {
      ensureCss(css);
      await ensureModuleScript(js);

      if (typeof window.__mountBetaApp === "function") {
        window.__mountBetaApp();
      }
    } catch (e) {
      console.error("[beta_hook] failed to load beta bundle:", e);
    }
  }

  // Material for MkDocs: instant navigation hook
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      // Unmount previous (safe)
      if (typeof window.__unmountBetaApp === "function") {
        try { window.__unmountBetaApp(); } catch {}
      }
      bootBeta();
    });
  } else {
    document.addEventListener("DOMContentLoaded", bootBeta);
  }
})();
