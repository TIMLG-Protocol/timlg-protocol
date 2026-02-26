document.addEventListener("DOMContentLoaded", function () {
    const iframeId = "persistent-beta-app";
    const placeholderId = "beta-placeholder";

    function updateIframeVisibility() {
        const iframe = document.getElementById(iframeId);
        const placeholder = document.getElementById(placeholderId);

        if (!iframe) return;

        // Check if placeholder is present AND visible in the DOM
        if (placeholder && document.body.contains(placeholder) && placeholder.offsetParent !== null) {
            // We are on the Beta App page!
            const rect = placeholder.getBoundingClientRect();
            // Calculate position relative to the document
            const top = rect.top + window.scrollY;
            const left = rect.left + window.scrollX;

            // Move iframe to cover placeholder exactly (Absolute Positioning)
            iframe.style.position = "absolute";
            iframe.style.top = top + "px";
            iframe.style.left = left + "px";
            iframe.style.width = rect.width + "px";
            iframe.style.height = rect.height + "px";
            iframe.style.display = "block";
            iframe.style.visibility = "visible";
            iframe.style.opacity = "1";
            iframe.style.zIndex = "1"; // Above content but below header

            // Ensure z-index doesn't block interactions if misplaced
            iframe.style.pointerEvents = "auto";

        } else {
            // We are elsewhere -> Hide but Keep Alive
            iframe.style.display = "none";
            iframe.style.visibility = "hidden";
            iframe.style.opacity = "0";
            iframe.style.zIndex = "-100";
            iframe.style.pointerEvents = "none";
        }
    }

    // Initial check
    updateIframeVisibility();

    // Hook into Material for MkDocs instant navigation events
    if (window.location$) {
        // Hide immediately on navigation start to prevent "overlay" effect
        window.location$.subscribe(function () {
            const iframe = document.getElementById(iframeId);
            if (iframe) {
                iframe.style.display = "none";
                iframe.style.opacity = "0";
            }
        });
    }

    if (window.document$) {
        // Trigger visibility update after DOM is swapped
        window.document$.subscribe(function () {
            // Delay slightly to allow Material's fade-in/transition to complete
            setTimeout(updateIframeVisibility, 100);
            setTimeout(updateIframeVisibility, 500); // Fail-safe second check
        });
    }

    // Fallback for resize to keep position sync
    window.addEventListener("resize", updateIframeVisibility);

    // Also listen for potential height changes sent from the app
    window.addEventListener("message", (e) => {
        if (e.data && e.data.type === "BETA_RESIZE") {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder && e.data.height) {
                // Buffer for safety to avoid micro-scrollbars
                placeholder.style.height = (e.data.height + 20) + "px";
            }
            updateIframeVisibility();
        }
    });
});
