document.addEventListener("DOMContentLoaded", function () {
    const iframeId = "persistent-beta-app";
    const placeholderId = "beta-placeholder";

    function updateIframeVisibility() {
        const iframe = document.getElementById(iframeId);
        const placeholder = document.getElementById(placeholderId);

        if (!iframe) return;

        if (placeholder && document.body.contains(placeholder)) {
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
            iframe.style.zIndex = "1"; // Ensure it's above content but below header (z-index: 2)

            // Auto-resize listener from Iframe
            window.addEventListener("message", (e) => {
                if (e.data && e.data.type === "BETA_RESIZE") {
                    const newHeight = e.data.height + 50;
                    placeholder.style.height = newHeight + "px";
                    iframe.style.height = newHeight + "px";
                }
            });

        } else {
            // We are elsewhere -> Hide but Keep Alive
            iframe.style.display = "none";
            iframe.style.visibility = "hidden";
            iframe.style.opacity = "0";
            iframe.style.zIndex = "-100";
        }
    }

    // Initial check
    updateIframeVisibility();

    // Hook into Material for MkDocs instant navigation events
    if (window.location$) {
        window.location$.subscribe(function (url) {
            setTimeout(updateIframeVisibility, 100);
        });
    }

    // Fallback for resize to keep position sync
    // NOTE: Removed 'scroll' listener because absolute positioning handles scroll naturally
    window.addEventListener("resize", updateIframeVisibility);
});
