# AGENT_BRIEF.md — Cytomove Operasyonel Hafıza
<!-- Her oturuma bu dosyayı okuyarak başla. README.md ve ROADMAP.md ile birlikte kullan. -->

**Son güncelleme:** 2026-05-04
**Versiyon:** 1.1

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

**Faz 2 — MVP + Validation iş kolu aktif (2026-05-04)**  
Validation protokolü v0.4 yönüne taşındı: sentetik binary mask doğrulaması, sentetik microscopy-like robustness ve gerçek görüntü validasyonu üç katmanlı yürür. Prototip artık `prototype-whst-variance-v0.4` seviyesinde: browser-only segmentasyon, group review, custom local group, manual brush correction, width profile metrikleri, QC uyarıları ve CSV/Excel export bulunur.
Başarı kriterleri korunur: Pearson r > 0.9, <10% wound area error, 70%+ kullanıcı kabul oranı; ancak width mean/median ve QC/recommended-primary-metric artık area ile birlikte birinci sınıf çıktıdır.

---

## Canlı Durum (2026-04-29 itibarıyla)

- ✅ Cloudflare Pages deploy aktif
- ✅ cytomove.com custom domain (propagasyon tamamlandı)
- ✅ Light tema landing page yayında (iki sütun hero, ürün kartı, mobil taşma kontrol edildi)
- ✅ Canvas wound healing animasyonu çalışıyor
- ✅ Formspree waitlist çalışıyor (inbox'a geliyor, spam değil)
- ✅ GitHub repo public: `github.com/zduzgun/CytoMove`
- ✅ Scientific trust layer eklendi: cell biologist, browser-local assay images, validation in progress
- 🔄 `prototype/index.html` tam yeniden yazımı devam ediyor (2026-04-29)

### 2026-05-01 Resolution / Export Karari

- UI ve auto-calibration hizli kalmasi icin ileride optimize edilmis working-resolution kullanilacak.
- Final PNG/CSV export sirasinda ayni ayarlar original full-resolution goruntuye yeniden uygulanacak.
- CSV/report alanlari: `working_resolution_px`, `export_resolution_px`, `resolution_scale`, `metrics_computed_at`.
- Parametre olcekleme notu: `varianceRadius` lineer scale, `minComponent` area scale (`scale^2`), `thresholdOffset` ve `fovCutoff` olceklenmez.
- Urun davranisi: preview hizli olabilir ama bilimsel cikti full-resolution olmalidir.

---

## 2026-04-30 Oturum Güncellemesi

- `docs/literature/tool-comparison-matrix.md` oluşturuldu. TScratch, WHST, PyScratch, CSMA, MRI Wound Healing Tool ve WimScratch konumlandırması sistematik olarak özetlendi.
- PDF kaynakları local olarak `docs/literature/papers/` altında tutuluyor, extracted text `docs/literature/extracted/` altında. İkisi de `.gitignore` içinde; commit edilmemeli.
- `docs/validation-protocol.md` v0.3'e yükseltildi. Comparator önceliği: manual/consensus masks → WHST → TScratch → PyScratch → CSMA → WimScratch.
- v0.3 metrik gerekçesi netleşti: wound area, wound area %, width mean/SD zorunlu; closure % sadece 0h baseline varsa; migration rate sadece time + pixel calibration varsa.
- `prototype/index.html` CSV export'u validation v0.3 şemasına hizalandı: `schema_version`, `cytomove_algorithm_version`, `cytomove_parameter_json`, comparator placeholder'ları, runtime, crop/rotation/deskew alanları.
- Prototype'a dosya açma fix'i eklendi: file input doğrudan ikon içinde native input olarak çalışıyor.
- Prototype'a threshold fallback eklendi: Otsu çok düşükse percentile fallback kullanılıyor; `threshold_fallback_used` CSV/log alanına yazılıyor.
- Prototype'a ince açı düzeltme eklendi: `Fine rotation (deg)` slider/number input, -20° ile +20°, step 0.5°. `deskew_angle_deg` ve `deskew_applied` export ediliyor.
- Orientation/width model update (2026-05-02): blind auto-angle was avoided because it can rotate correct vertical scratches into worse positions. User chooses `Scratch orientation` as vertical or horizontal; horizontal applies a controlled 90-degree transform. Fine rotation remains a manual small-angle visual correction.
- Width inclination correction disabled/removed for now because it confused the user and changed metrics without an obvious visual effect. Width metrics currently use raw horizontal scanline width after the selected scratch orientation/fine rotation.
- Angle ruler overlay added: View section has a `Show angle ruler` toggle. The semi-transparent ruler can be dragged with the mouse as a visual alignment guide. It does not change segmentation or width metrics.
- Prototype'a `Group review` modu eklendi: HK Control, M8F FDI-6 8uM ve MK Control grupları 0h/24h/48h olarak yan yana gösterilir. Kartlarda downsampled kontur preview çizilir; karta tıklanınca ilgili sample üstteki ana analiz canvas'ına yüklenir. Preview ölçüm yerine hızlı review amaçlıdır; ana canvas mevcut full pipeline ile çalışır.
- 2026-05-02 UI simplification update: segmentation `Field mask` select was replaced with user-facing `Microscope mode` buttons (`Phase contrast` / `Brightfield`). `Phase contrast` keeps full rectangular field for dark-background images; `Brightfield` applies cutoff-based field masking for black-border microscope FOVs.
- 2026-05-02 layout update: in `prototype/index.html` single-image canvas (`dropZone`) is kept above `groupView` so left-side controls remain accessible while reviewing group cards.
- 2026-05-02 segmentation stability update: a continuity filter was added after hole-fill/component steps (`enforceWoundContinuity`). It scores connected components by center proximity + axis span + area, and keeps the wound-like continuous component(s) to reduce late time-point drift to side islands.
- 2026-05-02 version bump: `CYTOMOVE_ALGORITHM_VERSION` updated to `prototype-whst-variance-v0.4` (microscope-mode UI + continuity filtering).

---

## Son Commitler

- `de45c32` Landing page trust layer, OG image ve mobil responsive düzeltmeleri
- `94f00df` README dosyası Cytomove odağına taşındı
- `3ea021a` ROADMAP kesilen son bölümü tamamlandı
- `2d85f03` Landing page bilimsel ürün tasarımına taşındı
- `e3cb468` Canlı sayfada kesilen JS sonu tamamlandı
- `77f4d93` Canvas animasyonu IIFE yapısına alındı, görsel güçlendirildi
- *(bekliyor)* `prototype/index.html` tam yeniden yazımı — ImageJ pipeline, drag&drop, export

---

## Aktif Dosyalar

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `index.html` | Canlı ✅ | Light theme, iki sütun hero, canvas animasyonu, trust layer, OG meta |
| `ROADMAP.md` | v0.4 ✅ | 18 aylık 5 fazlı plan |
| `README.md` | ✅ | GitHub ana sayfası |
| `AGENT_BRIEF.md` | v1.0 ✅ | Bu dosya |
| `docs/validation-protocol.md` | v0.3 ✅ | Literatür destekli comparator + metric rationale eklendi; WHST primary comparator; CSV/analysis-log şeması genişledi |
| `docs/validation-dataset-layout.md` | Yeni ✅ | Harici raw dataset yerleşimi: `validation_ref_sets/raw/`; generated outputs: `validation_sets/`; browser TIFF dönüşüm notu |
| `docs/validation-ref-inventory.csv` | Yeni ✅ | WHAD/CAMAD, CSMA ve local phone subset için commit edilebilir metadata envanteri |
| `docs/validation-ref-inventory-summary.md` | Yeni ✅ | First-wave gerçek görüntü sayımı: WHAD/CAMAD 83 TIFF, CSMA 49 JPEG, local phone 9 JPG; RQSA deferred |
| `docs/synthetic-validation.md` | Yeni ✅ | Sentetik validation harness amacı, çıktıları, exact cases ve manuscript evidence planı |
| `docs/literature/tool-comparison-matrix.md` | Yeni ✅ | TScratch, WHST, PyScratch, CSMA, MRI tool, WimScratch karşılaştırması; ürün/validasyon kararları |
| `docs/validation-inventory.csv` | Üretildi ✅ | 442 satır, otomatik metadata; envanter bu dosyada |
| `docs/validation-inventory-summary.md` | Üretildi ✅ | Hücre × koşul × zaman crosstab; coverage assessment |
| `scripts/build_inventory.py` | ✅ | Envanter generator; idempotent, tekrar çalıştırılabilir |
| `scripts/build_ground_truth_sample.py` | ✅ | ImageJ ölçüm planı generator; resolved metadata, max 3/stratum |
| `scripts/build_combine_ground_truth.py` | ✅ | COMBİNE Excel area/width/closure extractor; mapping confidence ayrımı var |
| `scripts/link_area_calibration.py` | ✅ | COMBİNE ground-truth değerlerini area-first calibration set + sampling plan'a bağlar |
| `scripts/synthetic_validation.py` | ✅ | Sentetik binary mask, crop robustness, synthetic time-series ve manuscript panel outputs üretir; çıktılar `validation_sets/synthetic/` altında ignored |
| `scripts/build_validation_ref_inventory.py` | ✅ | Ignored raw validation datasets için lightweight metadata CSV üretir |
| `scripts/convert_tiff_for_browser.ps1` | ✅ | WHAD/CAMAD TIFF dosyalarını browser-ready PNG'ye dönüştürür; default output ignored |
| `docs/visual-sample-review.md` | Üretildi ✅ | 9 representative Tier 1 image için kalite sınıfları + preprocessing notları |
| `docs/ground-truth-sampling-plan.csv` | Üretildi ✅ | ImageJ re-measurement için deterministik 60 imajlık çalışma listesi |
| `docs/ground-truth-sampling-plan-summary.md` | Üretildi ✅ | Örnekleme rol/hücre/koşul/zaman özeti |
| `docs/combine-ground-truth.csv` | Üretildi ✅ | COMBİNE Excel ölçümleri: 9 main-table + 12 aggregate ORT satırı |
| `docs/combine-ground-truth-summary.md` | Üretildi ✅ | Explicit/inferred/aggregate ground-truth kullanım özeti |
| `docs/area-calibration-set.csv` | Üretildi ✅ | 9 one-to-one area calibration satırı; 4 explicit, 5 provisional |
| `docs/area-calibration-trends.csv` | Üretildi ✅ | 12 aggregate ORT trend satırı; per-image validation değil |
| `docs/area-calibration-summary.md` | Üretildi ✅ | Calibration bağlantı özeti; 3 sampling-plan satırı seed edildi |
| `assets/og-image.png` | Canlı ✅ | Sosyal medya link önizleme görseli |
| `prototype/index.html` | 🔄 v0.4 aktif prototype | WHST-aligned browser lab: microscope mode, scratch orientation, manual fine rotation, angle ruler, rectangular crop, group review, custom local groups, manual brush correction, width profile/QC metrics, CSV/Excel/PNG export |

---

## Tasarım Dili

- **Ton:** Hafif akademik SaaS — ne karanlık startup, ne de klinikal soğuk.
- **Renkler:** `--bg: #f7faf9`, `--paper: #ffffff`, `--teal: #0f9f8f`
- **Canvas animasyonu:** IIFE yapısı, `BG = '#f8fbfa'`, `prefers-reduced-motion` desteği var.
- **İddia dili dikkat:** "Tüm veriler local" → sadece assay görüntüleri için doğru (waitlist email Formspree'ye gider).
- **ImageJ referansı:** "Replacement" deme, "alternative" de.
- **Landing claim dili:** MVP/validation tamamlanmadan `% closure`, "publication-ready" ve mutlak doğruluk iddialarını hero/meta dilinde kullanma; "scratch assay measurements", "figure-ready exports", "validation in progress" tonu korunur.
| `assets/og-image.png` | Canlı ✅ | Sosyal medya link önizleme görseli |

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
| Tier 1 görüntülerinin lisansı: CC BY 4.0 onaylandı (2026-04-29) | Mol Divers 2024 yayını CC BY 4.0; Zenodo deposit serbest; H/M hücre hatları + ×10 objektif + MRI macro ground-truth makaleyle uyumlu |

---

## Bilinen Sorunlar / Eksikler ⚠️

- Logo / marka kimliği henüz yok (beta launch hazırlığına ertelendi)
- Ürün kodu henüz public değil (private geliştirme)
- Prototype kodu hızlı ilerledi; `AGENT_BRIEF.md` ve doküman tabloları sık güncellenmeli, aksi halde aktif durum geriden geliyor.
- `Cytomove - Segmentation Lab.pdf`, `_screenshot_*.png`, `find_backup.py` ve `.DS_Store` dosyaları çalışma ağacında görünebilir; commit etmeden önce tek tek değerlendir.
- `github_token.txt` repo kökünde mevcut; asla stage/commit etme.
- Raw validation datasets ve browser-ready dönüşümler ignored klasörlerde kalmalı: `validation_ref_sets/`, `validation_sets/`.

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
| `assets/og-image.png` | Canlı ✅ | Sosyal medya link önizleme görseli |
- [x] Landing page'e scientific trust layer ekle
- [ ] Logo / marka kimliği oluştur (beta launch hazırlığı)
- [ ] Twitter/X ve LinkedIn hesabı aç (beta launch hazırlığı)
- [ ] İlk blog yazısı: "Why wound healing analysis needs a browser-native tool" (beta launch hazırlığı)

### Faz 2 — Validation İş Kolu (Devam Ediyor)
- [x] Validation protokolü v0.1 yazıldı (`docs/validation-protocol.md`)
- [x] Mevcut laboratuvar arşivi keşfedildi (`wound healing/` — 442 görüntü)
- [x] Yayın durumu çözüldü (2026-04-29): Düzgün Z, Korkmaz FD, Akgün E. *Mol Divers* 2024;29(2):1069-1078. DOI: [10.1007/s11030-024-10891-z](https://doi.org/10.1007/s11030-024-10891-z) — **CC BY 4.0** lisansı ile yayımlandı, TÜBİTAK OA fonlu, redistribution serbest.
- [x] H = HUVEC, M = MDA-MB-231 doğrulandı (makalenin Methods bölümü)
- [x] LC = Luteolin + Sisplatin kombinasyonu (2026-04-29 onaylandı). Tüm altı koşul kapalı: K, 8F (FDI-6 8μM), 64F (FDI-6 64μM), CİS (sisplatin), LUT (luteolin), LC (luteolin+sisplatin).
- [x] Mikroskop markası: Olympus (model belirsiz, opsiyonel)
- [ ] Protokolde kalan açık maddeler tamamlanmalı: Olympus model, ikinci rater, unpublished subset için co-author consent
- [x] (a) Envanter scripti yazıldı + çalıştırıldı — 442 satır CSV + crosstab summary üretildi (2026-04-29)
- [x] (b) COMBİNE Excel ölçümleri ayrıntılı parse edildi ve bağlandı — `docs/combine-ground-truth.csv` + `docs/area-calibration-set.csv`; 9 one-to-one satır, 4 explicit label, 5 inferred timepoint, 12 aggregate ORT trend satırı. 60lık sampling plan içinde 3 explicit satır seed edildi. Area ana MVP metriği, width/distance ikinci metrik.
- [x] (c) Örnek görüntü görsel inceleme yapıldı — `docs/visual-sample-review.md`; ana bulgu: circular FOV/handwritten labels preprocessing gerektiriyor, COMBINE crop subset erken prototip için en temiz başlangıç.
- [ ] **Per-image ImageJ ground truth re-measurement** (Düzgün lab tarafı): `docs/ground-truth-sampling-plan.csv` ile 60 imajlık deterministik liste hazır; COMBİNE Excel area/width değerleri seed calibration olarak çıkarıldı, kalan ImageJ ölçümleri hâlâ pending
- [ ] Üçüncü hücre hattı kararı (HeLa / A549 / başka) — generalizability için
- [ ] Gerçek mikroskop kamerası ile çekilmiş bir referans set (telefon-okül dışı)
| `prototype/index.html` | 🔄 v0.4 aktif prototype | ImageJ/WHST-inspired pipeline: variance filter, hole handling, continuity filter, width profile/QC, group review, manual correction, export |
- [x] Manuel düzeltme arayüzü prototipi: brush add/erase/undo/reset var; bilimsel validation ve UX polish bekliyor
- [ ] Prototype git commit + Cloudflare Pages test

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
- Hücre tipi: 2 hat doğrulanmış (HUVEC + MDA-MB-231); 3 hedef için bir tane daha eklemek güçlendirici (zorunlu değil)
- Görüntüleme modu: tek mod (telefon-okül brightfield) — hedef kullanıcı kitlesiyle hizalı; formal mikroskop set'i opsiyonel takviye
- Büyütme: ×10 objektif (makaleden onaylandı)
- Ground-truth aracı: ImageJ + MRI Wound Healing plugin (Suarez-Arnedo 2020)
- Hacim: ROADMAP'teki n=50 hedefini fazlasıyla karşılıyor (442 görüntü)

**Lisans durumu — onaylandı (2026-04-29):** Tier 1 görüntüleri CC BY 4.0 altında. Mol Divers 2024 yayını ([10.1007/s11030-024-10891-z](https://doi.org/10.1007/s11030-024-10891-z)) açık erişim, Düzgün birinci+sorumlu yazar; Zenodo deposit serbest, sadece atıf gerekli.

---

## Teknik Notlar

### Prototype Algoritması (2026-04-29)

**Seçilen yaklaşım: Pure JS, zero dependency (OpenCV.js yok)**
- OpenCV.js 8 MB WASM indirimi + init gecikmesi → prototype için overkill
- Typed array (Uint8Array, Float32Array, Int32Array) ile tüm ops yeterince hızlı
- OpenCV.js → Faz 3'te gerekirse registration için değerlendirilebilir

**ImageJ Wound Healing Size Tool pipeline'ı (JS'de):**
1. `toGray()` — BT.601 luminance (0.2126R + 0.7152G + 0.0722B)
2. `fovMask()` — FOV cutoff ile siyah köşe/dairesel alan maskeleme
3. `enhanceContrast()` — P1/P99 percentile clip + normalize
4. `varianceFilter()` — **integral image (summed area table)** ile O(1) per-pixel local variance; ImageJ `Variance... radius=R` ile eşdeğer
5. `otsuOnMap()` — variance map üzerinde Otsu threshold
6. `applyThreshold()` — polarity: smooth (gap=dark, düşük variance) veya bright (hücre=yüksek variance)
7. `fillHoles()` — border flood-fill + invert; ImageJ `Fill Holes` eşdeğeri
8. `filterComponents()` — BFS connected components, en büyük N bileşeni tut
9. `estimateWidth()` — her satırda min/max span → mean ± SD; ImageJ edge-span yöntemi

**Rendering:**
- Contour: boundary pixel tespiti + dotted white line
- Variance map görünümü: normalizasyon ile gri tonlamalı
- Mask / Source / Overlay view modları

**Export:**
- PNG: canvas.toDataURL → anchor click
- CSV: 24 alan; image ID, GT değerleri, tüm metrikler, parametreler, timestamp

**⚠️ Geliştirme notu — PowerShell here-string tuzağı:**
PowerShell `@'...'@` here-string içinde `</script>` veya HTML tag karakterleri bozulabiliyor.  
Dosya yazımında: ya `write_to_file` aracını kullan, ya Python script ile yaz, ya da part*.html parçalarını `Get-Content | Set-Content` ile birleştir.

### Prototype UI / Algorithm Update (2026-04-29 evening)

`prototype/index.html` current working version has moved from a raw algorithm demo toward an interactive browser lab. Current important decisions:

- Segmentation polarity toggle was removed. The prototype always segments the wound/gap as low-variance area; no `Cell (high var)` user option.
- View controls were simplified to `Contour` and `Mask` only. `Variance` and `Source` are not exposed in the UI.
- Threshold offset range is now `-50` to `+50`; presets are centered around the useful observed band: Quick `-30`, Standard `-35`, Fine `-40`.
- `Min component (px)` range is now `0` to `100,000`, step `1,000`, default `20,000`.
- `Min component` is applied before `fillHoles()` as an island/noise filter: `threshold -> min component island filter -> fill holes -> final measurement`. Do not move it back after fill-holes; that made it behave like a single on/off threshold.
- FOV cutoff should not move the crop box. It only affects the segmentation/FOV mask after a crop has been chosen. Crop recalculation happens on new image load, `Reset auto crop`, auto-crop toggle change, or rotation.
- Auto FOV crop is enabled by default. It detects non-black microscope field and proposes a center square inside it.
- User-adjustable crop is required because auto crop may be imperfect. `Adjust crop` shows the full image with a crop square; mouse drag moves the square, mouse wheel resizes it, `Apply crop` runs analysis on the selected square, `Reset auto crop` returns to the automatic suggestion.
- Image rotation is available as a 90-degree rotate button. Rotation resets crop and reruns analysis; CSV stores `rotation_deg`.
- Contour style is user-controlled: color includes Black/Amber/Cyan/Rose/White/Teal; default is black dashed. Thickness is adjustable by slider and number input.
- Slider value boxes are editable number inputs. Keyboard edits and slider edits are synchronized.
- `file://` mode can block canvas pixel reads for linked calibration images. Preferred local run is from repo root: `py -3 -m http.server 8765`, then open `http://127.0.0.1:8765/prototype/index.html`. Drag/drop or Open local image usually works in `file://` because Blob URLs are used.
- Calibration paths in `prototype/index.html` must use the real folder name `COMBİNE` (Turkish dotted capital I), not plain `COMBINE`.

Current CSV export includes analysis parameters, crop coordinates, rotation, island/component counts, contour settings, and timestamp.

### Prototype UI / Algorithm Update (2026-04-30)

- CSV export `docs/validation-protocol.md` v0.3 ile hizalandı: `schema_version=validation-protocol-v0.3`, `cytomove_algorithm_version=prototype-whst-variance-v0.3`, `cytomove_parameter_json`, runtime, comparator placeholder'ları, crop/rotation/deskew parametreleri.
- File picker fix: open icon içinde native invisible `input[type=file]` var; JS `showPicker()` bağımlılığı yok.
- Otsu threshold 0'a düştüğünde mask 0 px sorunu için percentile fallback eklendi. Log/CSV: `fallback_threshold`, `threshold_fallback_used`.
- Fine deskew eklendi: `Fine rotation (deg)` -20°..+20°, step 0.5°. Transform `imageOriginal + scratch orientation rotation + manual 90° rotation + fine rotation` üzerinden yeniden üretilir; crop sıfırlanır ve analiz tekrar çalışır.
- Export alanları: `scratch_orientation`, `manual_rotation_deg`, `orientation_rotation_deg`, `rotation_deg`, `deskew_angle_deg`, `deskew_applied`; analysis log JSON içinde de yer alır.
- `Show angle ruler` overlay: yarı şeffaf cetvel çizilir ve mouse ile taşınabilir. Amaç görsel hizalama; mask segmentasyonunu veya width metriğini değiştirmez.
- Custom local group upload added: file picker accepts multiple images and drag/drop accepts multiple image files. Selecting or dropping 2+ images creates a temporary `Custom local group`, switches to Group review, runs the same preview/contour pipeline, and allows card click-through to the single-image canvas. Custom groups have no GT fields and skip auto-calibration.
- Browser TIFF caveat: native browser image decoding does not reliably support `.tif/.tiff`, so WHAD/CAMAD TIFFs should be converted to PNG for app review. Use `scripts/convert_tiff_for_browser.ps1`; default output is ignored under `validation_ref_sets/browser_ready/whad_camad_png/`. The app now warns if TIFF files are selected/dropped.
- 2026-05-01 methodological update: Cytomove should not position itself as only a wound-area calculator. Area metrics stay, but width-based metrics are first-class outputs because area fraction is crop/FOV dependent.
- 2026-05-02 validation strategy update: validation is now three-layered. (1) Synthetic binary masks prove mathematical correctness with zero tolerance. (2) Synthetic microscopy-like images test robustness with predefined low tolerances. (3) Real microscopy images test biological/workflow validity against manual/consensus/ImageJ/WHST references.
- 2026-05-02 real-image validation source decision: first-wave real validation should mix acquisition quality levels. WHAD/CAMAD is the primary professional time-lapse set; CSMA is the public comparator/workflow set; selected local Duzgun phone/eyepiece images remain a real-world usability stress subset. RQSA is deferred to later robustness/stress validation rather than first-wave validation.
- Raw/public datasets must not be copied into the project root or committed. Use ignored `validation_ref_sets/raw/` for WHAD/CAMAD, CSMA, local phone, and deferred RQSA archives; use `validation_sets/` for generated Cytomove outputs. Dataset layout is documented in `docs/validation-dataset-layout.md`.
- External validation reference inventory added: `scripts/build_validation_ref_inventory.py` writes `docs/validation-ref-inventory.csv` and `docs/validation-ref-inventory-summary.md`. Current first-wave subset count is WHAD/CAMAD 83 TIFF, CSMA 49 JPEG, local phone 9 JPG; RQSA empty/deferred.
- Synthetic crop-robustness is a core validation requirement: use the same wound mask under different crop/FOV perturbations to show area fraction sensitivity and compare it with mean/median width stability.
- Synthetic validation harness started: `scripts/synthetic_validation.py` writes ignored outputs under `validation_sets/synthetic/`; documentation lives in `docs/synthetic-validation.md`. Run with `py -3 scripts/synthetic_validation.py --output-dir validation_sets/synthetic --write-masks`. Current binary-mask suite has 10 cases ordered from simple to difficult, including straight, narrow, stepped, tapered, sinusoidal, V-shaped, partial-closure, bridge, tilted, and extreme irregular multi-bridge wounds. App-test PNG fixtures are mostly `2000x1200 px`; the hardest chaotic case is `2200x1400 px` and should preserve wound continuity while adding severe narrowing and bridges.
- Crop handling note: rectangular microscopy/synthetic fixtures must remain valid. Do not force square crops. The prototype now allows rectangular manual crop adjustment and can apply the current crop as a normalized rectangle across group review.
- `estimateWidth()` now needs/report full horizontal scanline profile metrics: mean, median, SD, CV, min/max width, valid row count, valid row fraction, and area-per-valid-row. Width is the recommended primary metric when crop/FOV is inconsistent.
- Per-image QC now includes `segmentation_quality_score`, warning list, and `recommended_primary_metric` (`area_and_width`, `width_preferred`, or `review_required`). Warnings include crop/FOV-dependent area fraction, manual crop, low valid row fraction, high width CV, fragmented final mask, no contour, and GT/crop mismatch.
- CSV export includes width profile metrics, QC warnings, and recommended primary metric. Time-series area-vs-width closure comparison remains a next step.
- Validation experiment to add: create artificial crop perturbations from the same wound mask and compare sensitivity of area fraction vs mean/median width.

### 2026-05-04 Workspace Reconciliation

- Weekend work produced multiple commits through `96fa550 Refine scratch orientation and ruler workflow`; local workspace still has uncommitted changes in `AGENT_BRIEF.md`, `ROADMAP.md`, `docs/validation-protocol.md`, and `prototype/index.html`.
- New untracked project files to review before commit: `docs/validation-dataset-layout.md`, `docs/validation-ref-inventory.csv`, `docs/validation-ref-inventory-summary.md`, `scripts/build_validation_ref_inventory.py`, and `scripts/convert_tiff_for_browser.ps1`.
- Untracked local artifacts likely not for commit: `Cytomove - Segmentation Lab.pdf`, `_screenshot_0.png`, `_screenshot_1.png`, `find_backup.py`, and `.DS_Store` files under `sample_imagej_apps/`.
- `.gitignore` already ignores `validation_ref_sets/`, `validation_sets/`, literature paper/extracted folders, and comparator benchmark images.
- `prototype/index.html` passes JS syntax check with `new Function(script)` as of this reconciliation.

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
