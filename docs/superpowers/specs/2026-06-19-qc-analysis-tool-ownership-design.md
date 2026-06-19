# Cytomove QC and Analysis Tool Ownership Design

## Summary

Cytomove görüntü hazırlama ve analiz parametrelerini kesin sınırlarla ayırır:

1. `Image QC`: analiz girdisini hazırlar.
2. `Analysis`: kilitlenmiş QC girdisi üzerinde segmentasyon ve ölçüm yapar.
3. `Publication Figure Builder`: analiz sonuçlarından yayın figürü üretir.

Geometri hazırlama araçlarının tek sahibi Image QC olur. Analysis tarafındaki eşdeğer kontroller kaldırılır ve yerlerine salt okunur QC input özeti gelir. Publication Builder içindeki validation-set yükleyicisi normal kullanıcı arayüzünden çıkarılır; yalnız geliştirici/QA bağlamında görünür.

## Product Decisions

### Validation Set Loader

`Validation set` seçimi ve `Load validation set` düğmesi normal Builder kullanıcısına gösterilmez.

Nedenleri:

- Bu araç gerçek kullanıcı verisiyle figür üretme akışının parçası değildir.
- Kaynak görüntüler `validation_sets/` altında yerel ve Git tarafından ignore edilen QA verileridir.
- Yayınlanan uygulamada dosyalar bulunmadığında fetch işlemi başarısız olur.
- Builder panelinde görünmesi ürünü test veya demo ekranı gibi gösterir.

Araç yalnız şu koşullardan biri sağlandığında görünür:

- uygulama `localhost` veya `127.0.0.1` üzerinde çalışıyorsa
- URL'de `?validation=1` parametresi varsa

Normal kullanıcı akışı yalnız analiz edilmiş grupları seçer, Preview üretir ve Builder ZIP dışa aktarır.

Gelecekte başlangıç ekranında yer alabilecek `Try with sample data` özelliği ayrı bir kullanıcı özelliği olarak tasarlanmalıdır. Geliştirici validation loader'ı doğrudan başlangıç ekranına taşınmaz.

### Tool Ownership

Image QC analizden önce görüntüye uygulanan tüm geometri kararlarını yönetir:

- Scratch orientation
- 90 derece rotate
- Fine rotation
- Angle ruler
- Auto crop FOV
- Adjust crop
- Save crop
- Reset crop
- Exclude from analysis

Analysis yalnız algoritmik segmentasyon ve sonuç inceleme kontrollerini yönetir:

- Presets
- Variance radius
- Threshold
- Min component
- Tiny island handling
- Microscope mode
- FOV cutoff
- View style
- Manual mask correction
- Metrics
- Export

`FOV cutoff` Analysis'te kalır. Bu değer yalnız görsel crop değildir; brightfield segmentasyonunda geçerli analiz alanını belirleyen algoritmik bir eşiktir.

## Hybrid QC Geometry Model

Hybrid model görüntü bazlı state'i korur fakat seri incelemesini hızlandırır:

- Her görüntünün orientation, rotation, fine rotation, crop ve exclude durumu ayrı saklanır.
- Kaydedilen crop oranı, henüz crop'u kaydedilmemiş sonraki görüntüye düzenlenebilir başlangıç şablonu olur.
- Sonraki görüntünün crop'u kullanıcı kaydedene kadar image-level kayıt sayılmaz.
- Önceki görüntüye dönülünce o görüntünün kendi kayıtlı crop'u yüklenir.
- Son görüntüde kaydetme sonrası otomatik başa sarma yapılmaz.

Toplu crop davranışı için ayrı ve çakışan iki kontrol bulunmaz.

Kaldırılacak kontroller:

- Analysis: `Apply current crop ratio to group`
- Image QC: `Copy crop to all images`

Bu iki kontrolün yerine save-driven crop-template akışı kullanılır.

## QC State Model

Her image QC kaydı şu alanları taşır:

- `orientation`
- `rotation`
- `fineRotation`
- `cropRatio`
- `cropSaved`
- `autoCropFov`
- `excluded`
- `editedAt`

Grup düzeyinde yalnız son crop başlangıç şablonu tutulur:

- `lastQcCropTemplateByGroup[groupId]`

Analysis başladığında bu state locked snapshot'a kopyalanır. Analysis sonuçları üretildikten sonra QC state değişirse yeni analiz gerekir.

## Image QC Interface

QC araç alanı aşağıdaki sırayla düzenlenir:

### Orientation and Rotation

