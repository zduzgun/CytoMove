# AGENT_BRIEF.md — Cytomove Operasyonel Hafıza
<!-- HERHANGİ bir AI asistanı (Claude, Codex/GPT, vb.) için ortak operasyonel hafıza.
     Her oturuma bu dosyayı okuyarak başla; sonunda STATUS'u güncelle ve commit et.
     README.md ve ROADMAP.md ile birlikte kullan. -->

**Son güncelleme:** 2026-06-02
**Versiyon:** 1.7

---

## ⭐ STATUS (her oturum sonunda ÜZERİNE YAZ — append etme)

- **Aktif iş kolu:** Faz 2/3 — bioRxiv preprint submission hazırlığı.
- **Son tamamlanan:** Codex review fix pass: manuscript source-of-truth yolu düzeltildi (`scripts/build_manuscript_docx.py`), commit playbook `git add -A` yerine seçici staging'e çekildi, preload sürümü yeniden `package.json` kaynaklı yapıldı.
- **TEK sıradaki aksiyon:** Zenodo deposit'ini YAYINLA (DOI `10.5281/zenodo.20486820` şu an muhtemelen sadece rezerve) → sonra bioRxiv'e gönder.
- **Source-of-truth dosyalar:** manuscript = `docs/manuscript-cytomove-submission.md` + `scripts/build_manuscript_docx.py` → `docs/Cytomove_manuscript_submission.docx` (aşağıdaki Source-of-Truth tablosuna bak). Sayısal gerçek = `validation_sets/comparator_clean/results/validation_master.xlsx`. Strateji = `ROADMAP.md`.
- **Açık uyarı / BEKLEYEN:** Büyük commit bekliyor (~62 dosya). `.git/index.lock` yalnızca aktif git süreci yoksa silinmeli; 2026-06-02'de aktif `git.exe` süreçleri görüldü. LibreOffice `docs/.~lock.*` PDF'i tutuyor. Commit kullanıcı makinesinde yapılacak; güvenli seçici staging reçetesi `docs/COMMIT_PLAYBOOK.md`'de.

---

## 🤝 Cross-Agent Handoff Protokolü (Claude + Codex/GPT ortak)

Hangi ajan olursan ol, bu 3 adımı uygula:

1. **Oku:** `git log --oneline -5` + bu dosyanın STATUS bloğu. (Son durumu 30 saniyede gör.)
2. **Çalış:** Source-of-Truth tablosundaki kanonik dosyaları düzenle; türetilen çıktıları (docx/pdf) elle düzenleme, üreticisinden yeniden üret.
3. **Kapat:** STATUS bloğunu ÜZERİNE YAZ + anlamlı mesajla **commit et** (mesaj başına ajan adını koy, ör. `[claude]` / `[codex]`). Commit'ler asıl cross-agent hafızadır.

> Not: Bu dosya ajan-bağımsızdır. Codex/GPT'ye de "önce AGENT_BRIEF.md oku, sonunda güncelle + commit et" talimatı verilmeli.

---

## 📌 Source of Truth / Build Pipeline

| Çıktı | Kanonik kaynak | Nasıl üretilir | Elle düzenle? |
|-------|----------------|----------------|---------------|
| `docs/Cytomove_manuscript_submission.docx` | `docs/manuscript-cytomove-submission.md` + `scripts/build_manuscript_docx.py` | `python scripts\build_manuscript_docx.py` | **HAYIR** — markdown + generator üzerinden üret |
| `docs/Cytomove_manuscript_submission.pdf` | yukarıdaki docx | `soffice --headless --convert-to pdf` | HAYIR |
| `docs/manuscript-cytomove-submission.md` | insan-okur AYNA | generator ile elle senkron tutulur | Evet ama docx ile senkronla |
| Sayısal sonuçlar (MAPE/r vb.) | `validation_sets/comparator_clean/results/validation_master.xlsx` | scriptler | Sadece xlsx |
| `docs/references/cytomove-preprint.bib` | kendisi | elle | Evet |
| Zenodo paketi | `docs/Cytomove_zenodo_deposit_enriched.zip` | `.zenodo.json` + dosyalar | zip'i yeniden derle |
| Strateji/faz | `ROADMAP.md` | elle | Evet |

**⚠️ Kritik:** Manuscript'in kanonik metni `docs/manuscript-cytomove-submission.md`, kanonik DOCX üreticisi `scripts/build_manuscript_docx.py`'dir. DOCX/PDF'i elle düzenleme; düzeltmeyi markdown'da yap, gerekiyorsa generator'ı güncelle, sonra çıktıları yeniden üret.

---

## 🐛 Operasyonel Gotcha'lar (tek liste)

- **Manuscript build:** `docs/Cytomove_manuscript_submission.docx` için mevcut üretici `scripts/build_manuscript_docx.py`'dir; eski notlardaki `outputs/build_manuscript.js` / `node build_manuscript.js` rotasını kullanma.
- **PDF dosya kilidi:** Kullanıcı PDF'i görüntüleyicide açıksa `soffice` üzerine yazamaz ("Io Abort Code:27" / "Permission denied"). Yeni ada (`_v2.pdf`) yaz ya da kullanıcıdan kapatmasını iste.
- **Türkçe klasör adı `COMBİNE`:** dotted-capital-İ; kodda/yolda `COMBINE` değil `COMBİNE` kullan.
- **`github_token.txt`** repo kökünde — asla stage/commit etme; history'e düşerse revoke.
- **Ham görüntüler** (`wound healing/`, `validation_ref_sets/`, `validation_sets/`) ignored kalmalı; commit etme.
- **PowerShell here-string** `@'...'@` içinde `</script>`/HTML tag bozulabilir; dosya yazımında write tool ya da Python kullan.

