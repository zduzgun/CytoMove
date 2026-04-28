# AGENT_BRIEF.md — Cytomove Operasyonel Hafıza
<!-- Her oturuma bu dosyayı okuyarak başla. README.md ve ROADMAP.md ile birlikte kullan. -->

**Son güncelleme:** 2026-04-28  
**Versiyon:** 0.4

---

## Standart Başlangıç Rutini

Yeni oturumda şu sırayla ilerle:

1. `git status` — yerel değişiklik var mı kontrol et
2. Bu dosyayı oku (`AGENT_BRIEF.md`) — operasyonel durum
3. `ROADMAP.md` — stratejik plan (büyük karar gerekiyorsa)
4. `README.md` — public proje özeti (metin/tanıtım işi varsa)
5. `index.html` — sadece landing page kodu değişecekse
6. `docs/validation-protocol.md` — validation/MVP işi varsa
7. Kullanıcıya sor: *"Son oturumdan bu yana değişen bir şey var mı?"*

**⚠️ Asla:** `github_token.txt` veya herhangi bir token içeren dosyayı stage/commit etme.
**⚠️ Asla:** `wound healing/` klasöründeki ham görüntüleri git'e commit etme. Boyut + olası yayın hakkı sorunları.

---

## Proje Özeti

**Cytomove** — tarayıcıda çalışan, gizlilik odaklı scratch assay (wound healing) analiz aracı.  
Hedef kullanıcı: hücre biyolojisi araştırmacıları.  
Anahtar fark: assay görüntüleri sunucuya gönderilmez, analiz tamamen client-side çalışır.