- Scratch orientation select
- Rotate left
- Rotate right
- Fine rotation slider and numeric value
- Show/hide angle ruler

### Crop

- Auto crop FOV
- Adjust crop
- Save crop
- Reset crop

### Navigation and State

- Undo/redo crop
- Previous/next image
- Exclude from analysis
- Continue to Analysis

`Copy crop to all images` gösterilmez.

Fine rotation ve angle ruler mevcut QC preview/canvas üzerinde çalışır. Rotation değeri metadata olarak kaydedilir; her image için ayrı korunur.

## Analysis Interface

Analysis içindeki `Advanced Geometry` alt paneli kaldırılır.

Yerine `QC Input` adlı salt okunur bir alt panel gelir:

- kullanılan görüntü sayısı
- exclude edilen görüntü sayısı
- crop uygulanmış görüntü sayısı
- orientation veya rotation uygulanmış görüntü sayısı
- QC snapshot durumu
- `Edit in Image QC` düğmesi

Örnek:

> QC input: 3 images · 3 cropped · 1 rotated · snapshot locked

`Edit in Image QC`:

- Image QC modülünü açar
- locked snapshot varsa kullanıcının yeniden analiz gerekeceğini açıkça belirtir
- Analysis kontrol değerlerini değiştirmez

## Validation Loader Failure Handling

Geliştirici/QA modunda validation loader görünürken:

- yükleme öncesi ilk dosyanın erişilebilirliği kontrol edilir
- HTTP 404 veya fetch hatasında teknik path kullanıcının karşısına ham biçimde dökülmez
- mesaj şu biçimde olur:

> Validation images are unavailable in this build. Run the app from the repository root or provide the local validation assets.

- kısmen oluşturulan grup ve object URL kayıtları temizlenir
- düğme yeniden etkinleştirilir

Normal yayın build'inde kontrol görünmediği için kullanıcı bu hata akışına girmez.

## Duplication Removal

Analysis'ten kaldırılacak UI:

- Scratch orientation
- Fine rotation
- Angle ruler
- Auto crop FOV
- Apply current crop ratio to group
- Adjust crop
- Apply crop
- Reset crop

Image QC'den kaldırılacak UI:

- Copy crop to all images

Eski DOM elemanlarına bağlı analiz kodları doğrudan silinmeden önce kullanım noktaları yeni QC state veya salt okunur snapshot değerlerine yönlendirilir. Null DOM referansı nedeniyle runtime hatası oluşmamalıdır.

## Data Flow

```text
Raw image
  -> Image QC working metadata
  -> locked QC snapshot
  -> prepared analysis image / geometry
  -> segmentation settings and FOV cutoff
  -> analysis result
  -> Publication Figure Builder
```

Fine rotation, crop ve orientation Analysis içinde ikinci kez uygulanmaz. Locked QC snapshot analiz girdisinin tek geometri kaynağıdır.

## Testing

### Validation Loader

- Normal hosted URL'de validation controls gizlidir.
- Localhost'ta validation controls görünür.
- `?validation=1` controls'ü görünür yapar.
- Eksik asset durumunda anlaşılır hata mesajı çıkar.
- Başarısız yüklemede yarım grup bırakılmaz.

### QC Ownership

- Fine rotation image değiştirince korunur.
- Angle ruler QC canvas üzerinde çalışır.
- Auto crop sonucu kaydedilebilir ve geri yüklenebilir.
- Crop template sonraki görüntüye yalnız başlangıç durumu olarak aktarılır.
- Copy-to-all kontrolü bulunmaz.

### Analysis Ownership

- Advanced Geometry kontrolleri Analysis'te görünmez.
- QC Input özeti doğru sayıları gösterir.
- FOV cutoff ve microscope mode Analysis'te çalışmaya devam eder.
- Locked QC geometry analizde yalnız bir kez uygulanır.
- Edit in Image QC doğru modüle geçer.

### Regression

- Manual Apply analiz davranışı korunur.
- Group analysis ve restored results çalışır.
- Builder Preview ve export çalışır.
- QC crop sürekli çalışma akışı korunur.

## Acceptance Criteria

- Görüntü geometri araçları yalnız Image QC'de bulunur.
- Analysis geometri state'ini değiştirmez.
- FOV cutoff Analysis'te algoritmik parametre olarak kalır.
- Crop kopyalama için çakışan toplu kontroller bulunmaz.
- Builder normal kullanıcıya validation loader göstermez.
- Local QA bağlamı validation loader'ı kullanabilir.
- Yayın build'inde eksik validation asset hatası kullanıcı akışını etkilemez.
