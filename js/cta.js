/* ==========================================================================
   Emek Sofrası — Mobil dönüşüm şeridi (Ara · WhatsApp · Yol Tarifi)
   --------------------------------------------------------------------------
   Her sayfada, ekranın altında sabit. Sadece ≤820px'de görünür.
   Kendi stilini enjekte eder → hangi CSS dosyası yüklenirse yüklensin çalışır.
   [data-cta] attribute'leri main.js'teki GA4/Pixel köprüsüne bağlanır.
   Değişiklik için sadece CONFIG.
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = {
    phone: "+905310219976",
    waNumber: "905310219976",
    waMessage: "Merhaba, bugünün menüsünü öğrenebilir miyim?",
    /* Emek Sofrası konum koordinatı (Maslak / Sarıyer) */
    destination: "41.111447,29.020964"
  };

  if (document.getElementById("mobile-cta")) return;

  var wa = "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(CONFIG.waMessage);
  var dir = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.destination);

  var st = document.createElement("style");
  st.id = "mobile-cta-style";
  st.textContent = [
    "#mobile-cta{display:none}",
    "@media (max-width:820px){",
    "#mobile-cta{display:grid;grid-template-columns:repeat(3,1fr);",
    "position:fixed;left:0;right:0;bottom:0;z-index:90;",
    "background:#04210f;border-top:1px solid rgba(217,180,90,.35);",
    "box-shadow:0 -6px 20px rgba(0,0,0,.28);",
    "padding-bottom:env(safe-area-inset-bottom,0);",
    "font-family:'Mulish',system-ui,sans-serif}",
    "#mobile-cta a{display:flex;flex-direction:column;align-items:center;justify-content:center;",
    "gap:3px;padding:8px 4px 9px;color:#fdf9ef;text-decoration:none;",
    "font-weight:700;font-size:.72rem;letter-spacing:.02em}",
    "#mobile-cta a+a{border-left:1px solid rgba(217,180,90,.18)}",
    "#mobile-cta a:active{background:rgba(255,255,255,.06)}",
    "#mobile-cta svg{width:21px;height:21px}",
    "#mobile-cta .s{fill:none;stroke:#e0c07c;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#mobile-cta .f{fill:#e0c07c}",
    "body{padding-bottom:58px}",
    ".es-chat{bottom:70px}",
    "#es-consent{bottom:70px}",
    ".footer-signature{padding-bottom:72px}",
    "}"
  ].join("");
  document.head.appendChild(st);

  function build() {
    if (document.getElementById("mobile-cta")) return;
    var nav = document.createElement("nav");
    nav.id = "mobile-cta";
    nav.setAttribute("aria-label", "Hızlı işlemler");
    nav.innerHTML =
      '<a href="tel:' + CONFIG.phone + '" data-cta="call">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="s" d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1l-2.2 2.2z"/></svg>' +
        "Ara</a>" +
      '<a href="' + wa + '" target="_blank" rel="noopener" data-cta="whatsapp">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="f" d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm4.5 13.91c-.25.7-1.44 1.34-1.98 1.4-.53.06-1.03.29-3.48-.72-2.94-1.2-4.83-4.19-4.98-4.39-.15-.2-1.2-1.6-1.2-3.05 0-1.44.75-2.15 1.02-2.44.27-.29.58-.36.78-.36l.56.01c.18 0 .42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.72-.18 1.42z"/></svg>' +
        "WhatsApp</a>" +
      '<a href="' + dir + '" target="_blank" rel="noopener" data-cta="directions">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="s" d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle class="s" cx="12" cy="10" r="2.4"/></svg>' +
        "Yol Tarifi</a>";
    document.body.appendChild(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
