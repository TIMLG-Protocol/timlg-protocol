// Rename Material's footer navigation labels to "Back" and "Next".
// Works with navigation.instant (SPA) via document$.

function timlgSetFooterNavLabels() {
  try {
    const prev = document.querySelector(".md-footer__link--prev .md-footer__direction");
    if (prev) prev.textContent = "Back";

    const next = document.querySelector(".md-footer__link--next .md-footer__direction");
    if (next) next.textContent = "Next";
  } catch (e) {
    // no-op
  }
}

if (window.document$ && typeof window.document$.subscribe === "function") {
  window.document$.subscribe(timlgSetFooterNavLabels);
} else {
  document.addEventListener("DOMContentLoaded", timlgSetFooterNavLabels);
}
