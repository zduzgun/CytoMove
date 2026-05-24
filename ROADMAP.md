# Cytomove Yol Haritası

> Hücre biyologları için tarayıcıda çalışan, atıf-hazır wound healing analiz aracı.

**Durum:** Soft deploy / private feedback öncesi | **Son güncelleme:** 2026-05-24 | **Sürüm:** v0.6

---

## Vizyon

Cytomove, web tarayıcısında çalışan otomatik scratch assay (wound healing) analiz aracıdır. Hedefi, hücre göçü ve yara alanı ölçümlerini temkinli, tekrarlanabilir ve dışa aktarılabilir bir araştırma iş akışına dönüştürmektir.

**Uzun vadede:** Cytomove başarısı doğrulandıktan sonra, bir üst marka çatısı altında ek hücre biyolojisi analiz modülleri (koloni sayma, transwell migration, MTT viability, hücre sayma) eklenebilir. Üst marka kararı Faz 5'te alınacaktır; şu an tek ürüne odaklanılır.

## Misyon

Manuel ImageJ tabanlı scratch ölçüm iş akışına; tarayıcıda çalışan ölçüm, gözden geçirilebilir segmentasyon, figure-ready export, tekrarlanabilir methods metni ve sürümlenmiş atıf bilgisiyle güçlü bir alternatif sunmak.

## Kuzey Yıldızı Metriği

**Üç ayda yayımlanan makalelerde Cytomove atıfı sayısı.**

---

## Güncel Ürün Durumu (2026-05-24)

Cytomove artık sadece waitlist/landing aşamasında değil. Soft deploy yayında:

- `https://cytomove.com` aktif.
- `www.cytomove.com` DNS yapılandırıldı.
- Ana sayfa web app-first olacak şekilde sadeleştirildi: birincil CTA `Open Web App`, Desktop Alpha ise request-only tester hattı; public beta iddiası yapılmıyor.
- Feedback/suggestion formu e-posta ile çalışıyor.
- Kullanılabilir prototip `prototype_refactor/` altında yayında.
- Eski `prototype/` yolu yeni prototipe yönlendiriyor.
- Prototipte single image, local multi-image group review, manual correction, CSV/Excel, plot ZIP ve Group PNG ZIP export mevcut.
- Desktop Alpha hattı başlatıldı: çalışan web prototipinin Electron tabanlı yerel uygulama kopyası `desktop_alpha/` altında. Web sürümüne alternatif değil; büyük dosya/grup iş akışları ve ileride lisanslı modüller için deney alanı.
- Desktop Alpha 0.1 ürün kararı: tam ücretsiz, zorunlu giriş yok. E-posta/kayıt şimdilik opsiyonel feedback ve güncelleme kanalı olarak kalır. 10 günlük trial veya mail aktivasyonu private beta / ücretli modül aşamasına ertelenir.
- Güncel landing page, web app'i ana public yol olarak konumlandırır ve gerçek web app yeteneklerini listeler: local image input, single/group review, segmentation controls, area/width metrics, mask/contour review, manual correction, QC guidance, plots, PNG/CSV/Excel/ZIP export ve browser-local image handling.
- SEO temeli başlatıldı: root title/meta "wound healing scratch assay analysis" arama niyetine hizalandı; `wound-healing-scratch-assay-analysis/` rehber sayfası, `robots.txt` ve `sitemap.xml` eklendi. Sonraki adım Google Search Console doğrulaması ve sitemap submit.
- Desktop Alpha tester dağıtımı installer yerine portable ZIP ile yapılır. `npm run pack:win` ZIP üretir ve `TESTER_README.txt` ekler; public installer/code signing sonraya bırakılır.
- Abonelik yönü: iskelet baştan kurulur ama ücretli kapı Alpha 0.1'de açılmaz. Plan dili Free Alpha / Academic / Commercial olarak hazırlanır; ödeme, 10 günlük trial ve lisans kontrolü private beta veya doğrulanmış ücretli modül aşamasında devreye alınır.
- Public beta değil. Doğru sonraki adım: 3-5 güvenilir kullanıcıyla "prototype feedback round".
- Bilinen teknik borç: canlı performans lokale göre yavaş hissediliyor; Faz 2 içinde performans profili ve Web Worker/cache değerlendirmesi yapılmalı.

---

## Stratejik İlkeler

