# Cytomove

> Hücre biyologları için tarayıcıda çalışan, atıf-hazır wound healing analiz aracı.

Cytomove, scratch assay / wound healing görüntülerinde yara kapanmasını ölçmek için geliştirilen gizlilik odaklı bir web aracıdır. Amaç; manuel ImageJ tabanlı ölçüm iş akışını, yayına hazır figürler ve tekrarlanabilir methods metni üreten daha hızlı bir tarayıcı deneyimiyle değiştirmektir.

## Mevcut Durum

Cytomove lansman öncesi geliştirme aşamasındadır.

- Landing page yayında: [cytomove.com](https://cytomove.com) / [cytomove.pages.dev](https://cytomove.pages.dev)
- Waitlist aktif.
- MVP hedefi: tek zaman noktası scratch assay analizi.
- Ürün kodu şimdilik private geliştiriliyor; yol haritası ve stratejik kararlar burada açık tutuluyor.

## Neden Var?

Hücre biyolojisi laboratuvarlarında wound healing analizi hâlâ çoğu zaman manuel, tekrarı zor ve makale çıktısına dönüştürmesi zahmetli iş akışlarıyla yapılıyor. Cytomove bu iş akışını üç noktada iyileştirmeyi hedefler:

- **Tarayıcıda analiz:** Assay görüntüleri bilgisayardan ayrılmadan işlenir.
- **Yayın hazır çıktı:** PNG figür, CSV veri ve methods metni üretir.
- **Tekrarlanabilirlik:** Analiz sürümü ve ayarları atıf bloğuyla birlikte raporlanır.

## Planlanan MVP

İlk MVP, tek zaman noktası scratch assay görüntülerini analiz etmeye odaklanır:

- Görüntü yükleme
- Otomatik wound area segmentasyonu
- `% wound closure` hesabı
- Segmentasyon sonucunu gözden geçirme ve manuel düzeltme
- PNG figür ve CSV veri dışa aktarma

MVP başarı kriterleri `ROADMAP.md` içinde tanımlanmıştır. Temel doğrulama hedefi, Cytomove ölçümlerinin ImageJ manuel ölçümleriyle yüksek korelasyon göstermesidir.

## Yol Haritası

Detaylı 18 aylık plan için: [ROADMAP.md](./ROADMAP.md)

Kısa özet:

- **Faz 1:** Landing page, waitlist, marka temeli
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

Ürün kodunun lisansı ayrıca belirlenecektir.

---

*Cytomove açıkta inşa ediliyor; çünkü araştırmacı geri bildirimi ürünün doğruluğu kadar önemlidir.*
