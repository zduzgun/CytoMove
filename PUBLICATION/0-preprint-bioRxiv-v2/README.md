# Cytomove preprint – v2 (zenginleştirilmiş manuscript)

Hazırlanma tarihi: 2026-06-04

Bu klasör, `0-preprint-bioRxiv/` içindeki mevcut manuscript'in referans dergi makaleleri
(WHST/PLOS ONE, PyScratch/CMPB, TScratch/BioTechniques, CSMA/IEEE Access) seviyesine
çıkarılmış yeni versiyonudur. Mevcut dosyalara dokunulmamıştır.

## V1'e göre başlıca eklemeler

- **Algoritma denklemleri:** BT.709 luminance formülü, integral image (summed-area table)
  variance formülü (S₁, S₂, μ, σ²), Otsu eşikleme metodolojisi
- **Parametre tablosu (Table 1):** Tüm ayarlanabilir parametreler, aralıkları ve 4 preset
  için varsayılan değerler (CSMA Table 1 benzeri)
- **İstatistik formülleri:** MAPE denklemi, Bland–Altman metodoloji açıklaması,
  yara kapanma yüzdesi (WC%) formülü
- **Performans bilgisi:** Formal benchmark iddiası yerine informal local testing dili,
  sıfır bağımlılık
- **Dataset teknik bağlamı:** csma_sample_11 → SW480-ADH kolon kanseri hücreleri,
  CytoSMART Omni ×10; whad_mcf7_11 → MCF-7, Olympus Live Cell-R, 30 dk aralık;
  HK/M8F/MK → HUVEC, ×10 objektif, Düzgün et al. 2024 atfı ile
- **Table 2 zenginleştirildi:** Hücre hatları, mikroskop modeli, görüntüleme aralığı
- **Table 3 genişletildi:** Mean signed error sütunu eklendi
- **Results:** Yara kapanma % değerleri, csma_sample_11 için 3 yöntemli karşılaştırma
  bağlamı, M8F'in biyolojik yorumu (FDI-6 etkisi)
- **Discussion:** Araçlarla konumlandırma daha spesifik (PyScratch 6× hız kıyaslaması,
  TScratch curvelet yaklaşımı, CSMA iki aşamalı pipeline)
- **Yeni referans:** Düzgün et al. 2024 (Mol Divers) eklendi

## Kanonik kaynak

`manuscript/cytomove-preprint-v2.md`

DOCX/PDF üretmek için `scripts/build_biorxiv_imrad_docx.py` güncellenebilir
veya pandoc ile doğrudan üretilebilir.

## Güncel Zenodo upload paketi

Zenodo draft upload sayfası: <https://zenodo.org/uploads/20486820>

Upload için güncel ZIP:

`Cytomove_zenodo_validation_deposit_v2_20486820_2026-06-04.zip`

Bu ZIP, `zenodo_validation_deposit/` klasöründen üretildi ve lean reproducibility
paketidir: Figure 1-6 + Supplementary Figure S1, validation master, provenance
manifest, author-acquired phone images, derived outputs, `.zenodo.json`,
`zenodo_metadata.json` ve `deposit_file_manifest.csv` içerir. Manuscript
PDF/DOCX/MD ve kod lisans dosyaları bu Zenodo veri paketine eklenmez; manuscript
bioRxiv'de, kod/lisans GitHub reposunda ayrı durur.

DOI `10.5281/zenodo.20486820` draft/reserved durumundadır; Zenodo kaydı yayınlandıktan
sonra manuscript'teki "reserved DOI" ifadesi "available on Zenodo" olarak değiştirilebilir.
