# Cytomove Yol Haritası

> Hücre biyologları için tarayıcıda çalışan, atıf-hazır wound healing analiz aracı.

**Durum:** Lansman öncesi | **Son güncelleme:** 2026-04-28 | **Sürüm:** v0.4

---

## Vizyon

Cytomove, web tarayıcısında çalışan otomatik scratch assay (wound healing) analiz aracıdır. Hücre göçü ve yara kapanması ölçümlerini saniyeler içinde, yayına hazır figürler ve methods paragrafıyla birlikte üretir.

**Uzun vadede:** Cytomove başarısı doğrulandıktan sonra, bir üst marka çatısı altında ek hücre biyolojisi analiz modülleri (koloni sayma, transwell migration, MTT viability, hücre sayma) eklenebilir. Üst marka kararı Faz 5'te alınacaktır; şu an tek ürüne odaklanılır.

## Misyon

Manuel ImageJ tabanlı scratch ölçüm iş akışını; yayına hazır figürler, tekrarlanabilir methods metni ve Zenodo DOI ile sürümlenmiş atıf bloğu üreten tek tıklık bir web aracıyla değiştirmek.

## Kuzey Yıldızı Metriği

**Üç ayda yayımlanan makalelerde Cytomove atıfı sayısı.**

---

## Stratejik İlkeler

1. **Atıf büyüme motorudur.** Her analiz çıktısı; methods paragrafı, DOI ve sürüm numarasıyla birlikte gelir. Cytomove kullanan her makale yeni kullanıcı kapısı açar.
2. **Önce tarayıcı, sonra sunucu.** OpenCV.js ve WASM ile istemci tarafında çalışılır. Gizlilik tasarımdan gelir, düşük ölçekte sunucu maliyeti sıfırdır.
3. **Önce kama, sonra genişleme.** Cytomove kategori lideri konumuna ulaşmadan ikinci ürün başlatılmaz. Üst marka kararı dahi sonraya bırakıldı.
4. **Tek kurucu + YZ.** Mimari, kapsam ve takvim; modern YZ araçlarıyla çalışan tek bir geliştiriciye göre kurgulanmıştır.
5. **Açıkta inşa.** Yol haritası açık, ürün kodu private kalır.
6. **Araştırmacı öncelikli fiyatlama.** Ücretsiz katman tam analiz için kullanılabilir. Ücretli katmanlar iş akışı kolaylıkları (toplu analiz, geçmiş, ekip) açar; analiz kalitesi değişmez.

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

**Hedef:** Yayında landing page, marka kimliği, ilk 50 waitlist kaydı.