---

## Standart Başlangıç Rutini

Yeni oturumda şu sırayla ilerle:

1. `git status` — yerel değişiklik var mı kontrol et
2. Bu dosyayı oku (`AGENT_BRIEF.md`) — operasyonel durum
3. `ROADMAP.md` — stratejik plan (büyük karar gerekiyorsa)
4. `README.md` — public proje özeti (metin/tanıtım işi varsa)
5. `index.html` — sadece landing page kodu değişecekse
6. `docs/validation-protocol.md` — validation/MVP işi varsa
7. `docs/manuscript-cytomove-submission.md` + `docs/biorxiv-submission-checklist.md` — preprint/manuscript işi varsa (aktif submission build)
8. Kullanıcıya sor: *"Son oturumdan bu yana değişen bir şey var mı?"*

**⚠️ Asla:** `github_token.txt` veya herhangi bir token içeren dosyayı stage/commit etme.
**⚠️ Asla:** `wound healing/` klasöründeki ham görüntüleri git'e commit etme. Boyut + olası yayın hakkı sorunları.

---

## 2026-06-01 Oturum: bioRxiv Preprint Submission Build ⭐

Bu oturum tamamen manuscript/preprint hazırlığına ayrıldı. Sonraki oturum buradan devam etmeli.

**Ne yapıldı:**
- Mevcut 7 dağınık manuscript taslağı incelendi; v4 (literature_format) en olgun olarak belirlendi ama yalnızca Pearson r'ye yaslanıp MAPE'yi atmıştı (zayıf).
- **Yeni, tek source-of-truth submission manuscript yazıldı:** referans yayın derinliğinde (WHST/PLOS ONE modeli), tam IMRAD, gerçek 9-aşamalı algoritma Methods bölümü (`prototype-whst-variance-v0.4` pipeline), genişletilmiş Introduction/Discussion.
- **MAPE dürüstçe ama QC çerçevesinde geri eklendi** (kullanıcı talebi: "göze sokma"). Table 3 = MAPE + median + max + Pearson r birlikte. WHAD-MCF7 area MAPE %15'in tamamen near-closure frame'lerden geldiği (frame 046: 1399 vs 2553 px = %82 göreli, median sadece %6.6) açıkça yazıldı. Pearson r "trend istatistiği, frame-level doğruluk kanıtı değil" olarak çerçevelendi.
- **Submission docx + PDF üretildi** (18 sayfa, 8 gömülü figür, 3 tablo). Aktif build yolu: `docs/manuscript-cytomove-submission.md` → `scripts/build_manuscript_docx.py` → `docs/Cytomove_manuscript_submission.docx`.
- **4 metadata kesinleşti:** ORCID `0000-0001-6420-6292`; Funding = "no external funding"; CSMA atıfı doğru (Pham et al. 2025); **WHAD/CAMAD atıfı düzeltildi → doğru lead author Iheme et al. 2024** (placeholder'daki "Sarmad" yanlıştı; Zenodo 12806149'dan doğrulandı, Version 1.0.0-alpha, CC BY 4.0). `.bib`'e `iheme2024whadcamad` eklendi (10 kayıt).
- **Zenodo deposit paketi hazırlandı:** `docs/Cytomove_zenodo_deposit.zip` (validation_master.xlsx + figürler PDF/SVG + manuscript PDF + `.zenodo.json` + README). Submit talimatları `docs/zenodo-submit-instructions.md`.
- **Eski taslaklar arşivlendi:** 7 docx + 2 eski md kaynağı → `docs/old/manuscript_drafts/`. Kök `docs/`'ta artık tek aktif set.

**Manuscript editorial review pass (2026-06-01, aynı gün — kullanıcıyla madde madde):**
- A1: luminance etiketi düzeltildi → **BT.709/sRGB** (kod 0.2126/0.7152/0.0722; "Rec. 601" yanlıştı).
- B1: figürler okuma sırasına göre yeniden numaralandırıldı (1–5; görsel-karşılaştırma=Fig4, time-course=Fig5). B2: Figure 3 metne çağrıldı.
- C1: referanslar alfabetik (Iheme 4. sıraya). C2: Schindelin tam 16 yazar.
- D1: **Zenodo DOI 10.5281/zenodo.20486820** Data & Code Availability'e işlendi (placeholder kaldırıldı).
- D2: figür caption'larında görseller için **WHAD-MCF7**; dataset resmi adı **WHAD/CAMAD** korundu (§2.5, Table 2, ref, provenance).
- D3: yuvarlama (2,550 px / "just over a thousand").
- D4: **tüm em-dash'ler silindi** (parantez/virgül). Kalan "–" sadece referans sayfa aralıkları.
- E: yazılım iddiaları (desktop kod, preset isimleri, manuel modlar, export alanları) kullanıcı tarafından onaylandı.
- Zamir: tek yazar için **kişisel olmayan biçim** seçildi; tüm anlatıcı "we" → pasif/impersonal ("This work presents…", "Cytomove was evaluated…", "…was found to contain…"). provenance'taki "the author" kasıtlı, korundu.
- docx + PDF yeniden üretildi, markdown senkron. **Aktif generator `scripts/build_manuscript_docx.py`; eski `build_manuscript.js` null-byte notu bu repodaki mevcut build yolu için geçerli değil.**

