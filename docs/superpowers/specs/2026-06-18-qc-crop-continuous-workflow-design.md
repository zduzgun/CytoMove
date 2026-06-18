# Cytomove QC Crop Continuous Workflow Design

## Summary

Image QC crop akışı seri incelemeyi hızlandıracak şekilde devamlı çalışır:

- Crop kaydedilen görüntü, kırpılmış haliyle önizlenir.
- Sonraki görüntüye otomatik geçildiğinde önceki crop oranı başlangıç şablonu olarak uygulanır.
- Yeni görüntü `Adjust crop` modu açık olarak yüklenir.
- Kullanıcı crop sınırlarını gerektiğinde düzenleyip kaydederek seride ilerler.
- Son görüntü kaydedildiğinde otomatik geçiş yapılmaz ve kırpılmış önizleme ekranda kalır.

## Interaction Flow

1. Kullanıcı bir görüntüde `Adjust crop` modunu açar.
2. Crop sınırlarını düzenler ve `Save crop` düğmesine basar.
3. Crop oranı aktif görüntünün image-level QC state'ine kaydedilir.
4. Kaydedilen görüntüde overlay kapanır ve yalnız kırpılmış görüntü gösterilir.
5. Seride sonraki görüntü varsa uygulama otomatik olarak ona geçer.
6. Sonraki görüntü, grup içindeki en son kaydedilmiş crop oranıyla açılır.
7. `Adjust crop` modu otomatik etkinleşir; crop overlay'i görünür ve düzenlenebilir olur.
8. Son görüntü kaydedilirse uygulama görüntü değiştirmez. Overlay kapanır ve son görüntünün kırpılmış önizlemesi kalır.

## Crop State Rules

- Her görüntünün kaydedilmiş crop'u kendi `imageQcState` kaydında tutulur.
- Kaydedilmiş image-level crop, grup crop şablonundan her zaman önceliklidir.
- Grubun son kaydedilmiş crop oranı yalnız henüz crop'u kaydedilmemiş görüntüler için başlangıç şablonudur.
- Otomatik geçiş, sonraki görüntünün crop'unu kaydedilmiş saymaz.
- Kullanıcı sonraki görüntüde `Save crop` yapana kadar crop yalnız düzenlenebilir çalışma durumudur.
- Kullanıcı önceki bir görüntüye dönerse o görüntünün kendi kaydedilmiş crop'u yüklenir.

## Preview Behavior

QC canvas iki görünüm destekler:

- Adjust modu açıkken ham görüntü ve düzenlenebilir crop overlay'i gösterilir.
- Adjust modu kapalıyken kaydedilmiş crop varsa canvas yalnız crop bölgesini gösterir.

Crop önizlemesi metadata üzerinden yeniden üretilir. Her görüntü için tam çözünürlüklü kalıcı bitmap tutulmaz.

## Navigation Behavior

- Kaydetme sonrası otomatik geçiş yalnız geçerli görüntünün ardından başka bir görüntü varsa yapılır.
- Son görüntüden ilk görüntüye otomatik döngü yapılmaz.
- Manuel `Previous` ve `Next` gezinmesi mevcut davranışı korur.
- Otomatik geçişle açılan görüntü adjust modunda başlar.
- Manuel gezinmeyle açılan görüntü, kendi kaydedilmiş durumunu normal önizleme olarak gösterir; otomatik adjust yalnız crop-kaydetme zincirinde kullanılır.

## Error Handling

- Crop hazırlama başarısız olursa mevcut görüntü ve adjust modu korunur.
- Otomatik geçiş yapılmaz.
- `Save crop` yeniden etkinleştirilir ve hata log alanında gösterilir.
- Geçersiz crop oranı sonraki görüntüye uygulanmaz; güvenli varsayılan crop oluşturulur.

## Testing

- Kaydedilen crop'un overlay kapandıktan sonra kırpılmış önizleme verdiği doğrulanır.
- Orta görüntü kaydedilince sonraki görüntünün aynı crop oranı ve açık adjust moduyla geldiği doğrulanır.
- Sonraki görüntü kaydedilmeden image-level `cropSaved` durumunun değişmediği doğrulanır.
- Son görüntü kaydedilince görüntünün değişmediği ve kırpılmış önizlemenin kaldığı doğrulanır.
- Önceki görüntüye dönülünce kendi kaydedilmiş crop'unun geri geldiği doğrulanır.
- Crop hazırlama hatasında otomatik geçiş yapılmadığı doğrulanır.

## Acceptance Criteria

- Kaydedilmiş görüntü QC'de kırpılmış haliyle görünür.
- Otomatik açılan sonraki görüntü aynı crop oranıyla adjust modunda gelir.
- Her görüntünün crop'u ayrı kaydedilir.
- Son görüntüde otomatik geçiş veya başa sarma olmaz.
- Analysis girdisi mevcut image-level crop metadata'sını kullanmaya devam eder.
