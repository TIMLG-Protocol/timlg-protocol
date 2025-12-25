// TIMLG donation helpers
function timlgCopyDonationAddress() {
  const address = "4pVWvN8kwzqiZqh8f9KBkTPd1Jo3gbJ7mSHvPfbZJjA6";
  if (!navigator.clipboard) {
    // Fallback
    const el = document.createElement("textarea");
    el.value = address;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    timlgToast("Address copied!");
    return;
  }

  navigator.clipboard.writeText(address)
    .then(() => timlgToast("Address copied!"))
    .catch(() => timlgToast("Copy failed — please copy manually."));
}

function timlgToast(message) {
  // Lightweight toast without dependencies
  const toast = document.createElement("div");
  toast.className = "timlg-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 1400);
}