**Stratejik karar (kullanıcı onayı):** Venue = **temkinli bio-preprint → bioRxiv ŞİMDİ**. Teknik/IEEE Access sürümü (çoklu-araç benchmark, Dice/IoU ground-truth, runtime/complexity) Faz 3'e ertelendi — mevcut kanıt (n=31, tek comparator WHST) IEEE teknik makalesi için yetersiz; bio-preprint çerçevesi elindeki veriyle uyumlu.

**Sıradaki adımlar (bir sonraki oturum):**
1. DOI (`10.5281/zenodo.20486820`) manuscript'e işlendi ✓. **Zenodo deposit'ini YAYINLA** ki DOI gerçekten çözülsün (şu an muhtemelen sadece rezerve). Upload paketi: `docs/Cytomove_zenodo_deposit_enriched.zip`.
2. Deposit içindeki manuscript PDF'ini güncel sürümle tazele + enriched ZIP'i yeniden derle (editorial pass sonrası değişti).
3. bioRxiv'e gönder: New Results, Bioinformatics, CC BY 4.0. (Kullanıcı hesabı gerekir; agent submit edemez, Chrome ile birlikte yürütülebilir.)
4. bioRxiv DOI gelince README + cytomove.com + IHSC bildirisine ekle.
5. IHSC bildiri özeti eski WHAD-MCF7 MAPE 7.01% kullanıyor → güncel 15.03%/median 6.6% ile düzelt.

