/* ==========================================================================
   Emek Sofrası — Menü sayfası
   - Kapalı kitap (kapak) → tıkla → AÇIK kitap (KARUSEL)
   - Menü SAYISI SABİT DEĞİL — menu-data.js'teki "menuler" dizisinin
     uzunluğuna göre otomatik sayfalanır (2 menü = 1 kitap sayfası).
   - MASAÜSTÜ: her karusel ekranında İKİ kitap sayfası yan yana (açık kitap),
     her sayfada 2'şer menü + Yan Ürünler; menü sayısı tek ise son sayfa tek
     (geniş) gösterilir. En sonda Pazar mesajları/"kapalıyız" ekranı.
   - MOBİL: ekran dar → her karusel ekranında TEK kitap sayfası (2 menü),
     ardından Pazar (kapalı).
   - Ok · nokta · dokunmatik kaydırma · otomatik geçiş (ana sayfa hero gibi)
   - HER HAFTA sadece js/menu-data.js güncellenir (menu-guncelle.html paneli).
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.MENU_DATA || {};
  var menuler = (DATA.menuler || []).slice();

  var closed  = document.querySelector("[data-menu-closed]");
  var open    = document.querySelector("[data-menu-open]");
  var trigger = document.querySelector("[data-menu-trigger]");
  var book    = document.querySelector("[data-menu-book]");
  var weekEl  = document.querySelector("[data-menu-week]");

  if (!open || !book || !menuler.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileMq = window.matchMedia("(max-width: 780px)");
  var built = false;

  if (weekEl && DATA.hafta) weekEl.textContent = DATA.hafta;

  /* Supabase tanımlıysa güncel menüyü oradan al; olmazsa menu-data.js geçerli kalır */
  var CFG = window.MENU_CONFIG || {};
  if (CFG.supabaseUrl && CFG.supabaseKey && window.fetch) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var abortTimer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 5000);
    fetch(CFG.supabaseUrl + "/rest/v1/menu?id=eq.1&select=data", {
      headers: { apikey: CFG.supabaseKey, Authorization: "Bearer " + CFG.supabaseKey },
      cache: "no-store",
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (rows) {
        clearTimeout(abortTimer);
        var d = rows && rows[0] && rows[0].data;
        if (!d || !d.menuler || !d.menuler.length) return;
        DATA = Object.assign({}, DATA, d);
        menuler = d.menuler.slice();
        if (weekEl && DATA.hafta) weekEl.textContent = DATA.hafta;
        if (built && !open.hidden) build();
      })
      .catch(function () {});
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function items(list) {
    return (list || []).filter(Boolean).map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("");
  }
  function card(m) {
    return '<article class="menu-card">' +
      '<h3 class="menu-card__no">Menü ' + esc(m.no) + "</h3>" +
      "<ul>" + items(m.kalemler) + "</ul>" +
      "</article>";
  }
  function pageEl(inner, cls) {
    return '<div class="menu-page' + (cls ? " " + cls : "") + '">' + inner + "</div>";
  }
  function slideEl(pagesHtml, cls) {
    return '<div class="menu-slide' + (cls ? " " + cls : "") + '">' + pagesHtml + "</div>";
  }

  /* Kitap sayfası içerikleri — her menü sayfasının altında Yan Ürünler */
  function yanUrunler() {
    if (!DATA.yanUrunler || !DATA.yanUrunler.length) return "";
    return '<div class="menu-extra"><h3>Yan Ürünler</h3><ul>' + items(DATA.yanUrunler) + "</ul></div>";
  }
  /* 2 menüyü bir kitap sayfasında grupla — menü sayısı ne olursa olsun */
  function pages() {
    var yu = yanUrunler();
    var groups = [];
    for (var i = 0; i < menuler.length; i += 2) {
      groups.push(card(menuler[i]) + (menuler[i + 1] ? card(menuler[i + 1]) : "") + yu);
    }
    return groups;
  }
  function sundayLeft() {
    var p = DATA.pazar || {};
    var wishes = (p.mesajlar || []).map(function (m) { return "<p>" + esc(m.metin) + "</p>"; }).join("");
    return '<h3 class="menu-sunday__title">' + esc(p.baslik || "Pazar") + "</h3>" +
      (wishes ? '<div class="menu-sunday__wishes">' + wishes + "</div>" : "");
  }
  function sundayRight() {
    var p = DATA.pazar || {};
    return (p.gorsel ? '<img class="menu-sunday__img" src="' + esc(p.gorsel) + '" alt="Emek Sofrası — Pazar günü kapalı" loading="lazy">' : "") +
      '<p class="menu-page__closed">' + esc(p.kapanis || "Pazar günleri kapalıyız.") + "</p>";
  }

  function build() {
    var mobile = mobileMq.matches;
    var pg = pages();
    var slides;

    if (mobile) {
      slides = pg.map(function (html) { return slideEl(pageEl(html)); });
      slides.push(slideEl(pageEl(sundayRight(), "menu-page--sunday"), "menu-slide--sunday"));
    } else {
      slides = [];
      for (var i = 0; i < pg.length; i += 2) {
        if (pg[i + 1] !== undefined) {
          slides.push(slideEl(pageEl(pg[i], "menu-page--l") + pageEl(pg[i + 1], "menu-page--r")));
        } else {
          slides.push(slideEl(pageEl(pg[i], "menu-page--l"), "menu-slide--solo"));
        }
      }
      slides.push(slideEl(
        pageEl(sundayLeft(), "menu-page--l menu-page--sunday") +
        pageEl(sundayRight(), "menu-page--r menu-page--sunday"),
        "menu-slide--sunday"
      ));
    }

    book.innerHTML =
      '<div class="menu-carousel' + (mobile ? " menu-carousel--single" : " menu-carousel--spread") + '" data-menu-carousel>' +
        '<button type="button" class="menu-carousel__arrow menu-carousel__arrow--prev" data-menu-prev aria-label="Önceki sayfa">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-8 7 8 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        '<div class="menu-carousel__viewport">' +
          '<div class="menu-carousel__track" data-menu-track>' + slides.join("") + "</div>" +
        "</div>" +
        '<button type="button" class="menu-carousel__arrow menu-carousel__arrow--next" data-menu-next aria-label="Sonraki sayfa">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        '<div class="menu-carousel__dots" data-menu-dots aria-label="Menü sayfaları"></div>' +
      "</div>";

    built = true;
    initCarousel();
  }

  function initCarousel() {
    var track  = book.querySelector("[data-menu-track]");
    var slides = Array.prototype.slice.call(track.children);
    var prev   = book.querySelector("[data-menu-prev]");
    var next   = book.querySelector("[data-menu-next]");
    var dotsW  = book.querySelector("[data-menu-dots]");
    if (!track || slides.length < 2) return;

    var index = 0;
    var timer = null;
    var interval = 6500;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", (i + 1) + ". sayfa");
      b.addEventListener("click", function () { go(i); restart(); });
      dotsW.appendChild(b);
      return b;
    });

    function render() {
      track.style.transform = "translateX(-" + (index * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    function go(i) { index = (i + slides.length) % slides.length; render(); }
    function start() { if (reduce || timer) return; timer = setInterval(function () { go(index + 1); }, interval); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

    var carousel = book.querySelector("[data-menu-carousel]");
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); restart(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); go(index - 1); restart(); }
    });

    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      x0 = null; start();
    }, { passive: true });

    render();
    start();
  }

  /* Masaüstü ↔ mobil geçişinde kitap açıksa yeniden kur */
  var mqHandler = function () { if (built && !open.hidden) build(); };
  if (mobileMq.addEventListener) mobileMq.addEventListener("change", mqHandler);
  else if (mobileMq.addListener) mobileMq.addListener(mqHandler);

  function openBook() {
    build();
    if (closed) {
      closed.classList.add("is-opening");
      var reveal = function () {
        closed.hidden = true;
        open.hidden = false;
        var sec = document.querySelector(".menu-section");
        if (sec) {
          var top = sec.getBoundingClientRect().top;
          if (top < -20 || top > window.innerHeight * 0.5) {
            sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          }
        }
      };
      if (reduce) reveal(); else setTimeout(reveal, 500);
    } else {
      open.hidden = false;
    }
  }

  if (trigger) {
    trigger.addEventListener("click", openBook);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBook(); }
    });
  }
  if (!closed) { build(); open.hidden = false; }
})();
