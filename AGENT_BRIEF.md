# AGENT_BRIEF.md — Cytomove Operasyonel Hafıza
<!-- Her oturuma bu dosyayı okuyarak başla. README.md ve ROADMAP.md ile birlikte kullan. -->

**Son güncelleme:** 2026-04-28  
**Versiyon:** 0.2

---

## Standart Başlangıç Rutini

Yeni oturumda şu sırayla ilerle:

1. `git status` — yerel değişiklik var mı kontrol et
2. Bu dosyayı oku (`AGENT_BRIEF.md`) — operasyonel durum
3. `ROADMAP.md` — stratejik plan (büyük karar gerekiyorsa)
4. `README.md` — public proje özeti (metin/tanıtım işi varsa)
5. `index.html` — sadece landing page kodu değişecekse
6. Kullanıcıya sor: *"Son oturumdan bu yana değişen bir şey var mı?"*

**⚠️ Asla:** `github_token.txt` veya herhangi bir token içeren dosyayı stage/commit etme.

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

**Faz 1 — Büyük ölçüde tamamlandı** (birkaç açık madde var, aşağıya bak)

**Faz 2 — Henüz başlamadı**  
MVP: tek zaman noktası scratch assay analizi (client-side segmentasyon).  
Başarı kriterleri: Pearson r > 0.9, <10% wound area error, 70%+ kullanıcı kabul oranı.

---

## Canlı Durum (2026-04-28 itibarıyla)

- ✅ Cloudflare Pages deploy aktif
- ✅ cytomove.com custom domain (propagasyon tamamlandı)
- ✅ Light tema landing page yayında (iki sütun hero, ürün kartı)
- ✅ Canvas wound healing animasyonu çalışıyor
- ✅ Formspree waitlist çalışıyor (inbox'a geliyor, spam değil)
- ✅ GitHub repo public: `github.com/zduzgun/CytoMove`

---

## Son Commitler

- `94f00df` README dosyası Cytomove odağına taşındı
- `3ea021a` ROADMAP kesilen son bölümü tamamlandı
- `2d85f03` Landing page bilimsel ürün tasarımına taşındı
- `e3cb468` Canlı sayfada kesilen JS sonu tamamlandı
- `77f4d93` Canvas animasyonu IIFE yapısına alındı, görsel güçlendirildi

---

## Aktif Dosyalar

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `index.html` | Canlı ✅ | Light theme, iki sütun hero, canvas animasyonu |
| `ROADMAP.md` | v0.4 ✅ | 18 aylık 5 fazlı plan |
| `README.md` | ✅ | GitHub ana sayfası |
| `AGENT_BRIEF.md` | v0.2 ✅ | Bu dosya |

---

## Tasarım Dili

- **Ton:** Hafif akademik SaaS — ne karanlık startup, ne de klinikal soğuk.
- **Renkler:** `--bg: #f7faf9`, `--paper: #ffffff`, `--teal: #0f9f8f`
- **Canvas animasyonu:** IIFE yapısı, `BG = '#f8fbfa'`, `prefers-reduced-motion` desteği var.
- **İddia dili dikkat:** "Tüm veriler local" → sadece assay görüntüleri için doğru (waitlist email Formspree'ye gider).
- **ImageJ referansı:** "Replacement" deme, "alternative" de.

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

---

## Bilinen Sorunlar / Eksikler ⚠️

- `og:image` meta tag eksik — sosyal medya paylaşım önizlemesi çalışmıyor
- Scientific trust layer tam değil — landing page'e metodoloji/doğruluk notu eklenmeli
- Logo / marka kimliği henüz yok
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
- [ ] `og:image` meta tag ekle
- [ ] Landing page'e scientific trust layer ekle
- [ ] Logo / marka kimliği oluştur
- [ ] Twitter/X ve LinkedIn hesabı aç
- [ ] İlk blog yazısı: "Why wound healing analysis needs a browser-native tool"

### Faz 2 — Başlangıç
- [ ] Validation dataset topla (CC BY 4.0 lisanslı scratch assay görüntüleri)
- [ ] Client-side segmentasyon algoritması prototip
- [ ] Manuel düzeltme arayüzü tasarımı

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