**Aktif submission dosyaları (`docs/`):** `Cytomove_manuscript_submission.docx` / `.pdf`, `manuscript-cytomove-submission.md` (kaynak), `references/cytomove-preprint.bib`, `manuscript_figures/` (+ `_docx_optimized/` JPG'ler), `zenodo_deposit/` + zip, `biorxiv-submission-checklist.md`, `preprint-readiness-plan.md`, `zenodo-submit-instructions.md`.

**⚠️ Repo'da bu oturum dahil çok sayıda commit edilmemiş değişiklik birikti; henüz commit edilmedi.**

---

## Proje Özeti

**Cytomove** — tarayıcıda çalışan, gizlilik odaklı scratch assay (wound healing) analiz aracı.  
Hedef kullanıcı: hücre biyolojisi araştırmacıları.  
Anahtar fark: assay görüntüleri sunucuya gönderilmez, analiz tamamen client-side çalışır.

- **Web:** [cytomove.com](https://cytomove.com) / [cytomove.pages.dev](https://cytomove.pages.dev)
- **GitHub:** [github.com/zduzgun/CytoMove](https://github.com/zduzgun/CytoMove)
- **Deploy:** Cloudflare Pages (static HTML, GitHub entegrasyonu ile otomatik)
- **Feedback form:** Formspree `mdayrwqe` -> zekeriya.duzgun@giresun.edu.tr

---

## Current Operational Snapshot (2026-05-24)

- Soft deploy is live on `https://cytomove.com`.
- `www.cytomove.com` DNS is configured and resolves successfully.
- Root `index.html` is now a simplified web-app-first landing page, not a waitlist page.
- Primary landing CTA is `Open Web App` -> `prototype_refactor/`. Desktop Alpha is intentionally quieter and request-only through the feedback form.
- Landing page has a feedback/suggestion form. Test mail delivery was confirmed by the user.
- Current prototype lives at `prototype_refactor/`.
- Legacy `prototype/` is a redirect page to `prototype_refactor/`.
- The previous large single-file prototype is archived at `old/prototype/index.html`.
- Local helper server: `scripts/serve_prototype_refactor.py` serves root landing + prototype routes on `127.0.0.1:8768`.
- Major prototype UI changes: collapsible left panel, Basic/Advanced subpanels, cleaner export section.
- Auto crop FOV default is off. Brightfield circular-FOV crop logic was improved, but it still needs broader image testing.
- Group previews use downsampled analysis for speed; full-resolution group work is triggered explicitly where needed.
- `Plots ZIP` works.
- `Group PNGs ZIP` was fixed in commit `afe30ee`: it now auto-prepares missing full-resolution overlays before downloading the ZIP.
- Known technical debt: live deployment feels slower than local. Next performance pass should measure load time, image analysis time, group render time, export time, cache headers, and whether analysis/export should move to a Web Worker.
- Soft-deploy communication stance: do not market as public beta yet. Use "prototype feedback round" / small private feedback group language.
- Desktop Alpha strategy decision (2026-05-24): keep Alpha 0.1 fully free and no mandatory login. Email/account capture should start as optional feedback/update signup, not as a hard gate. A 10-day trial / email activation / license check belongs to private beta or paid module phase, not the first alpha. Long-term model: core analysis stays free/offline-friendly; paid modules can require account/license with a short offline grace period.
- Desktop Alpha web-link layer exists: app can read `https://cytomove.com/desktop-manifest.json` for update/module/status messaging and has Feedback / Account / Updates links. This is not a license system and must not upload assay images or analysis outputs.
- Landing page positioning update (2026-05-24): root site now presents the browser web app as the main public path and lists the actual web app capabilities: local image input, single/group review, segmentation controls, area/width metrics, mask/contour review, manual correction, QC guidance, plots, PNG/CSV/Excel/ZIP exports, and browser-local image handling. Desktop Alpha remains request-only for trusted testers and heavier local workflows; do not imply a public downloadable installer until release hosting is decided.
- SEO foundation update (2026-05-24): root title/meta now targets "wound healing scratch assay analysis"; first content page lives at `wound-healing-scratch-assay-analysis/`; `robots.txt` and `sitemap.xml` exist. Next SEO step is Google Search Console verification + sitemap submission, then additional educational pages around ImageJ alternatives and measurement workflows.
- Desktop Alpha packaging update (2026-05-24): tester distribution uses a portable ZIP, not a standalone EXE. `npm run pack:win` creates `desktop_alpha/release/Cytomove-Desktop-Alpha-<version>-win-x64.zip` and includes `TESTER_README.txt`. Installer/code-signing can wait until later.
- Desktop Alpha trial gate update (2026-05-25): Alpha 0.1 tester builds show a first-run welcome screen and keep a local 30-day alpha window in Electron `userData`. After expiry or clock rollback detection, analysis is locked behind a thank-you/update screen that links to cytomove.com. This is an alpha tester control, not paid licensing.
- Subscription direction (2026-05-24): build the subscription/account skeleton early, but do not start hard gating in Alpha 0.1. Public language can mention planned Free Alpha / Academic / Commercial paths, while actual payment, 10-day trial, and license enforcement wait until private beta or validated paid modules. Academic/commercial differentiation should not compromise the privacy claim: assay images remain local.

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

**Faz 1 — Minimum Credible Landing + soft deploy tamamlandı** (`43c7d57`, `afe30ee`; marka/sosyal/blog işleri beta launch hazırlığına ertelendi)

**Faz 2 — MVP + Validation + private feedback iş kolu aktif (2026-05-24)**
Validation protokolü v0.4 yönünde kalır: sentetik binary mask doğrulaması, sentetik microscopy-like robustness ve gerçek görüntü validasyonu üç katmanlı yürür. Prototip artık soft-deployed browser workspace seviyesinde: browser-only segmentasyon, group review, custom local group, manual brush correction, width profile metrikleri, QC uyarıları, CSV/Excel export, plot ZIP ve full-resolution Group PNG ZIP export bulunur.
Başarı kriterleri korunur: Pearson r > 0.9, <10% wound area error, 70%+ kullanıcı kabul oranı; ancak width mean/median ve QC/recommended-primary-metric artık area ile birlikte birinci sınıf çıktıdır. Public beta değildir; sıradaki doğru adım küçük bir private feedback round ve performans profillemesidir.

**Faz 3 preprint işi öne çekildi (2026-06-01):** bioRxiv submission-ready manuscript hazır (yukarıdaki 2026-06-01 oturum bloğuna bak). Gönderim henüz yapılmadı; Zenodo upload + DOI sonra bioRxiv submit kalan adımlar.

---

## Canlı Durum (2026-05-24 itibarıyla)

- ✅ Cloudflare Pages deploy aktif
- ✅ cytomove.com custom domain aktif
- ✅ www.cytomove.com erişilebilir
- ✅ Light tema landing page yayında; artık waitlist değil, prototype + status + feedback odaklı
- ✅ Canvas wound healing animasyonu çalışıyor
- ✅ Formspree feedback formu çalışıyor (mail geldiği kullanıcı tarafından doğrulandı)
- ✅ GitHub repo public: `github.com/zduzgun/CytoMove`
- ✅ Scientific trust layer sadeleştirildi: browser-local assay images, validation in progress, private beta next
- ✅ `prototype_refactor/` canlı prototip yolu
- ✅ `prototype/` eski URL için redirect
- ✅ `old/prototype/` eski tek dosyalı prototip arşivi
- 🔄 Performance pass gerekli: canlı site/prototip lokale göre yavaş hissediliyor

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
- 2026-05-04 group review update: entering Group review or changing a group automatically samples the group images in the background and activates the appropriate `Microscope mode` button. Manual microscope-mode or preset selection is treated as a user override and is not repeatedly overwritten by auto-detect.
- 2026-05-04 segmentation cleanup update: `Ignore tiny islands` control added (`Off/Trace/Very low/Low/Moderate/Medium/High`). It maps to `tiny_island_mode` / `tiny_island_max_area_px` in export and adjusts small internal island filling for noisy/debris-heavy wound gaps.
- 2026-05-04 internal island reporting update: internal island metrics now report total detected islands as `remaining + ignored/filled` instead of showing only the post-cleanup remaining count. CSV/Excel exports include total, remaining, and filled-small island fields.
- 2026-05-04 startup UX update: calibration/demo UI is hidden in the default prototype flow (`SHOW_DEMO_CALIBRATION=false`), auto-loading the bundled calibration image is disabled, and the app opens clean for drag/drop or multi-file Open workflows.
- 2026-05-04 contour UX update: contour color auto-follows microscope mode (`Brightfield -> black`, `Phase contrast -> cyan`) and contour style now defaults to solid. Manual contour color/style edits set a user override and are not overwritten until a new local group is loaded.
- 2026-05-05 contour default update: contour style now defaults to `solid` for both Brightfield and Phase contrast auto-style. Users can still manually switch to dashed.
- 2026-05-04 custom group UX update: multi-image import asks for a group name via prompt with an auto-suggested default. Multiple custom groups persist in memory for the current browser session and remain selectable from `Loaded group`.
- 2026-05-05 group navigation UX update: when a loaded group image is open in the main single-image canvas, left/right overlay arrow buttons allow stepping through previous/next timepoints without scrolling down to the group cards. Buttons hide automatically at group boundaries, outside group mode, or while crop editing.
- 2026-05-05 group export UX update: `Group PNGs ZIP` moved into the Export section. It packages full analysis-resolution contour overlay PNGs for every analyzed image in the selected group into one browser-generated `.zip`; it no longer exports the downsampled ~520 px group-card previews. Exported filenames include the rendered `WxH` pixel dimensions.
- 2026-05-06 plot export update: Export section now has `Plots ZIP`. In group mode it creates two PNG plots in one browser-generated zip: wound area (%) over time and mean wound width (px) over time. If time labels cannot be parsed, image order is used on the x-axis.
- 2026-05-06 plot preview update: Export section also has `Area plot` and `Width plot` buttons. They render the same group time-course plots in an in-app modal without downloading; clicking outside the modal or the close button dismisses it.
- 2026-05-06 CSMA-inspired group prior update: main-canvas segmentation now uses the previous analyzed timepoint mask as a spatial prior when the current image belongs to a loaded group. The prior mask is dilated into a wound corridor and only constrains the current raw candidate mask; the experimental local sensitive prior-search was reverted because it worsened late-frame segmentation by adding noisy regions. The log shows `group prior r...` when this corridor constraint is active.
- 2026-05-06 late-wound preset reset: empirical CSMA sample 11 testing showed late timepoints work best around `variance radius 1`, `threshold offset -100`, `min component 0`, `tiny islands Trace`, `FOV cutoff 0`, `Brightfield`. Prototype defaults and the active `Standard` preset now use exactly these values; `Rough` and `Fine` are small variants around this standard. WHST takeaway is to preserve transparent local-variance/threshold control and WHST-aligned metrics rather than copying a hidden parameter.
- 2026-05-06 preset naming update: user-facing presets were renamed from `Rough / Standard / Fine` to image-type presets: `Brightfield normal cells`, `Brightfield small cells`, and `Phase contrast`. The middle `Brightfield small cells` preset is the CSMA brightfield small-cell optimized setting (`radius 3`, `threshold level 1`, `min component 0`, `Trace`, `Brightfield`). The `Phase contrast` preset switches microscope mode to full-field phase contrast.
- 2026-05-06 export consistency fix: CSV/Excel exports now use the last displayed segmentation result stored on each image (`state.result` / `state.groupResults`) for metrics and segmentation parameters. They no longer fall back to the currently visible slider values for radius, threshold, min component, tiny-island mode, FOV cutoff, microscope mode, crop, rotation, and analysis dimensions. This prevents exports from drifting if a user changes controls after the displayed segmentation was produced.
- 2026-05-06 preset-specific threshold scale: `Brightfield small cells` keeps the narrow CSMA-optimized `Threshold level` scale (`1-50`, internally `-100..-50`) so small-cell behavior is preserved. `Brightfield normal cells` and `Phase contrast` switch the same control to `Threshold offset` with the old wide range (`-100..+100`) so normal-cell brightfield images can be tuned again. Exports include `threshold_mode`.
- 2026-05-06 Brightfield normal cells preset restore: for `validation_sets/comparator_clean/images_png/local_phone_9/HK` and similar normal-cell brightfield images, the `Brightfield normal cells` preset was restored to the early WHST-like settings that found the wound easily: `variance radius 22`, `threshold offset -32`, `min component 55000`, `tiny islands Medium`, `FOV cutoff 36`, `Brightfield`. The variance-radius UI range is back to `1-45`. `Brightfield small cells` remains unchanged at the CSMA small-cell setting.
- 2026-05-07 scratch orientation UX fix: default scratch orientation stays `Vertical scratch` for all presets, including `Brightfield normal cells`. If a loaded group looks like a horizontal scratch while the selector is still vertical, an inline warning bubble appears under `Scratch orientation` telling the user to select `Horizontal scratch` to rotate images into vertical analysis view. Group thumbnails and the main single-image view now both apply the same orientation transform, so clicking a thumbnail no longer opens the main image in a different orientation.
- 2026-05-07 orientation warning visibility fix: horizontal-scratch detection also renders a red `Orientation check` card in the group summary area, advising `Scratch orientation -> Horizontal scratch`. Changing scratch orientation clears stale group results and re-renders group thumbnails, so preview cards and the main single-image canvas stay in the same orientation.
- 2026-05-06 threshold UI scale update: visible `Threshold offset` was renamed to `Threshold level` with a 1-50 scale. Internally it maps linearly to the old offset range (`1 -> -100`, `50 -> -50`). CSV/export includes both `threshold_level` and internal `threshold_offset`. `Variance radius` UI range was narrowed to 1-20 for current tuning.
- 2026-05-06 fragmented late-wound bridge update: continuity filtering for Brightfield/late wounds now keeps shorter central wound components (`spanFloor` relaxed), and a vertical row-interpolation bridge connects nearby fragments in the same x-corridor. Logs/export include `bridgeFilledPx` / `bridgeGapCount` and show `bridged ... gaps` when applied.
- 2026-05-06 bridge refinement: the fragment bridge no longer draws a narrow center-line connection. It interpolates the left/right wound edges between compatible fragments, allows a wider vertical gap, and requires loose horizontal overlap so missing middle gaps can be included without leaving dotted internal contour lines.
- 2026-05-07 frame-edge wound extension: after continuity and bridge, brightfield/cutoff segmentation extends a stable wound corridor to the top and/or bottom image frame when the detected wound component reaches near the frame edge. This fixes HK/local-phone cases such as `hk_24h_002.png` where the wound visibly continues out of frame but the upper portion was not contoured. Logs/export include `edgeExtendedPx` / `edgeExtendedCount`.
- 2026-05-07 phase contrast slit cleanup: phase-contrast/full-field segmentation now closes very narrow, vertically persistent internal slit gaps that are flanked by wound mask on both sides. This removes false inner contour lines inside the wound body, such as the marked vertical artifact in `whad_mcf7_026.png`. Logs/export include `phaseSlitFilledPx` / `phaseSlitCount`.
- 2026-05-07 phase contrast edge smoothing: phase-contrast/full-field masks now receive a small morphological close/open smoothing step after slit cleanup and before bridge/edge extension. This reduces jagged/pütürlü wound corners in later WHAD MCF7 frames without changing brightfield presets. Logs/export include `phaseSmoothChangedPx` / `phaseSmoothRadius`.
- 2026-05-07 final internal-island cleanup: after slit cleanup, phase smoothing, bridge, and edge extension, the final mask now runs one more small-hole cleanup pass. This catches second-generation internal island artifacts created by later morphology steps, such as the bad contour around the marked island in `whad_mcf7_026.png`. Result fields include `finalHoleFilledCount` / `finalHoleFilledArea`.
- 2026-05-08 manual correction persistence/export fix: manual corrections are restored when a user switches away from an edited group image and returns, including orientation/rotation-transformed images. The main single-image canvas is now the authoritative result for a sample: when a group image is opened and segmented, Cytomove stores that exact `src/field/mask/result` into `state.groupResults`, refreshes the group card from it, and uses it for CSV/Excel/plot/Group PNG ZIP exports. Group cards no longer run a second downsampled segmentation for their visible contour; they render a downsampled preview of the stored full-result mask. Group preview background analysis refuses to overwrite an existing manual override, and group exports prefer `manualOverrides` over stale `groupResults`.
- 2026-05-08 per-image settings scope: left-panel segmentation controls now affect only the currently open main/single image. If that image belongs to the loaded group, only its group card/result is refreshed. Full group re-analysis is reserved for the explicit `Apply to group` button, which forces non-manual group results to be recalculated with the current controls. Scratch orientation changes no longer clear/re-render the whole group automatically.
- 2026-05-08 per-image settings memory: each group image now stores its own left-panel segmentation settings in `state.sampleSettings`. Opening another image first restores that image's saved settings (or settings recovered from its existing result) into the panel before segmentation. If the image has no history, the default Brightfield small-cells preset is used instead of inheriting the previously edited image's sliders. `Apply to group` still intentionally writes the current settings across the group.
- 2026-05-08 initial microscope preset detection: when a new local multi-image group is added, Cytomove samples the images before opening the first one. If the group is classified as phase contrast, every new sample starts with the `Phase contrast` preset; otherwise it starts with `Brightfield small cells`. These detected settings are written into each sample's `state.sampleSettings`, so the first opened image no longer begins with the wrong brightfield default for phase-contrast datasets.
- 2026-05-08 Phase contrast 2 preset: added a fourth preset, `Phase contrast 2`, for speckled/pütürlü phase-contrast images such as `validation_sets/comparator_clean/images_png/whad_mcf10a_33`. It intentionally uses a brightfield-style low-variance setup (`variance radius 1`, `threshold level 1`, `min component 0`, `Trace`, `FOV cutoff 0`, microscope mode `Brightfield/cutoff`) because this captures the wound body better than the classic full-field phase preset on that set. Initial group detection now routes phase-like images with high dark/center-dark speckling to `Phase contrast 2`.
- 2026-05-05 manual correction UX update: manual correction no longer acts like a point brush. `Add scan` lets the user drag a small rectangular ROI; on mouse release Cytomove clears that ROI, runs a local fine threshold scan, then writes back only the largest connected gap component so tiny speckles/pütür components are suppressed. `Erase scan` is intentionally simpler: it clears all mask pixels inside the selected ROI so that region becomes non-wound/no-border. `Scan sensitivity` controls the local threshold tolerance for Add scan only.
- 2026-05-06 Add scan stability update: reverted the failed 4-neighbor/gray-variance scoring experiment because it broke the previously useful low-sensitivity behavior. Add scan now uses the earlier connected-component selection again, while `Scan sensitivity` maps to a conservative local threshold range (`4` remains strongly conservative; high sensitivity is capped and cannot become overly permissive).
- 2026-05-06 Clean specks update: manual correction now has a separate `Clean specks` ROI mode. It does not re-scan or erase the whole ROI; it removes only small existing mask components inside the selected rectangle. It uses 4-connected components so diagonal pütür bridges split apart. `Scan sensitivity` controls the maximum component size cleaned.
- 2026-05-06 Clean specks tiny-island update: Clean specks also removes components below a separate `non-cell floor` even if they are the largest component in a tiny ROI, so islands too small to plausibly be cells are cleaned.
- 2026-05-06 Add scan tiny-island update: after Add scan keeps the largest local gap component, it now fills tiny internal holes/islands within that component before writing the ROI back to the mask. This reduces many small contour loops inside the added wound area.
- 2026-05-07 Fill area manual correction: Manual Correction now includes `Fill area`. Unlike `Add scan`, it does not threshold or search; it directly fills all analysis-field pixels inside the dragged ROI as wound mask. Use it when the user knows a rectangular region is already inside the wound contour and wants to close missed internal gaps quickly.
- 2026-05-04 comparator validation plan update: core comparator workbench created at `validation_sets/comparator_workbench/`. Core set contains local phone 9 images, CSMA 12 selected images, WHAD MCF10A 12 selected images, and WHAD MCF7 12 selected images. Full stress sets contain CSMA 49, WHAD MCF10A 35, and WHAD MCF7 48. Use `manifest.csv` and `core_comparator_template.csv` for result entry.
- 2026-05-04 comparator priority update: primary comparator tools are WHST, TScratch, and PyScratch. ImageJ manual/threshold is no longer treated as a main competitor; keep it only as optional human/manual reference. CSMA remains optional/supplementary if PyScratch or TScratch becomes impractical.
- 2026-05-04 TScratch blocker: local TScratch package under `sample_imagej_apps/TScratch-master/TScratch-master` is `tscratch_nomcr_win` only. It requires MATLAB Compiler Runtime v7.8 and fails with missing `mclmcrrt78.dll`. The runtime-inclusive `tscratch_win.zip` link in INSTALL appears broken. Treat TScratch as legacy comparator pending recovery of MCR-inclusive installer; document reproducibility/runtime limitation if it cannot run.
- 2026-05-04 PyScratch comparator status: official Bitbucket repo `https://bitbucket.org/vladgaal/pyscratch_public.git` is reachable and was cloned locally to `sample_imagej_apps/pyscratch_public/`. Repo includes `README.md`, Python source, bundled Windows dependency wheels for Python 3.7 x64, and `dist/PyScratch.exe` (~109 MB). Running the newly downloaded EXE or dependency installers requires explicit user confirmation. PyScratch README says image filenames should be sequential like `label_001.tif`, and phase-contrast images are recommended; brightfield may need edge-enhancement preprocessing.
- 2026-05-05 CSMA comparator status: official GitHub repo `https://github.com/AminaSagymbayeva/CSMA_WoundHealing` was cloned locally to `sample_imagej_apps/CSMA_WoundHealing/`. It includes `CSMA_WoundHealingTool-0.1.0.jar`, `src/main/resources/environment.yml`, `requirements_win.txt`, Python processing scripts, and sample dataset. README: install ImageJ + Anaconda, create conda env with `conda env create -f environment.yml` (env name `ImageJCSMA`), then install the jar from ImageJ `Plugins > Install`. Plugin menu entry is `Plugins > CSMA Wound Healing Tool`. License is MIT; citation DOI listed as `10.1109/ACCESS.2025.3561607`.
- 2026-05-05 CSMA plugin patch: ImageJ plugin initially wrote stack paths like `A1new_0.jpegnull`, so Python silently failed. Patched `sample_imagej_apps/CSMA_WoundHealing/src/main/java/kz/nu/edu/mechbiolab/imagej/PathWriter.java` to resolve slice labels safely and strip trailing `null`. Built `CSMA_WoundHealingTool-0.1.0-patched.jar` using OpenJDK 8 installed into conda env `ImageJCSMA`. Installed patched jar over `C:\Users\Zekeriya\Downloads\Compressed\ij154-win-java8\ImageJ\plugins\CSMA_WoundHealingTool-0.1.0.jar`; original backup is `CSMA_WoundHealingTool-0.1.0.original.bak`.
- 2026-05-05 CSMA active-stack patch: CSMA was also reading every open ImageJ image window, so a newly opened sequence could reuse/contaminate the previous sequence/output. `PathWriter.java` was patched again to use only `WindowManager.getCurrentImage()` instead of iterating `WindowManager.getIDList()`. Rebuilt and reinstalled the patched jar. Usage rule remains: click the intended image stack window before running `Plugins > CSMA Wound Healing Tool`; close old output windows when switching datasets.
- 2026-05-05 clean comparator set: created `validation_sets/comparator_clean/` as the new clean working folder. PNG image sets: `images_png/csma_sample_49` (49), `images_png/whad_mcf7_48` (48), `images_png/whad_mcf10a_33` (33), and `images_png/local_phone_9/HK`, `/M8F`, `/MK` (each 0h/24h/48h). Use these PNGs for WHST, CSMA, and Cytomove where possible. Result folders: `results/whst`, `results/csma`, `results/cytomove`, `results/manual_reference`, `results/qc_notes`. Files: `manifest.csv`, `comparator_results_template.csv`, `cleanup_candidates.csv`, `README.md`. Do not delete raw/reference image folders; root cleanup candidates were only listed, not removed.
- 2026-05-05 MCF10A ordering fix: `validation_sets/comparator_clean/images_png/whad_mcf10a_33` was reordered per user instruction. New frames `001-021` correspond to the old `013-033`/4hrs sequence, then new `022-033` correspond to old `001-012`/27hrs sequence. `manifest.csv` and `comparator_results_template.csv` were updated with `reordered_from_old_index=...` notes.
- 2026-05-05 CSMA native result import: user added CSMA outputs under `validation_sets/comparator_clean/results/csma/results_area` and `results_width`. CSVs are valid: `quantification_by_area_raw_data.csv` and `quantification_by_width_raw_data.csv`. Created merged table `results/csma/csma_sample_49_area_width_merged.csv` keyed as `csma_sample_49_001..049`; visual QC status `pass_on_native_csma_sample`.
- 2026-05-05 WHST subset: created `validation_sets/comparator_clean/images_png/csma_sample_11/` for representative WHST measurement from CSMA native sample frames 001, 002, 003, 010, 015, 020, 025, 035, 040, 045, 049. File names include source frame (`csma_sample_11_01_from_001.png`, etc.). Added `csma_sample_11_manifest.csv` and appended rows to clean comparator `manifest.csv` / `comparator_results_template.csv`.
- 2026-05-05 WHST result import: user added `validation_sets/comparator_clean/results/whst/csma_sample_11_whst_Results.xlsx`. Normalized it to `results/whst/csma_sample_11_whst_results_normalized.csv` and combined with CSMA subset values into `results/csma_sample_11_whst_csma_comparison_template.csv`. This comparison table is ready for Cytomove columns.
- 2026-05-05 CSMA 11 native run: user also generated CSMA output directly under `images_png/csma_sample_11/results_area` and `results_width`. These differ slightly from extracting 11 points from the 49-frame run because CSMA uses sequential masks. Copied them to `results/csma/csma_sample_11_native_run/`, created `results/csma/csma_sample_11_area_width_native_run.csv`, and updated `results/csma_sample_11_whst_csma_comparison_template.csv` to use the native 11-frame CSMA values.
- 2026-05-07 WHAD MCF7-11 validation plan: user will validate `validation_sets/comparator_clean/images_png/whad_mcf7_11` with WHST only because CSMA failed visually on non-native image sets. Existing WHST workbook `results/whst/whad_mcf7_11/whad_mcf7_11_whst_Results.xlsx` currently has labels 1-11 but blank measurement cells. Created `results/whad_mcf7_11_whst_cytomove_comparison_template.xlsx` with 11 rows, WHST columns, Cytomove columns, and difference/error formulas. Keep CSMA limited to `csma_sample_11` in first validation.
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
- `afe30ee` Group PNG ZIP export flow fix: missing full-resolution overlays are prepared automatically before download
- `43c7d57` Soft deploy: root landing, `prototype_refactor/`, legacy redirect, old prototype archive

---

## Aktif Dosyalar

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `index.html` | Canlı ✅ | Prototype-focused landing, status section, feedback form, canvas animation, OG meta |
| `ROADMAP.md` | v0.5 ✅ | Soft deploy + private feedback round durumu işlendi |
| `README.md` | ✅ | GitHub ana sayfası |
| `AGENT_BRIEF.md` | v1.2 ✅ | Bu dosya |
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
| `prototype_refactor/` | Canlı ✅ | Aktif browser lab: split JS/CSS, collapsible panel, group review, manual correction, CSV/Excel/PNG, Plots ZIP, Group PNG ZIP |
| `prototype/index.html` | Redirect ✅ | Eski URL'yi `prototype_refactor/` yoluna yönlendirir |
| `old/prototype/index.html` | Arşiv ✅ | Önceki büyük tek dosyalı prototip |
| `scripts/serve_prototype_refactor.py` | Local dev ✅ | Root landing + prototype routes için `127.0.0.1:8768` helper server |

---

## Tasarım Dili

- **Ton:** Hafif akademik SaaS — ne karanlık startup, ne de klinikal soğuk.
- **Renkler:** `--bg: #f7faf9`, `--paper: #ffffff`, `--teal: #0f9f8f`
- **Canvas animasyonu:** IIFE yapısı, `BG = '#f8fbfa'`, `prefers-reduced-motion` desteği var.
- **İddia dili dikkat:** "Tüm veriler local" → sadece assay görüntüleri için doğru (feedback email/message Formspree'ye gider).
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
| Preprint manuscript: tek source-of-truth submission build (2026-06-01) | 7 dağınık taslak yerine literatür-formatında tek docx; eskiler `docs/old/manuscript_drafts/`'e arşivlendi |
| MAPE QC çerçevesinde geri eklendi (2026-06-01) | Sadece Pearson r zayıf; MAPE+median+max birlikte, near-closure inflasyonu açıkça yazıldı; "göze sokma" tonu korundu |
| Venue: temkinli bio-preprint → bioRxiv şimdi (2026-06-01) | n=31/tek comparator IEEE teknik makalesi için yetersiz; teknik/IEEE sürümü Faz 3'e ertelendi |
| WHAD/CAMAD atıfı düzeltildi: Iheme et al. 2024 (2026-06-01) | Placeholder "Sarmad" yanlıştı; Zenodo 12806149'dan doğrulandı (v1.0.0-alpha, CC BY 4.0) |
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
- [x] Aktif prototip soft-deployed: `prototype_refactor/`
- [x] Manuel düzeltme arayüzü prototipi: add/fill/erase/clean/undo/reset var; bilimsel validation ve UX polish devam ediyor
- [x] Prototype git commit + Cloudflare Pages soft deploy
- [ ] Canlı/lokal performans profili

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
1. `toGray()` — BT.709/sRGB luminance (0.2126R + 0.7152G + 0.0722B) [NOT BT.601; BT.601 olsaydı 0.299/0.587/0.114 olurdu]
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
- Threshold offset range is now `-100` to `+100`; current presets remain in the useful observed negative band, while the wider range supports difficult phase/brightfield sets and broader auto-calibration candidates.
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
