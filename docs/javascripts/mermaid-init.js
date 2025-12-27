// docs/javascripts/mermaid-init.js
// Render Mermaid diagrams for MkDocs Material, including "navigation.instant" page swaps.

function renderMermaid() {
  const blocks = document.querySelectorAll(".mermaid");
  if (!blocks.length) return;

  // Mermaid must be available as a global (UMD build).
  if (typeof window.mermaid === "undefined") {
    console.warn("Mermaid not loaded (window.mermaid undefined).");
    return;
  }

  try {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict"
    });
    window.mermaid.run({ querySelector: ".mermaid" });
  } catch (e) {
    console.error("Mermaid render failed:", e);
  }
}

// Material for MkDocs exposes a reactive observable for instant navigation.
if (typeof window.document$ !== "undefined" && typeof window.document$.subscribe === "function") {
  window.document$.subscribe(() => {
    // Give the new content a tick to mount
    window.setTimeout(renderMermaid, 0);
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    renderMermaid();
  });
}