1. **Atıf büyüme motorudur.** Her analiz çıktısı; methods paragrafı, DOI ve sürüm numarasıyla birlikte gelir. Cytomove kullanan her makale yeni kullanıcı kapısı açar.
2. **Önce tarayıcı, sonra sunucu.** OpenCV.js ve WASM ile istemci tarafında çalışılır. Gizlilik tasarımdan gelir, düşük ölçekte sunucu maliyeti sıfırdır.
3. **Önce kama, sonra genişleme.** Cytomove kategori lideri konumuna ulaşmadan ikinci ürün başlatılmaz. Üst marka kararı dahi sonraya bırakıldı.
4. **Tek kurucu + YZ.** Mimari, kapsam ve takvim; modern YZ araçlarıyla çalışan tek bir geliştiriciye göre kurgulanmıştır.
5. **Açıkta inşa.** Yol haritası açık, ürün kodu private kalır.
6. **Araştırmacı öncelikli fiyatlama.** Ücretsiz katman tam analiz için kullanılabilir. Ücretli katmanlar iş akışı kolaylıkları (toplu analiz, geçmiş, ekip) açar; analiz kalitesi değişmez.
7. **Core free, pro kontrollü.** Desktop core analiz offline-friendly kalır. Ücretli modüller başladığında lisans/account kontrolü sadece Pro özelliklere uygulanır; internet yoksa kısa grace period verilir, temel analiz kilitlenmez.

---

## MVP Başarı Tanımı

MVP, kullanıcıların tek zaman noktası scratch assay görüntülerinde ImageJ'e yakın sonuç alabildiği, sonucu manuel düzeltebildiği ve PNG/CSV olarak dışa aktarabildiği sürümdür.

**Başarı kriterleri:**
- 5 beta kullanıcının en az 3'ü kendi verisiyle tekrar kullanmak istiyor
- Validation setinde Cytomove vs ImageJ manuel ölçüm: **Pearson r > 0.9**
- Ortalama alan ölçüm hatası: **< %10 wound area**
- Kullanıcının manuel düzeltme yapmadan kabul ettiği analiz oranı: **%70+**
- Manuel düzeltme sonrası kabul oranı: **%90+**
- Ortalama analiz süresi: **< 30 saniye / görüntü**

Bu kriterler karşılanmadan Faz 3'e geçilmez.

---

## Fazlar

### Faz 1: Temel Atma (Ay 1-2)

**Hedef:** Yayında ve güvenilir landing page, feedback kanalı, temel marka zemini; tam marka/sosyal/blog işleri beta launch hazırlığına bırakılır.

