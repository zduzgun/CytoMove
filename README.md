# Cytomove

> Hücre biyologları için tarayıcıda çalışan, gizlilik odaklı wound healing analiz aracı.

Cytomove, scratch assay / wound healing görüntülerinde yara alanı ölçümünü daha tekrarlanabilir hale getirmek için geliştirilen gizlilik odaklı bir web aracıdır. Amaç; manuel ImageJ tabanlı ölçüm iş akışına, figure-ready export ve tekrarlanabilir methods metni üreten daha hızlı bir tarayıcı alternatifi sunmaktır.

## Mevcut Durum

Cytomove lansman öncesi geliştirme aşamasındadır.

- Landing page yayında: [cytomove.com](https://cytomove.com) / [cytomove.pages.dev](https://cytomove.pages.dev)
- Waitlist aktif.
- MVP hedefi: tek zaman noktası scratch assay analizi.
- Ürün kodu şimdilik private geliştiriliyor; yol haritası ve stratejik kararlar burada açık tutuluyor.

## Neden Var?

Hücre biyolojisi laboratuvarlarında wound healing analizi hâlâ çoğu zaman manuel, tekrarı zor ve makale çıktısına dönüştürmesi zahmetli iş akışlarıyla yapılıyor. Cytomove bu iş akışını üç noktada iyileştirmeyi hedefler:

- **Tarayıcıda analiz:** Assay görüntüleri bilgisayardan ayrılmadan işlenir.
- **Figure-ready çıktı:** PNG figür, CSV veri ve methods metni üretmeyi hedefler.
- **Tekrarlanabilirlik:** Analiz sürümü ve ayarları atıf bloğuyla birlikte raporlanır.

## Planlanan MVP

İlk MVP, tek zaman noktası scratch assay görüntülerini analiz etmeye odaklanır:

- Görüntü yükleme
- Otomatik wound area segmentasyonu
- Wound area ölçümü ve validation sonrası closure readout
- Segmentasyon sonucunu gözden geçirme ve manuel düzeltme
- PNG figür ve CSV veri dışa aktarma

MVP başarı kriterleri `ROADMAP.md` içinde tanımlanmıştır. Temel doğrulama hedefi, Cytomove ölçümlerinin ImageJ manuel ölçümleriyle yüksek korelasyon göstermesidir.

## Yol Haritası

Detaylı 18 aylık plan için: [ROADMAP.md](./ROADMAP.md)

Kısa özet:

- **Faz 1:** Minimum credible landing, waitlist, temel güven katmanı
- **Faz 2:** Tek zaman noktası MVP ve validation veri seti
- **Faz 3:** Time-lapse analiz, citation-ready raporlar, bioRxiv preprint
- **Faz 4:** Kullanıcı hesapları, ücretli planlar, peer-reviewed yayın
- **Faz 5:** Şirketleşme, fonlama, trademark ve üst marka kararı

Uzun vadede Cytomove başarısı doğrulandıktan sonra ek hücre biyolojisi analiz modülleri düşünülebilir. Şu an odak yalnızca wound healing analizidir.

## Araştırmacılar İçin

Erken erişim ve beta duyuruları için waitlist'e katılabilirsin:

[Join the waitlist](https://cytomove.com)

Geri bildirim, veri seti önerileri veya akademik iş birliği fikirleri için GitHub Issues ya da e-posta kullanılabilir.

## Kurucu

[Dr. Zekeriya Düzgün](https://github.com/zduzgun)  
Giresun Üniversitesi Tıp Fakültesi, Tıbbi Biyoloji Anabilim Dalı.

## Lisans

Bu repodaki dokümantasyon, yol haritası ve karar kayıtları [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) lisansı altındadır.

Cytomove ürün kodu source-available ve ticari olmayan akademik/eğitim/araştırma kullanımı için yayımlanacaktır. Public kod lisansı PolyForm Noncommercial License 1.0.0 modelini izler; ticari kullanım public lisans altında kullanılamaz ve ayrı yazılı ticari lisans gerektirir. Ayrıntı için [LICENSE](./LICENSE) ve [LICENSING_STRATEGY.md](./LICENSING_STRATEGY.md) dosyalarına bak.

---

*Cytomove açıkta inşa ediliyor; çünkü araştırmacı geri bildirimi ürünün doğruluğu kadar önemlidir.*
