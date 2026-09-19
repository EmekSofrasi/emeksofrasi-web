/* ==========================================================================
   EMEK SOFRASI — HAFTALIK MENÜ VERİSİ
   --------------------------------------------------------------------------
   HER HAFTA SADECE BU DOSYA GÜNCELLENİR:
   1) "hafta" alanına tarih aralığını yaz.
   2) "menuler" dizisindeki 8 menünün "kalemler" listelerini o haftaya göre
      güncelle. Sıra önemli: liste ekranda aynı sırayla görünür.
   3) Gerekirse "yanUrunler" listesini güncelle.

   KURALLAR
   - Sitede FİYAT gösterilmez.
   - 8 sabit menü (Menü 1–8). Gün kavramı yok.
   - Pazar günü işletme kapalıdır; menü yerine karşılama mesajları gösterilir.
   ========================================================================== */

window.MENU_DATA = {
  hafta: "21 – 27 Eylül",

  /* 8 menü — açık kitapta: sol sayfa 1-2 / 5-6, sağ sayfa 3-4 / 7-8
     Menü 7-8 + Yan Ürünler HER HAFTA SABİT (kullanıcı kuralı 2026-09-11) */
  menuler: [
    { no: 1, kalemler: ["Günün Çorbası", "Tavuklu Pilav", "Mevsim Salata", "Meşrubat"] },
    { no: 2, kalemler: ["Günün Çorbası", "Pilav", "Patates Püreli Et Sote", "Meşrubat"] },
    { no: 3, kalemler: ["Günün Çorbası", "Makarna", "Taze Fasulye", "Meşrubat"] },
    { no: 4, kalemler: ["Günün Çorbası", "Pilav", "Karnıyarık", "Meşrubat"] },
    { no: 5, kalemler: ["Günün Çorbası", "Pilav", "Köri Soslu Tavuk", "Meşrubat"] },
    { no: 6, kalemler: ["Günün Çorbası", "Pilav", "Ispanaklı Piliç Prenses", "Meşrubat"] },
    { no: 7, kalemler: ["Günün Çorbası", "Pilav", "Kekikli Izgara Tavuk", "Meşrubat"] },
    { no: 8, kalemler: ["Günün Çorbası", "Pilav", "Izgara Köfte", "Meşrubat"] }
  ],

  yanUrunler: ["Cacık", "Buharda Pişmiş Sebzeler"],

  /* Pazar — restoran kapalı */
  pazar: {
    baslik: "Pazar",
    mesajlar: [
      { baslik: "Günün Dileği", metin: "Güzel bir pazar geçirin." },
      { baslik: "Günün Tadı", metin: "Sevdiklerinizle keyfini çıkarın." },
      { baslik: "Haftanın Daveti", metin: "Yeni haftada soframıza bekleriz." }
    ],
    kapanis: "Pazar günleri kapalıyız.",
    gorsel: "images/menu/pazar-gorseli.png"
  },

  not: "Menülerimiz haftalık olarak değişiklik gösterebilir."
};