**Çıktılar:**
- [x] Domain alındı: cytomove.com (Cloudflare Registrar, 2027-04-26'ya kadar, auto-renew aktif)
- [ ] Cytomove.app ve cytomove.io savunma domainleri (opsiyonel, bütçeye göre)
- [x] GitHub public repo oluşturuldu: github.com/zduzgun/CytoMove
- [x] Cloudflare Pages üzerinde landing page yayında (`cytomove.pages.dev` + `cytomove.com`)
- [x] `www.cytomove.com` DNS yapılandırıldı
- [x] E-posta feedback/suggestion formu (Formspree ücretsiz tier, ileride Supabase'e taşınır)
- [ ] Marka kimliği (logo, renk paleti, tipografi) — beta launch hazırlığına ertelendi
- [ ] X/Twitter + LinkedIn varlığı — beta launch hazırlığına ertelendi
- [ ] İlk halka açık blog yazısı: "Neden Cytomove'u inşa ediyorum" — beta launch hazırlığına ertelendi
- [x] Bu yol haritası GitHub'da yayında
- [x] Landing page'e "scientific trust layer" eklendi:
  - "Built by a cell biologist" kısa notu (kurucu biyografisi)
  - "Privacy-first: assay images stay in browser" güven notu
  - Planned validation / ImageJ-manual comparison niyeti
- [x] Sosyal medya önizlemesi için `og:image` / `twitter:image` eklendi (`assets/og-image.png`)

**Teknik öğrenme hedefleri:**
- Next.js 14 temelleri
- Tailwind CSS temelleri
- Cursor + Claude geliştirme akışı
- Cloudflare Pages + DNS (registrar zaten Cloudflare, otomatik bağlanır)

**KPI'lar:**
- Landing page yayında: evet
- Feedback form mesajı: ilk gerçek kullanıcı sinyalleri
- Cytomove hakkında kişisel sosyal paylaşım: 5+

**Kapsam dışı:** Analiz mantığı, ödeme, kullanıcı hesabı.

---

### Faz 2: MVP - Tek Zaman Noktası Analizi + Validation Verisi (Ay 3-5)

**Hedef:** Tamamen tarayıcıda çalışan, kullanılabilir scratch assay analiz aracı + akademik validation veri seti + küçük private feedback round.

**Ürün çıktıları:**
- [x] Görüntü yükleme bileşeni (sürükle-bırak, çoklu dosya)
- [x] Pure JS scratch segmentation prototype (OpenCV.js yerine zero-dependency Canvas/typed-array pipeline)
- [x] Binary wound mask üzerinden area metrics: wound area, area fraction, field area
- [x] Horizontal width profile extraction: mean/median/SD/CV/min/max width, valid row count/fraction
- [ ] Yara kapanma yüzdesi hesabı: area-based closure ve width-based closure birlikte
- [x] Basic QC warnings: crop-dependent area fraction, low valid row fraction, area-vs-width discordance, fragmented mask, manual correction
- [x] CSV/Excel report schema: per-image area + width metrics, warnings, recommended primary metric, settings snapshot
- [x] Preview/export resolution strategy v1: group previews downsample for speed; Group PNG ZIP re-runs/prepares full-resolution overlays before download.
- [ ] Synthetic binary mask generator + exact geometric tests: clean masks icin wound area, width profile, valid row count/fraction ve closure hesaplari 0 toleransla dogrulanir.
- [ ] Synthetic crop robustness validation: ayni wound mask uzerinde farkli crop/FOV senaryolari olustur; area fraction hassasiyeti ile mean/median width stabilitesini karsilastir.
- [ ] Validation tolerance policy: binary synthetic tests = 0 tolerance; realistic synthetic tests = predefined low tolerance; real microscopy tests = expert/manual agreement.
- [ ] First-wave real-image validation panel: WHAD/CAMAD primary professional time-lapse set, CSMA public comparator set, selected local phone/eyepiece usability subset; RQSA deferred to later robustness/stress validation.
- [ ] Public raw dataset storage: keep large/raw images under ignored `validation_ref_sets/raw/`, not project root or git. Commit only metadata, scripts, small derived panels, and documentation.
- [x] Segmentasyon manuel düzeltme arayüzü
- [x] Görselleştirme: contour/mask view, group cards, plot preview modal
- [x] Dışa aktarma: PNG overlay, Group PNG ZIP, Plots ZIP, CSV, Excel
- [ ] Performance profile: live vs local load time, analysis time, group render time, export time, cache headers, Web Worker feasibility
- [x] Desktop Alpha 0.1 deney hattı: mevcut çalışan prototip Electron app olarak paketlendi; web sürüme dokunmadan lokal exe üretildi.
- [x] Desktop web-link manifest katmanı: `desktop-manifest.json` ile update/module/status mesajı okunur; Feedback/Account/Updates linkleri siteye yönlenir; görüntü/analiz verisi gönderilmez.
- [x] Abonelik iskeleti kararı: Free Alpha aktif; Academic ve Commercial planları manifest/roadmap düzeyinde planlandı, ödeme/lisans enforce edilmiyor.
- [ ] Opsiyonel e-posta kayıt akışı: Alpha 0.2 için, zorunlu login olmadan feedback/update signup. App içinden veya web formuna yönlendirme ile başlar.
- [ ] Private feedback round (3-5 güvenilir kullanıcı; public beta dili kullanılmadan)
- [ ] Yapılandırılmış geri bildirim döngüsü (Formspree feedback + kısa takip notları; gerekirse Notion/Tally)

**Akademik çıktılar (preprint hazırlığı için):**
- [ ] Validation veri seti: public professional WHAD/CAMAD + CSMA comparator + selected local phone/eyepiece images
- [ ] Ground truth: aynı görüntülerin ImageJ ile manuel ölçümü
- [ ] Karşılaştırma analizi: TScratch, ImageJ MRI Wound Healing macro, Wimasis vs Cytomove
- [ ] İstatistiksel doğrulama: Pearson r, Bland-Altman, intra-class correlation
- [ ] Reproducibility testi: aynı görüntü farklı tarayıcılarda aynı sonuç verir mi
- [x] Validation dataset lisansı netleşti: Tier 1 arşiv CC BY 4.0; raw image redistribution published subset için açık, unpublished subset için co-author consent bekliyor
- [x] Validation dataset metadata formatı belirlendi ve `docs/validation-inventory.csv` üretildi (442 satır)

**Tech stack eklemeleri:**
- HTML Canvas API + typed arrays
- OpenCV.js yalnızca Faz 3+ registration/advanced processing gerekirse yeniden değerlendirilecek
- Recharts veya D3 (görselleştirme)

**KPI'lar:**
- 3-5 private feedback kullanıcısı
- Ortalama analiz süresi: <30 saniye / görüntü
- Validation veri seti hazır ve paylaşıma uygun
- Feedback formundan nitelikli sorun/istek sinyali

**Kapsam dışı:** Time-lapse, kullanıcı hesapları, ödemeler, PDF rapor.

---

### Faz 3: Time-lapse + Atıf-Hazır Raporlar + bioRxiv Preprint (Ay 6-9)

**Hedef:** Time-lapse pipeline'ı, yayına hazır tam çıktı, ilk akademik yayın.

**Ürün çıktıları:**
- [ ] Çoklu zaman noktası yükleme + kronolojik sıralama arayüzü
- [ ] Görüntü registration (zaman noktaları arası hizalama)
- [ ] Kapanma hızı hesabı: width-based (μm/saat) ve area-based (μm²/saat) birlikte
- [ ] Kapanma eğrisi grafiği (zamana göre % kapanma)
- [ ] Local width profile plot
- [ ] Realistic synthetic microscopy-like image generator: noise, blur, uneven illumination, low contrast, debris, compression ve edge irregularity perturbasyonlari.
- [ ] Synthetic time-series validation: 0/6/12/24 h gibi bilinen gap width ve closure degerleriyle area-based ve width-based closure hesaplarini test et.
- [ ] Region-wise closure analysis (üst/orta/alt segmentler)
- [ ] Better handling of fragmented masks and robust outlier trimming for scanline widths
- [ ] Recommended primary metric logic: crop/FOV tutarsızsa width-based closure öner
- [ ] Önce/sonra overlay figürü
- [ ] Zaman noktası karşılaştırma ızgarası
- [ ] PDF rapor üretici:
  - Methods paragrafı (makaleye yapıştırmaya hazır)
  - Sürümlenmiş atıf bloğu (Zenodo DOI Cytomove yazılım sürümüne ait; her kullanıcı analizine ayrı DOI verilmez)
  - Görüntü başına nicelendirme tablosu
  - Kalite uyarıları (hizalama güveni, segmentasyon uyarıları)
- [ ] Faz 3+ algoritma: wound axis detection ve tilted/curved scratches için axis'e dik width measurement
- [ ] Validation experiment: aynı wound mask üzerinde yapay crop perturbation ile area fraction vs mean width robustness karşılaştırması
- [ ] Zenodo entegrasyonu (sürüm arşivleme)
- [ ] İlk DOI alındı (v1.0.0)

**Akademik çıktılar:**
- [ ] **bioRxiv preprint atıldı** (Ay 8 hedefi)
  - Başlık adayı: "Cytomove: A browser-based, privacy-preserving tool for automated wound healing assay quantification"
  - 8-12 sayfa, IMRAD yapısı
  - GitHub link, cytomove.com URL, Zenodo DOI v1.0.0
  - DOI 3-5 günde online
- [ ] Cross-listing: arXiv (cs.CV) ek olarak yüklendi (opsiyonel ama atıf için faydalı)
- [ ] ResearchGate, ORCID, kişisel akademik web sayfasına eklendi
- [ ] Türk akademik X/Twitter topluluğunda paylaşım

**Tech stack eklemeleri:**
- jsPDF (PDF üretimi)
- Image registration kütüphanesi (tarayıcı uyumlu)
- Zenodo API

**KPI'lar:**
- 50+ aktif aylık kullanıcı
- bioRxiv preprint yayınlandı
- DOI v1.0.0 yayımlandı
- Time-lapse analiz süresi: <2 dakika / veri seti
- İlk preprint atıfı (Ay 12 hedefi)

**Kapsam dışı:** Ödeme, gelişmiş kullanıcı hesabı.

---

### Faz 4: Büyüme + Gelirlendirme + Peer-Reviewed Yayın (Ay 10-15)

**Hedef:** İlk ücretli müşteri, sürdürülebilir kullanıcı büyümesi, peer-reviewed makale.

**Ürün çıktıları:**
- [ ] Kullanıcı hesapları (Supabase Auth)
- [ ] Proje geçmişi / kayıtlı analizler
- [ ] Fiyatlama sayfası lansmanı (3 katman):
  - **Free:** sınırsız tek zaman noktası, ayda 3 time-lapse projesi
  - **Researcher ($9/ay):** sınırsız time-lapse, geçmiş, batch
  - **Lab ($29/ay):** ekip koltukları, paylaşılan projeler
  - *(Institution/SSO katmanı Faz 5'e ertelendi — erken enterprise karmaşıklığı önlendi)*
- [ ] Ödeme entegrasyonu: Paddle (uluslararası) + Iyzico (Türkiye)
- [ ] E-posta bildirimleri (Resend)
- [ ] Yardım dokümanları sitesi (Mintlify / Docusaurus)
- [ ] Atıf takipçisi (Cytomove kullanan makaleler)
- [ ] Teknokent şirket evrakı hazırlığı

**Akademik çıktılar:**
- [ ] **Peer-reviewed dergi başvurusu** (Ay 14-15)
  - Birinci tercih: **Bioinformatics** (Oxford, Q1, Application Notes formatı, 4 sayfa)
  - İkinci tercih: **BMC Bioinformatics** (Q1, software tools track)
  - Üçüncü tercih: **Journal of Open Source Software (JOSS)** (ücretsiz, hızlı, GitHub-based review, doçentlik portföyüne uygun)
  - Dördüncü tercih: **SoftwareX** (Elsevier, Q2)
- [ ] Preprint atıflarını dergi başvurusunda göster (traksiyon kanıtı)
- [ ] Doçentlik portföyüne "yazılım/araç geliştirme" başlığı altında ekle

**Tech stack eklemeleri:**
- Supabase (Auth + Database)
- Cloudflare R2 (kullanıcı dosya depolama)
- Paddle / Iyzico
- Resend (transactional e-posta)

**KPI'lar:**
- 200-500 aktif aylık kullanıcı
- 5-10 atıf (preprint + erken kullanıcı yayınları)
- Peer-reviewed makale gönderildi (Ay 15) veya kabul edildi (Ay 16-18)
- İlk ücretli müşteri
- Ay 15'te $500-2000 MRR
- 3+ "Lab" katmanı müşteri

**Kapsam dışı:** İkinci ürün modülü.

---

### Faz 5: Ölçeklenme + Fonlama + Üst Marka Kararı (Ay 16-18)

**Hedef:** Şirketleşme, BiGG başvurusu, ikinci ürün konseptinin doğrulanması, üst marka kararı.

**Çıktılar:**
- [ ] Teknokent şirketi kuruldu (öncelik Giresun Teknopark, yedek Trabzon)
- [ ] Vergi kurulumu: uluslararası SaaS geliri için KDV istisnası, %80 gelir/kurumlar vergisi indirimi
- [ ] 1812 BiGG Yatırım başvurusu yapıldı
- [ ] KOSGEB Ar-Ge İnovasyon başvurusu (paralel)
- [ ] Cytomove trademark ön araştırması (USPTO TESS + TÜRKPATENT)
- [ ] Trademark formal başvurusu (Class 9 ve 42)
- [ ] **Üst marka kararı verildi** (multi-modül vizyonu için)
  - Senaryolar: Cytomove tek üründe kalır, veya yeni bir çatı marka seçilir
  - Adaylar (eğer yeni marka): Türk-bilim köprüsü adayları yeniden değerlendirilir
- [ ] İkinci modül konsepti seçildi (adaylar: koloni sayma, MTT viability, transwell migration, hücre sayma)
- [ ] Modül 2 için kullanıcı araştırması (20+ görüşme)
- [ ] Modül 2 prototip başlangıcı

**KPI'lar:**
- Şirket kuruldu
- Güçlü traksiyon verisiyle BiGG başvurusu yapıldı
- 500+ aktif kullanıcı
- $2000-5000 MRR
- Doçentlik dosyasına Cytomove makalesi + atıfları eklendi
- Trademark başvurusu yapıldı

---

## Tech Stack

**Onaylı:**
- Static HTML/CSS/JavaScript for current landing + prototype
- HTML Canvas API + typed arrays for current browser image processing
- Cloudflare Pages (hosting, ücretsiz tier)
- Cloudflare Registrar (domain, cytomove.com)
- Cloudflare R2 (depolama, Faz 3+)
- Supabase (auth + database, Faz 4+)
- Cursor + Claude (geliştirme akışı)
- GitHub (versiyon kontrolü, private repo)
- Formspree (Faz 1 e-posta toplama, ücretsiz tier)
- Zenodo (DOI / sürümleme)

**Gelecek:**
- Next.js 14 + TypeScript (SaaS/app shell gerektiğinde)
- Tailwind CSS (framework tabanlı uygulamaya geçilirse)
- OpenCV.js (registration veya advanced processing gerçekten gerekirse)
- Python FastAPI backend (v2+ ML ağırlıklı modüller için)
- Paddle (uluslararası SaaS için Merchant of Record)
- Iyzico (Türkiye ödemeleri)
- Sentry (hata izleme)
- Plausible Analytics (gizlilik dostu)
- Resend (transactional e-posta)

**Bilinçli olarak kullanılmayanlar:**
- Vercel (boykot)
- Stripe (Türkiye'de mevcut değil)
- GoDaddy (yüksek yenileme fiyatları, agresif upsell)
- MVP için ağır backend bağımlılıkları

---

## Akademik Strateji

Cytomove iki amaçlı bir akademik proje: **ürünü atıfla büyüten** + **doçentlik portföyüne katkı sağlayan**.

### Yayın zamanlaması

| Faz | Akademik aktivite | Format |
|-----|-------------------|--------|
| 2 | Validation veri seti + karşılaştırma analizi | İç hazırlık |
| 3 | bioRxiv preprint | Açık erişim, ücretsiz, hızlı |
| 3 | Cross-listing arXiv (cs.CV) | Opsiyonel, atıf için |
| 4 | Peer-reviewed dergi başvurusu | Bioinformatics > BMC Bioinformatics > JOSS > SoftwareX |
| 5+ | Update makaleleri (yeni özellikler, validation) | İhtiyaca göre |

### Dergi seçim mantığı

- **Bioinformatics (Oxford):** En prestijli tool dergi, Application Notes formatı 4 sayfa, IF ~5-6, selektif. İdeal hedef.
- **BMC Bioinformatics:** Q1, kabul oranı daha yüksek, software tool track.
- **JOSS:** Ücretsiz, hızlı, GitHub-based review. Yeni nesil tool publication. Doçentlik portföyüne uygun (yazılım atıfları sayılır).
- **SoftwareX:** Elsevier, Q2, yedek seçenek.

### Atıf büyüme motoru

Her PDF rapora otomatik methods paragrafı + DOI + sürüm gömülecek. Akademisyen Cytomove kullanırsa makalesinin methods kısmında otomatik atıf cümlesi oluşacak. Atıf zinciri: preprint atıfları → peer-reviewed makale atıfları → ürün organik büyüme.

### Doçentlik bağlantısı

- Cytomove publication "yazılım/araç geliştirme" başlığı altında doçentlik portföyüne girer.
- Cytomove makalesini alıntılayan her makale Web of Science ve Scopus'ta atıf sayısını artırır.
- Mart 2026 doçentlik döngüsü Cytomove publication zamanlamasından önce, ama sonraki döngüler için pozisyon güçlü.

---

## Fonlama Stratejisi

| Faz | Fon kaynağı | Yaklaşık tutar |
|-----|-------------|----------------|
| 1-3 | Öz kaynak | ~300-450 USD (ilk yıl) |
| 4 | İlk gelir + öz kaynak | MRR + birikim |
| 5 | KOSGEB Ar-Ge İnovasyon | ~750K TL'ye kadar |
| 5+ | 1812 BiGG Yatırım | ~1,35M TL (%3 hisse) |
| 5+ | Teknokent vergi muafiyetleri | dolaylı, zamanla ciddi tutarda |
| Sonrası | Gelir + seçici hibeler | sürdürülebilir büyüme |

**Bilinçli olarak kullanılmayanlar:**
- TÜSEB (araştırma hibesi, ticari ürün fonu değil; IP karışıklığı riski)
- Gelir öncesi VC (bu aşamada erken ve dilutif)

**İlk yıl maliyet kalemi:**
- Domain (cytomove.com): ~10 USD
- Cursor (geliştirme): aylık abonelik, opsiyonel ücretsiz alternatif
- Cloudflare Pages: 0 USD (ücretsiz tier yetiyor)
- Formspree: 0 USD (50 e-posta/ay)
- GitHub: 0 USD (private repo ücretsiz hesapla)
- Toplam: ~300-450 USD (Cursor dahil), ~10 USD (Cursor olmadan)

---

## Hukuki ve Fikri Mülkiyet Stratejisi

- **Şirket öncesi dönem:** Tüm IP kişisel; geliştirme kişisel zamanda, kişisel donanımda. Cytomove koduna veya altyapısına üniversite kaynağı dahil edilmez.
- **Şirketleşme tetikleyicisi:** Hangisi önce gelirse, ilk sürdürülebilir MRR veya BiGG kabulü.
- **Şirket yapısı:** Teknokent A.Ş. (anonim şirket; ileride yatırım uyumu için limited'den daha temiz).
- **Vergi yapısı hedefi:**
  - Hizmet ihracatı KDV istisnası (uluslararası gelirde %0 KDV, KDV Kanunu 11/1-a)
  - %80 gelir/kurumlar vergisi indirimi (7491 sayılı Kanun, beyanname tarihine kadar TR banka hesabına döviz getirme şartı)
  - Teknokent muafiyetleri (kurumlar vergisi muafiyeti, personel SGK indirimi)
- **Fatura kuralı:** "Software Development Services" (Consultancy değil, istisnaya girmez).
- **Banka:** Vergi istisnası için doğrudan TR IBAN'a döviz girişi şart; Wise/Payoneer bakiyeleri uygun değil.
- **Trademark stratejisi:** Faz 5'te formal başvuru. USPTO Class 9 (yazılım) ve 42 (SaaS hizmet). Ön araştırma USPTO TESS + TÜRKPATENT'te ücretsiz yapılır.

---

## Riskler

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| Tek kurucu zaman kısıtı (akademisyen + aile + doçentlik) | Yüksek | Yüksek | Sıkı kapsam, YZ aracı, erken özellik yok, haftalık gözden geçirme |
| Yerleşik rakipler (Incucyte, ImageJ ekosistemi, TScratch) | Orta | Orta | Atıf-büyüme farklılaştırıcı; özellik yarışı yok |
| Cytomove ↔ CytoMotion (IonOptix) trademark çakışma riski | Orta | Orta | Faz 5 formal başvuruda gerekirse "Cytomove Pro" gibi modifiye, veya çatı marka altında jenerik tanım olarak bırak |
| Hücre biyolojisi nişi tek kurucu SaaS için küçük | Orta | Yüksek | Çoklu modül vizyonu Faz 5 sonrasında genişler |
| Doçentlik süreci dikkat dağıtması | Yüksek | Orta | 18 aylık takvim akademik takvimle hizalı |
| Büyük mikroskop görüntülerinde tarayıcı performansı | Orta | Orta | Preview downsample, full-resolution export'u kontrollü tetikle, Web Worker/cache profiling; gerekirse sunucu yedek |
| Türkiye ödeme sürtünmesi (global kullanıcı) | Orta | Orta | Paddle MoR uluslararası tarafı çözer; Iyzico TR için |
| YZ hype döngüsü fiyatlama baskısı | Düşük | Orta | Atıf hendeği dayanıklı, YZ ile kolay yer değiştirilemez |
| Validation veri yetersizliği (preprint için) | Orta | Orta | Faz 2'de validation veri toplama paralel yürütülür, kendi laboratuvar arşivi öncelikli |
| Segmentasyon çeşitliliği riski (farklı mikroskop, kontrast, hücre tipi, scratch kalitesi) | Yüksek | Yüksek | Validation setini çeşitli koşulları kapsayacak şekilde topla; MVP başarı kriterlerinde farklı görüntü tiplerini test et |
| Akademik iddia riski ("ImageJ alternative" dili validation öncesi güçlü algılanabilir) | Orta | Orta | Validation tamamlanana kadar "designed to complement ImageJ workflows" tonu koru; güçlü karşılaştırma iddialarını preprint'e ertele |

---

## Karar Günlüğü

Önemli mimari ve strateji kararları burada kaydedilir.

| Tarih | Karar | Gerekçe |
|-------|-------|---------|
| 2026-04 | Browser-first mimari | Gizlilik + maliyet + ölçek; sunucu sadece şart olduğunda |
| 2026-04 | Pure JS / Canvas prototip yaklaşımı | OpenCV.js/WASM indirme ve init gecikmesi MVP prototipi için gereksiz; typed arrays yeterli |
| 2026-04 | Vercel yerine Cloudflare Pages | Vercel boykotu; CF + R2 + Workers entegre |
| 2026-04 | Tek kurucu, ortak yok | YZ araçları yeterli; pay korunur; ekip ileride hibe ile |
| 2026-04 | Wound healing kama ürün olarak seçildi | Tüm hücre biyolojisi laboratuvarlarında ortak; net pain point |
| 2026-04 | TÜSEB Cytomove için tercih edilmedi | Yanlış program (araştırma vs ürün); IP karışıklığı |
| 2026-04 | Üst marka kararı Faz 5'e ertelendi | Tek ürün odak; çatı kararı erken; "önce kama, sonra genişleme" |
| 2026-04 | Ürün adı: Cytomove | Cellova (Cellova Lifesciences + Cellova Group çakışma), Cellhane ("kerhane" çağrışımı) elendikten sonra; .com mevcut, fonksiyonel açıklayıcı |
| 2026-04 | Domain: cytomove.com (Cloudflare Registrar) | Sıfır markup, ekosistem entegrasyonu, otomatik HTTPS, 2027 nisan'a kadar tescil edildi, auto-renew aktif |
| 2026-04 | Trademark başvurusu Faz 5'e ertelendi | Önce traksiyon; CytoMotion (IonOptix) ile yakınlık var, gerekirse modifiye edilir |
| 2026-04 | Akademik strateji: bioRxiv preprint Faz 3 → peer-reviewed Faz 4 | Atıf büyümesi erken başlasın, peer review ürün olgunlaştığında |
| 2026-04 | Hosting: GitHub Pages değil Cloudflare Pages | Registrar zaten Cloudflare; private repo deploy ücretsiz; global CDN; ileride Workers entegrasyonu |
| 2026-04-28 | Coming soon landing page yayına alındı | Wound healing animasyonlu, waitlist formlu; cytomove.pages.dev canlı, cytomove.com propagation bekliyor |
| 2026-04-28 | Waitlist: Formspree ücretsiz tier | İlk 2 kayıt alındı; ileride Supabase'e taşınacak |
| 2026-04-28 | Faz 1 kapanışı: Minimum Credible Landing | OG image, scientific trust layer ve temkinli claim dili tamamlandı; logo/sosyal/blog beta launch hazırlığına ertelendi |
| 2026-04-29 | Validation inventory generated | 442-image Tier 1 archive inventoried; metadata CSV + coverage summary produced; per-image ImageJ re-measurement remains required |
| 2026-05-24 | Soft deploy başlatıldı | `cytomove.com` prototipe yönlenen sade landing ile yayında; feedback formu çalışıyor; public beta değil, küçük private feedback round hedefleniyor |
| 2026-05-24 | Prototip klasör yapısı güncellendi | Aktif prototip `prototype_refactor/`; eski `prototype/` redirect; önceki tek dosyalı prototip `old/prototype/` arşivinde |
| 2026-05-24 | Group PNG ZIP export düzeltildi | Eksik full-resolution overlay varsa buton otomatik hazırlar ve sonra ZIP indirir; `Plots ZIP` ayrı çalışır |
| 2026-05-24 | Performans teknik borcu kaydedildi | Canlı prototip lokale göre yavaş hissediliyor; sonraki Faz 2 işi sistematik performans profili ve Web Worker/cache değerlendirmesi |
| 2026-05-24 | Landing page web app-first sadeleştirildi | Ana CTA `Open Web App`; Desktop Alpha request-only hatta alındı; web app yetenekleri net listelendi. |
| 2026-05-24 | Desktop Alpha tester paketi ZIP olarak seçildi | Installer/code signing sonraya bırakıldı; güvenilir testçiler için portable ZIP ve `TESTER_README.txt` yeterli. |
| 2026-05-24 | SEO foundation başlatıldı | Root title/meta hedef keyword'e hizalandı; ilk wound healing scratch assay analysis rehberi, robots.txt ve sitemap.xml eklendi. |

---

## Tempo

- **Haftalık:** Faz çıktılarına göre kişisel ilerleme gözden geçirme.
- **Aylık:** Bu yol haritasını güncelle, kararları kaydet, KPI'ları gözden geçir.
- **Üç aylık:** Stratejik gözden geçirme; doğru fazda mıyız, öncelikler kaymalı mı?
- **Yıllık:** Bir yıllık birikmiş kullanıcı öğrenmesiyle yol haritasını sıfırdan yaz.

---

## Açık Sorular

- [x] ~~Domain seçimi: cellverse.app vs .io vs .bio~~ → cytomove.com alındı
- [ ] Cytomove.app ve cytomove.io savunma domainleri alınsın mı (toplam ~50 USD)
- [x] Landing page ilk dili: sadece İngilizce (global)
- [x] Marka tonu: akademik SaaS; klinik/kurumsal değil, startup oyunculuğu da değil
- [ ] İlk kullanıcı kazanım kanalı: X akademik biyoloji topluluğu, LinkedIn, doğrudan PI e-posta gönderimi?
- [ ] Analiz kütüphanesi (npm paketi) SaaS'tan ayrı open-source verilsin mi?
- [x] Validation veri seti: Tier 1 Düzgün lab arşivi initial set için yeterli; üçüncü hücre hattı / formal kamera için public dataset opsiyonel
- [ ] Preprint cross-listing (bioRxiv + arXiv cs.CV) yapılsın mı?
- [ ] Modül 2 adayı (Faz 5): hangisi mevcut kullanıcılarla en hızlı doğrulanır?
- [ ] Üst marka kararı: Cytomove tek ürün mü kalır, yoksa Faz 5'te yeni çatı marka mı seçilir?

---

*Bu yol haritası yaşayan bir belgedir. Gerçek kullanıcılardan öğrendikçe planlar güncellenir.*
