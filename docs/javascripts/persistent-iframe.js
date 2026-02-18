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

            // Move iframe to cover placeholder exactly
            iframe.style.position = "fixed";
            iframe.style.top = rect.top + "px";
            iframe.style.left = rect.left + "px";
            iframe.style.width = rect.width + "px";
            iframe.style.height = rect.height + "px";
            iframe.style.display = "block";
            iframe.style.visibility = "visible";
            iframe.style.opacity = "1";
            iframe.style.zIndex = "10"; // Ensure it's above content

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
    // location$.subscribe is specific to Material theme instant loading
    if (window.location$) {
        window.location$.subscribe(function (url) {
            // Wait for DOM update
            setTimeout(updateIframeVisibility, 100);
        });
    }

    // Fallback for resize / scroll to keep position sync
    window.addEventListener("resize", updateIframeVisibility);
    window.addEventListener("scroll", updateIframeVisibility);
});
