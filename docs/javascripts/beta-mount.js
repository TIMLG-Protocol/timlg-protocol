(function () {
  // These placeholders will be replaced by publish_beta_to_mkdocs.sh
  const CSS_REL = "../assets/beta/assets/index-HGo3woVX.css";
  const JS_REL  = "../assets/beta/assets/index-DBdzFYNW.js";

  function absUrl(rel) {
    return new URL(rel, window.location.href).toString();
  }

  function ensureCssLoaded(hrefAbs) {
    const exists = document.querySelector(`link[data-beta-css="1"][href="${hrefAbs}"]`);
    if (exists) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = hrefAbs;
    link.dataset.betaCss = "1";
    document.head.appendChild(link);
  }

  function ensureModuleLoaded(srcAbs) {
    return new Promise((resolve, reject) => {
      const exists = document.querySelector(`script[data-beta-module="1"][src="${srcAbs}"]`);
      if (exists) return resolve();

      const s = document.createElement("script");
      s.type = "module";
      s.src = srcAbs;
      s.dataset.betaModule = "1";
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  async function onNav() {
    const root = document.getElementById("beta-root");

    // Leaving the page: unmount if possible
    if (!root) {
      if (window.__unmountBetaApp) window.__unmountBetaApp();
      return;
    }

    // Entering /beta/: ensure assets loaded, then mount
    const cssAbs = absUrl(CSS_REL);
    const jsAbs = absUrl(JS_REL);

    ensureCssLoaded(cssAbs);
    await ensureModuleLoaded(jsAbs);

    if (window.__mountBetaApp) window.__mountBetaApp();
  }

  // MkDocs Material instant navigation hook
  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(onNav);
  } else {
    document.addEventListener("DOMContentLoaded", onNav);
  }
})();
