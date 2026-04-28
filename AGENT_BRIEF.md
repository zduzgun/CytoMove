# AGENT_BRIEF.md — Cytomove Operasyonel Hafıza
<!-- Her oturuma bu dosyayı okuyarak başla. README.md ve ROADMAP.md ile birlikte kullan. -->

**Son güncelleme:** 2026-04-28  
**Versiyon:** 0.1

---

## Proje Özeti

**Cytomove** — tarayıcıda çalışan, gizlilik odaklı scratch assay (wound healing) analiz aracı.  
Hedef kullanıcı: hücre biyolojisi araştırmacıları.  
Anahtar fark: görüntüler sunucuya gönderilmez, analiz tamamen client-side çalışır.

- **Web:** [cytomove.com](https://cytomove.com) / [cytomove.pages.dev](https://cytomove.pages.dev)
- **GitHub:** [github.com/zduzgun/CytoMove](https://github.com/zduzgun/CytoMove)
- **Deploy:** Cloudflare Pages (static HTML, doğrudan GitHub entegrasyonu)
- **Waitlist:** Formspree `mdayrwqe` → zekeriya.duzgun@giresun.edu.tr

---

## Mevcut Faz

**Faz 1 — Tamamlandı ✅**  
Landing page yayında, waitlist aktif, GitHub + Cloudflare Pages bağlı.

**Faz 2 — Henüz başlamadı**  
MVP: tek zaman noktası scratch assay analizi (client-side segmentasyon).  
Başarı kriterleri: Pearson r > 0.9, <10% wound area error, 70%+ kullanıcı kabul oranı.

---

## Aktif Dosyalar

| Dosya | Durum | Notlar |
|-------|-------|--------|
| `index.html` | Canlı ✅ | Light theme, iki sütun hero, canvas animasyonu |
| `ROADMAP.md` | v0.4 ✅ | 18 aylık 5 fazlı plan |
| `README.md` | ✅ | GitHub ana sayfası |
| `AGENT_BRIEF.md` | Bu dosya | Operasyonel hafıza |

---

## Tasarım Dili

- **Ton:** Hafif akademik SaaS — ne karanlık startup, ne de klinikal soğuk.
- **Renkler:** `--bg: #f7faf9`, `--paper: #ffffff`, `--teal: #0f9f8f`
- **Canvas animasyonu:** IIFE yapısı, `BG = '#f8fbfa'`, `prefers-reduced-motion` desteği var.
- **İddia dili:** Dikkatli ol. "Tüm veriler local" → sadece assay görüntüleri için geçerli (waitlist email Formspree'ye gider).
- **ImageJ referansı:** "Replacement" deme, "alternative" de.

---

## Son Alınan Kararlar

| Karar | Gerekçe |
|-------|---------|
| Closure rate metriği yok (henüz) | MVP olmadan closure rate iddiası erken |
| Zenodo DOI, analiz başına değil versiyon başına | Mevcut pratik ile uyumlu |
| Institution tier şimdilik yok | Faz 5'e ertelendi |
| Pricing: Free / Researcher $9 / Lab $29 | Akademik pazara uygun |
| Validation dataset lisansı: CC BY 4.0 | Açık bilim ilkesiyle uyumlu |

---

## Yapılmayacaklar ⛔

- **GitHub token'ı asla dosyaya veya koda yazma.** Git history'e düşerse repo public olsa bile revoke et.
- Institution pricing tier'ını Faz 5'ten önce ekleme.
- "Tüm verileriniz lokal" gibi kapsamlı gizlilik iddiası yapma — email Formspree'ye gidiyor.
- Closure rate'i MVP olmadan landing page'e koyma.
- Cloudflare Worker oluşturma — Pages kullanılıyor (statik HTML deploy).
- `index.html`'i dark tema'ya çevirme.

---

## Bekleyen Görevler

### Faz 1 — Tamamlanmamış Kalanlar
- [ ] Canvas animasyonunun production'da çalıştığını doğrula (light theme sonrası test edilmedi)
- [ ] `og:image` meta tag ekle (sosyal medya paylaşım önizlemesi için)
- [ ] Logo / marka kimliği oluştur
- [ ] Twitter/X ve LinkedIn hesabı aç
- [ ] İlk blog yazısı: "Why wound healing analysis needs a browser-native tool"
- [ ] Landing page'e scientific trust layer ekle (atıf, metodoloji, doğruluk notu)

### Faz 2 — Başlangıç
- [ ] Validation dataset topla (CC BY 4.0 lisanslı scratch assay görüntüleri)
- [ ] Client-side segmentasyon algoritması prototip
- [ ] Manuel düzeltme arayüzü tasarımı

---

## Teknik Notlar

### Git / GitHub
- Repo: `https://github.com/zduzgun/CytoMove`
- Branch: `main`
- Deploy: Cloudflare Pages, GitHub entegrasyonu ile otomatik (main push → deploy)
- PAT izinleri: Contents read/write + Metadata read-only (fine-grained)
- **Token asla kod içine yazılmaz.** Sadece bash environment variable olarak kullanılır.

### Cloudflare Pages
- Proje adı: `cytomove` (cytomove.pages.dev)
- Custom domain: `cytomove.com` (DNS propagasyonu tamamlanmış olmalı)
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
Canvas animasyonu siyah görünüyorsa: `BG` değişkenini kontrol et, `ctx.fillRect` ile açıkça background çizildiğinden emin ol.

### Formspree
- Form ID: `mdayrwqe`
- Action: `https://formspree.io/f/mdayrwqe`
- Kendi emailin ile test gönderimi spam kutusuna düşebilir — bu normal.

---

## Agent Handoff Protokolü

Yeni oturuma başlarken şu sırayla oku:
1. `AGENT_BRIEF.md` (bu dosya) — operasyonel durum
2. `ROADMAP.md` — stratejik plan
3. `index.html` — sadece kod değişikliği yapılacaksa

Ardından kullanıcıya şunu sor: *"Son oturumdan bu yana değişen bir şey var mı?"*

---

## Kurucu

Dr. Zekeriya Düzgün — Giresun Üniversitesi Tıp Fakültesi, Tıbbi Biyoloji ABD  
zekeriya.duzgun@giresun.edu.tr