**Çıktılar:**
- [x] Domain alındı: cytomove.com (Cloudflare Registrar, 2027-04-26'ya kadar, auto-renew aktif)
- [ ] Cytomove.app ve cytomove.io savunma domainleri (opsiyonel, bütçeye göre)
- [x] GitHub public repo oluşturuldu: github.com/zduzgun/CytoMove
- [x] Cloudflare Pages üzerinde landing page yayında (cytomove.pages.dev → cytomove.com propagation devam ediyor)
- [x] E-posta waitlist formu (Formspree ücretsiz tier, ileride Supabase'e taşınır)
- [ ] Marka kimliği (logo, renk paleti, tipografi)
- [ ] X/Twitter + LinkedIn varlığı
- [ ] İlk halka açık blog yazısı: "Neden Cytomove'u inşa ediyorum"
- [x] Bu yol haritası GitHub'da yayında
- [ ] Landing page'e "scientific trust layer" eklendi:
  - "Built by a cell biologist" kısa notu (kurucu biyografisi)
  - "Privacy-first: assay images stay in browser" güven notu
  - Planned validation bölümü veya blog yazısında teknik niyet

**Teknik öğrenme hedefleri:**
- Next.js 14 temelleri
- Tailwind CSS temelleri
- Cursor + Claude geliştirme akışı
- Cloudflare Pages + DNS (registrar zaten Cloudflare, otomatik bağlanır)

**KPI'lar:**
- Landing page yayında: evet/hayır
- Waitlist kaydı: 50+
- Cytomove hakkında kişisel sosyal paylaşım: 5+

**Kapsam dışı:** Analiz mantığı, ödeme, kullanıcı hesabı.

---

### Faz 2: MVP - Tek Zaman Noktası Analizi + Validation Verisi (Ay 3-5)

**Hedef:** Tamamen tarayıcıda çalışan, kullanılabilir scratch assay analiz aracı + akademik validation veri seti.

**Ürün çıktıları:**
- [ ] Görüntü yükleme bileşeni (sürükle-bırak, çoklu dosya)
- [ ] OpenCV.js scratch tespiti (segmentasyon)
- [ ] Yara kapanma yüzdesi hesabı
- [ ] Segmentasyon manuel düzeltme arayüzü
- [ ] Yan yana görselleştirme (orijinal vs algılanan maske)
- [ ] Dışa aktarma: PNG figür + CSV veri
- [ ] Beta test kullanıcı programı (kişisel ağdan 5-10 akademisyen)
- [ ] Yapılandırılmış geri bildirim döngüsü (Notion / Tally)

**Akademik çıktılar (preprint hazırlığı için):**
- [ ] Validation veri seti: kendi laboratuvarından 20-30 scratch assay görüntüsü
- [ ] Ground truth: aynı görüntülerin ImageJ ile manuel ölçümü
- [ ] Karşılaştırma analizi: TScratch, ImageJ MRI Wound Healing macro, Wimasis vs Cytomove
- [ ] İstatistiksel doğrulama: Pearson r, Bland-Altman, intra-class correlation
- [ ] Reproducibility testi: aynı görüntü farklı tarayıcılarda aynı sonuç verir mi
- [ ] Validation dataset lisansı netleşti: CC BY 4.0 (sadece derived masks/measurements; ham görüntü hakları ayrıca değerlendirilir)
- [ ] Validation dataset metadata formatı belirlendi (görüntü kaynağı, hücre tipi, mikroskop, kontrast bilgisi)

**Tech stack eklemeleri:**
- OpenCV.js
- HTML Canvas API
- Recharts veya D3 (görselleştirme)

**KPI'lar:**
- 5+ aktif beta test kullanıcısı
- Ortalama analiz süresi: <30 saniye / görüntü
- Validation veri seti hazır ve paylaşıma uygun
- Waitlist: 150+

**Kapsam dışı:** Time-lapse, kullanıcı hesapları, ödemeler, PDF rapor.

---

### Faz 3: Time-lapse + Atıf-Hazır Raporlar + bioRxiv Preprint (Ay 6-9)

**Hedef:** Time-lapse pipeline'ı, yayına hazır tam çıktı, ilk akademik yayın.

**Ürün çıktıları:**
- [ ] Çoklu zaman noktası yükleme + kronolojik sıralama arayüzü
- [ ] Görüntü registration (zaman noktaları arası hizalama)
- [ ] Kapanma hızı hesabı (μm/saat, μm²/saat)
- [ ] Kapanma eğrisi grafiği (zamana göre % kapanma)
- [ ] Önce/sonra overlay figürü
- [ ] Zaman noktası karşılaştırma ızgarası
- [ ] PDF rapor üretici:
  - Methods paragrafı (makaleye yapıştırmaya hazır)
  - Sürümlenmiş atıf bloğu (Zenodo DOI Cytomove yazılım sürümüne ait; her kullanıcı analizine ayrı DOI verilmez)
  - Görüntü başına nicelendirme tablosu
  - Kalite uyarıları (hizalama güveni, segmentasyon uyarıları)
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
- Next.js 14 + TypeScript
- Tailwind CSS
- OpenCV.js (tarayıcıda görüntü işleme)
- Cloudflare Pages (hosting, ücretsiz tier)
- Cloudflare Registrar (domain, cytomove.com)
- Cloudflare R2 (depolama, Faz 3+)
- Supabase (auth + database, Faz 4+)
- Cursor + Claude (geliştirme akışı)
- GitHub (versiyon kontrolü, private repo)
- Formspree (Faz 1 e-posta toplama, ücretsiz tier)
- Zenodo (DOI / sürümleme)

**Gelecek:**
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
| Büyük mikroskop görüntülerinde OpenCV.js performansı | Orta | Orta | Tarayıcıda yeniden boyutlandırma / parçalı işleme; gerekirse sunucu yedek |
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
| 2026-04 | Browser-first mimari (OpenCV.js) | Gizlilik + maliyet + ölçek; sunucu sadece şart olduğunda |
| 2026-04 | Vercel yerine Cloudflare Pages | Vercel boykotu; CF + R2 + Workers entegre |
| 2026-04 | Tek kurucu, ortak yok | YZ araçları yeterli; pay korunur; ekip ileride hibe ile |
| 2026-04 | Wound healing kama ürün olarak seçildi | Tüm hücre biyolojisi laboratuvarlarında ortak; net pain point |
| 2026-04 | TÜSEB Cytomove için tercih edilmedi | Yanlış program (araştırma vs ürün); IP karışıklığı |
| 2026-04 | Üst marka kararı Faz 5'e ertelendi | Tek ürün odak; çatı kararı erken; "önce kama, sonra genişleme" |
| 2026-04 | Ürün adı: Cytomove | Cellova (Cellova Lifesciences + Cellova Group çakışma), Cellhane ("kerhane" çağrışımı) elendikten sonra; .com mevcut, fonksiyonel açıklayıcı |
| 2026-04 | Domain: cytomove.com (Cloudflare Registrar) | Sıf