- **Web:** [cytomove.com](https://cytomove.com) / [cytomove.pages.dev](https://cytomove.pages.dev)
- **GitHub:** [github.com/zduzgun/CytoMove](https://github.com/zduzgun/CytoMove)
- **Deploy:** Cloudflare Pages (static HTML, GitHub entegrasyonu ile otomatik)
- **Waitlist:** Formspree `mdayrwqe` → zekeriya.duzgun@giresun.edu.tr

---

## Marka Notu ⚠️

**CellVerse şu an aktif marka değil.** Üst marka kararı Faz 5'e ertelendi.  
Tüm mevcut repo, domain ve dış iletişim dili **Cytomove** kullanır.  
Başka ajan veya belgelere CellVerse anlatısını geri sokma.

---

## Source of Truth

| Kaynak | Ne için |
|--------|---------|
| `ROADMAP.md` | Stratejik gerçek, faz planı, başarı kriterleri |
| `README.md` | Kamuya açık proje özeti (GitHub ana sayfası) |
| `index.html` | Canlı landing page kodu |
| `AGENT_BRIEF.md` | Operasyonel hafıza (bu dosya) |

---

## Mevcut Faz

**Faz 1 — Minimum Credible Landing tamamlandı** (`de45c32`; marka/sosyal/blog işleri beta launch hazırlığına ertelendi)

**Faz 2 — Validation iş kolu başladı (2026-04-28)**  
Validation veri seti planlaması yapıldı, protokol v0.1 yazıldı, mevcut laboratuvar arşivi (442 görüntü) keşfedildi.
Segmentasyon kodu henüz başlamadı; önce validation set'in CSV'ye aktarılması bekleniyor.
Başarı kriterleri: Pearson r > 0.9, <10% wound area error, 70%+ kullanıcı kabul oranı.

---

## Canlı Durum (2026-04-28 itibarıyla)

- ✅ Cloudflare Pages deploy aktif
- ✅ cytomove.com custom domain (propagasyon tamamlandı)
- ✅ Light tema landing page yayında (iki sütun hero, ürün kartı, mobil taşma kontrol edildi)
- ✅ Canvas wound healing animasyonu çalışıyor
- ✅ Formspree waitlist çalışıyor (inbox'a geliyor, spam değil)
- ✅ GitHub repo public: `github.com/zduzgun/CytoMove`
- ✅ `og:image` / `twitter:image` sosyal önizleme görseli eklendi (`assets/og-image.png`)
- ✅ Scientific trust layer eklendi: cell biologist, browser-local assay images, validation in progress

---

## Son Commitler

- `de45c32` Landing page trust layer, OG image ve mobil responsive düzeltmeleri
- `94f00df` README dosyası Cytomove odağına taşındı
- `3ea021a` ROADMAP kesilen son bölümü tamamlandı
- `2d85f03` Landing page bilimsel ürün tasarımına taşındı
- `e3cb468` Canlı sayfada kesilen JS sonu tamamlandı
- `77f4d93` Canvas animasyonu IIFE yapısına alındı, görsel güçlendirildi

---

## Aktif Dosyalar

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `index.html` | Canlı ✅ | Light theme, iki sütun hero, canvas animasyonu, trust layer, OG meta |
| `ROADMAP.md` | v0.4 ✅ | 18 aylık 5 fazlı plan |
| `README.md` | ✅ | GitHub ana sayfası |
| `AGENT_BRIEF.md` | v0.4 ✅ | Bu dosya |
| `docs/validation-protocol.md` | v0.1 ✅ | Preprint Methods bölümüne taşınacak IMRAD protokol; İngilizce; 11 bölüm; 5 TBD açık madde |
| `assets/og-image.png` | Canlı ✅ | Sosyal medya link önizleme görseli |

---

## Tasarım Dili

- **Ton:** Hafif akademik SaaS — ne karanlık startup, ne de klinikal soğuk.
- **Renkler:** `--bg: #f7faf9`, `--paper: #ffffff`, `--teal: #0f9f8f`
- **Canvas animasyonu:** IIFE yapısı, `BG = '#f8fbfa'`, `prefers-reduced-motion` desteği var.
- **İddia dili dikkat:** "Tüm veriler local" → sadece assay görüntüleri için doğru (waitlist email Formspree'ye gider).
- **ImageJ referansı:** "Replacement" deme, "alternative" de.
- **Landing claim dili:** MVP/validation tamamlanmadan `% closure`, "publication-ready" ve mutlak doğruluk iddialarını hero/meta dilinde kullanma; "scratch assay measurements", "figure-ready exports", "validation in progress" tonu korunur.
- **Sosyal önizleme:** `assets/og-image.png` kullanılıyor; SVG yerine PNG tercih edildi.

---

## Son Alınan Kararlar

| Karar | Gerekçe |
|-------|---------|
| Closure rate metriği yok (henüz) | MVP olmadan closure rate iddiası erken |
| Zenodo DOI versiyon başına, analiz başına değil | Mevcut pratikle uyumlu |
| Institution tier şimdilik yok | Faz 5'e ertelendi |
| Pricing: Free / Researcher $9 / Lab $29 | Akademik pazara uygun |
| Validation dataset lisansı: CC BY 4.0 | Açık bilim ilkesiyle uyumlu |
| CellVerse üst marka kararı ertelendi | Faz 5'e — şimdi sadece Cytomove |
| Landing page dili: sadece İngilizce (2026-04-28) | Akademik global kitle; casual area değil |
| Marka tonu: akademik (2026-04-28) | Klinik/kurumsal değil, ama startup oyunculuğu da değil |
| Faz 2 başlangıç stratejisi: validation set önce (2026-04-28) | Set olmadan Pearson r > 0.9 iddiası kurulamaz; algoritma yanlış dağılıma optimize edilme riski |
| Validation protokolü İngilizce yazıldı (2026-04-28) | bioRxiv preprint Methods bölümüne çeviri sürtüşmesi olmadan taşınacak |
| Tier 1 birincil kaynak: Düzgün lab arşivi (2026-04-28) | 442 görüntü keşfedildi; n = 50 hedefi katlanarak aşılıyor |
| Faz 1 kapanış tanımı: Minimum Credible Landing (2026-04-28) | OG image + scientific trust layer + temkinli claim dili tamamlandı; logo/sosyal/blog beta launch hazırlığına bırakıldı |

---

## Bilinen Sorunlar / Eksikler ⚠️

- Logo / marka kimliği henüz yok (beta launch hazırlığına ertelendi)
- Ürün kodu henüz public değil (private geliştirme)
- Gerçek MVP (segmentasyon algoritması) henüz başlamadı

---

## Yapılmayacaklar ⛔

- **GitHub token'ı asla dosyaya veya koda yazma.** Git history'e düşerse hemen revoke et.
- CellVerse markasını aktif marka olarak kullanma — Faz 5'ten önce karar verilmez.
- Institution pricing tier'ını Faz 5'ten önce ekleme.
- "Tüm verileriniz lokal" gibi kapsamlı gizlilik iddiası yapma.
- Closure rate'i MVP olmadan landing page'e koyma.
- Cloudflare Worker oluşturma — Pages kullanılıyor (statik HTML deploy).
- `index.html`'i dark tema'ya çevirme.

---

## Bekleyen Görevler

### Faz 1 — Tamamlanmamış Kalanlar
- [x] `og:image` meta tag ekle (`assets/og-image.png`)
- [x] Landing page'e scientific trust layer ekle
- [ ] Logo / marka kimliği oluştur (beta launch hazırlığı)
- [ ] Twitter/X ve LinkedIn hesabı aç (beta launch hazırlığı)
- [ ] İlk blog yazısı: "Why wound healing analysis needs a browser-native tool" (beta launch hazırlığı)

### Faz 2 — Validation İş Kolu (Devam Ediyor)
- [x] Validation protokolü v0.1 yazıldı (`docs/validation-protocol.md`)
- [x] Mevcut laboratuvar arşivi keşfedildi (`wound healing/` — 442 görüntü)
- [ ] **3 kritik soru cevaplanmalı** (sonraki oturum için):
  1. `wound healing/29.06.22/COMBİNE/` görüntüleri Molecules 2022, 27, 635 makalesinde mi yayımlandı? Yayıncı CC BY 4.0 verir mi?
  2. `H` = HUVEC, `M` = MDA-MB-231 doğrulansın
  3. `LC` koşul kısaltması ne anlama geliyor (K, 8F, 64F, CİS, LUT açık)
- [ ] Protokoldeki 5 "TBD — Düzgün lab" maddesi doldurulmalı (hücre hatları, mikroskoplar, ikinci rater, yayın geçmişi)
- [ ] Önerilen 3 işlem (kullanıcı onayı bekliyor):
  - (a) 442 görüntüyü tarayan envanter scripti → `validation-set-metadata.csv`
  - (b) `COMBİNE/*.xlsx` ölçümlerini görüntü dosyalarıyla otomatik eşleştir; kaç görüntü için ground-truth tam belirle
  - (c) Klasör başına 1-2 örnek görüntüyü görsel olarak inceleyip scratch kalitesi/kontrast varyasyonunu raporla
- [ ] Üçüncü hücre hattı kararı (HeLa / A549 / başka) — generalizability için
- [ ] Gerçek mikroskop kamerası ile çekilmiş bir referans set (telefon-okül dışı)
- [ ] Client-side segmentasyon algoritması prototip (validation set CSV'ye girdikten sonra)
- [ ] Manuel düzeltme arayüzü tasarımı

### Validation Veri Seti — Mevcut Arşiv Özeti (2026-04-28)

`wound healing/` klasöründe iki kampanya:

**Kampanya 1 — `fdi/HUVEC/` (Aralık 2021)**
- 99 görüntü, HUVEC, FDI bileşiği vs kontrol, 0h/24h/48h
- 4032×3024 px, Samsung Galaxy telefon (mikroskop oküleri üzerinden)

**Kampanya 2 — `29.06.22/` (Haziran 2022)**
- 343 görüntü, HUVEC (`H-`) + MDA-MB-231 (`M-` varsayım), 6 koşul (K, 8F, 64F, CİS, LUT, LC)
- 1574×2100 px, iPhone (mikroskop oküleri üzerinden)
- `COMBİNE/` alt klasöründe 71 küratörlenmiş çoklu-zaman görüntü
- **Ground truth mevcut:** 4 xlsx dosyası, MRI Wound Healing Tool macro çıktısı (`Area pixels²`, `Width pixels`, `SD pixels`, `Wound Closure %`)
- Dosyalar Temmuz 2022 tarihli; `Supplementary_Data.pdf` + `Grafikler.pptx` + Molecules 2022 referansı yayımlanmış makaleyi düşündürüyor

**Çeşitlilik değerlendirmesi:**
- Hücre tipi: 2 hat (3 hedef) — bir tane daha eklemek gerek
- Görüntüleme modu: tek mod (telefon-okül brightfield) — hedef kullanıcı kitlesiyle hizalı, ama formal mikroskop set'i de eklenmeli
- Büyütme: tek (bilgisi yok)
- Hacim: ROADMAP'teki n=50 hedefini fazlasıyla karşılıyor

**Kritik uyarı:** Yayımlanmış makaleye ait görüntülerse redistribution hakkı yayıncıya geçmiş olabilir. CC BY 4.0 altında Zenodo deposit'ten önce yayıncı politikası kontrol edilmeli (MDPI tipik olarak CC BY 4.0).

---

## Teknik Notlar

### Git / GitHub
- Repo: `https://github.com/zduzgun/CytoMove`
- Branch: `main`
- Deploy: Cloudflare Pages otomatik (main push → deploy ~1 dk)
- PAT izinleri: Contents read/write + Metadata read-only (fine-grained)

### Cloudflare Pages
- Proje adı: `cytomove` → cytomove.pages.dev + cytomove.com
- Build komutu: `echo done` (statik HTML, build gerekmez)
- Output directory: `/` (root)

### Canvas Animasyonu
```javascript
// IIFE yapısı — bu şekilde kalsın
(function () {
  var canvas = document.getElementById('woundCanvas');
  var ctx = canvas.getContext('2d');
  var W = 580, H = 170;
  var BG = '#f8fbfa';  // Light theme bg — CSS'e bağlama, JS'de tut
  // ROWS=4, COLS=9, SP=27, CYCLE=340
  // prefers-reduced-motion: running=false, tek kare çiz
  // requestAnimationFrame loop
}());
```
Siyah görünüyorsa: `BG` değişkenini kontrol et, `ctx.fillRect` ile açıkça background çizildiğinden emin ol.

### Formspree
- Form ID: `mdayrwqe`
- Action: `https://formspree.io/f/mdayrwqe`
- Kendi emailin ile test gönderimi spam kutusuna düşebilir — normal.

---

## Kurucu

Dr. Zekeriya Düzgün — Giresun Üniversitesi Tıp Fakültesi, Tıbbi Biyoloji ABD  
zekeriya.duzgun@giresun.edu.tr
