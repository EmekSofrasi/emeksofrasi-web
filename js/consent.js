/* ==========================================================================
   Emek Sofrası — Çerez onayı + izne bağlı takip (Meta Pixel / Google Analytics)
   --------------------------------------------------------------------------
   KVKK: analitik ve pazarlama çerezleri YALNIZCA izin verilince yüklenir.
   Zorunlu çerezler (site işlevi + bu tercihin hatırlanması) her zaman çalışır,
   onay gerektirmez.

   Kullanıcı tercihi localStorage'da JSON olarak tutulur:
     es_cookie_consent = {"analytics":true|false,"marketing":true|false}
   Eski ikili format ("accepted" / "rejected") geriye dönük okunur ve
   otomatik yeni formata çevrilir.

   Tercihler sonradan değiştirilebilir: window.esOpenConsentPreferences()
   (çerez politikası sayfasında "Tercihlerimi Yönet" bağlantısı bunu çağırır).

   YENİ KİMLİK geldiğinde SADECE aşağıdaki CONFIG doldurulur, gerisi aynı kalır.
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = {
    pixelId: "1627919535723501",   /* Meta Pixel ID */
    gaId: "G-1KFMR5JS1X"           /* GA4 Ölçüm Kimliği */
  };

  var KEY = "es_cookie_consent";
  var POLICY_URL = "cerez-politikasi.html";

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      if (raw === "accepted") return { analytics: true, marketing: true };
      if (raw === "rejected") return { analytics: false, marketing: false };
      var parsed = JSON.parse(raw);
      if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") return parsed;
      return null;
    } catch (e) { return null; }
  }
  function set(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  /* ---------- Meta Pixel ---------- */
  function loadPixel() {
    if (!CONFIG.pixelId || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CONFIG.pixelId);
    window.fbq("track", "PageView");
  }

  /* ---------- Google Analytics 4 ---------- */
  function loadGA() {
    if (!CONFIG.gaId || window.gtag) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaId);
  }

  function applyPrefs(prefs) {
    if (prefs.analytics) loadGA();
    if (prefs.marketing) loadPixel();
  }

  /* ---------- Onay bandı ---------- */
  function injectStyles() {
    if (document.getElementById("es-consent-style")) return;
    var st = document.createElement("style");
    st.id = "es-consent-style";
    st.textContent = [
      /* Krem zemin + koyu yeşil metin + yeşil buton — sayfanın koyu yeşil
         footer'ında göze çarpsın diye zıt renk (Emel geri bildirimi 2026-09-10). */
      '#es-consent{position:fixed;left:18px;bottom:18px;z-index:2147483000;',
      'width:min(410px,calc(100vw - 36px));background:#fdf9ef;color:#1f3d2a;',
      'border:1px solid #04210f;border-radius:14px;',
      'box-shadow:0 16px 44px rgba(0,0,0,.4);padding:18px 18px 16px;',
      'font-family:"Mulish",system-ui,sans-serif;font-size:.9rem;line-height:1.5;',
      'max-height:80vh;overflow-y:auto;animation:es-consent-in .35s ease both}',
      '@keyframes es-consent-in{from{opacity:0;transform:translateY(14px)}}',
      '#es-consent p{margin:0 0 12px}',
      '#es-consent a{color:#1c5d48;font-weight:700}',
      '#es-consent .es-consent-row{display:flex;gap:10px;flex-wrap:wrap}',
      '#es-consent button{flex:1 1 118px;cursor:pointer;font-family:inherit;',
      'font-weight:800;font-size:.82rem;border-radius:9px;padding:11px 10px;',
      'border:1px solid transparent;transition:transform .15s ease}',
      '#es-consent button:hover{transform:translateY(-1px)}',
      '#es-consent .es-consent-accept{background:#04210f;color:#fdf9ef}',
      '#es-consent .es-consent-reject,#es-consent .es-consent-manage-btn{',
      'background:transparent;color:#04210f;border-color:#04210f}',
      '#es-consent button:focus-visible{outline:3px solid #04210f;outline-offset:2px}',
      '#es-consent .es-consent-manage{display:none}',
      '#es-consent.es-managing .es-consent-main{display:none}',
      '#es-consent.es-managing .es-consent-manage{display:block}',
      '#es-consent .es-toggle{display:flex;align-items:flex-start;gap:10px;',
      'margin:0 0 12px;cursor:pointer}',
      '#es-consent .es-toggle input{margin-top:3px;width:17px;height:17px;flex-shrink:0;',
      'accent-color:#04210f;cursor:pointer}',
      '#es-consent .es-toggle span{display:block}',
      '#es-consent .es-toggle strong{display:block;font-weight:800}',
      '#es-consent .es-toggle small{display:block;opacity:.75;font-size:.8rem}',
      '#es-consent .es-toggle.es-toggle-locked{opacity:.6}',
      '@media (max-width:480px){#es-consent{left:12px;right:12px;bottom:12px;width:auto}}',
      '@media (prefers-reduced-motion:reduce){#es-consent{animation:none}}',
      /* onay kutusu açıkken sohbet balonunu gizle (üst üste binmesin) */
      'html.es-consent-open .es-chat{display:none!important}'
    ].join("");
    document.head.appendChild(st);
  }

  function showBanner(initialManage) {
    var existing = document.getElementById("es-consent");
    if (existing) {
      if (initialManage) existing.classList.add("es-managing");
      return;
    }
    injectStyles();
    var current = get() || { analytics: false, marketing: false };

    var box = document.createElement("div");
    box.id = "es-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Çerez tercihi");
    box.innerHTML =
      '<div class="es-consent-main">' +
        '<p>Bu sitede zorunlu çerezlerin yanı sıra, izninize bağlı olarak analitik ' +
        '(Google Analytics) ve pazarlama (Meta Pixel) çerezleri kullanıyoruz. ' +
        'Ayrıntılar için <a href="' + POLICY_URL + '">Çerez Politikası</a>.</p>' +
        '<div class="es-consent-row">' +
          '<button type="button" class="es-consent-accept">Kabul Et</button>' +
          '<button type="button" class="es-consent-reject">Reddet</button>' +
          '<button type="button" class="es-consent-manage-btn">Tercihlerimi Yönet</button>' +
        '</div>' +
      '</div>' +
      '<div class="es-consent-manage">' +
        '<label class="es-toggle es-toggle-locked">' +
          '<input type="checkbox" checked disabled>' +
          '<span><strong>Zorunlu çerezler</strong><small>Sitenin çalışması ve bu tercihin hatırlanması için gereklidir, kapatılamaz.</small></span>' +
        '</label>' +
        '<label class="es-toggle">' +
          '<input type="checkbox" class="es-c-analytics">' +
          '<span><strong>Analitik çerezler</strong><small>Google Analytics — ziyaret istatistikleri.</small></span>' +
        '</label>' +
        '<label class="es-toggle">' +
          '<input type="checkbox" class="es-c-marketing">' +
          '<span><strong>Pazarlama çerezleri</strong><small>Meta Pixel — reklam ölçümü.</small></span>' +
        '</label>' +
        '<div class="es-consent-row">' +
          '<button type="button" class="es-consent-save">Tercihlerimi Kaydet</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);
    document.documentElement.classList.add("es-consent-open");

    box.querySelector(".es-c-analytics").checked = !!current.analytics;
    box.querySelector(".es-c-marketing").checked = !!current.marketing;
    if (initialManage) box.classList.add("es-managing");

    function close() {
      box.remove();
      document.documentElement.classList.remove("es-consent-open");
    }
    box.querySelector(".es-consent-accept").addEventListener("click", function () {
      var prefs = { analytics: true, marketing: true };
      set(prefs); close(); applyPrefs(prefs);
    });
    box.querySelector(".es-consent-reject").addEventListener("click", function () {
      var prefs = { analytics: false, marketing: false };
      set(prefs); close();
    });
    box.querySelector(".es-consent-manage-btn").addEventListener("click", function () {
      box.classList.add("es-managing");
    });
    box.querySelector(".es-consent-save").addEventListener("click", function () {
      var prefs = {
        analytics: box.querySelector(".es-c-analytics").checked,
        marketing: box.querySelector(".es-c-marketing").checked
      };
      set(prefs); close(); applyPrefs(prefs);
    });
  }

  /* Çerez politikası sayfasından veya başka bir yerden tercihleri yeniden açmak için */
  window.esOpenConsentPreferences = function () { showBanner(true); };

  var state = get();
  if (state) {
    applyPrefs(state);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { showBanner(false); });
    } else {
      showBanner(false);
    }
  }
})();
