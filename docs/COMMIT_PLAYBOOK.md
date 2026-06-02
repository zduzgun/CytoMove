# Commit Playbook - Cytomove

Bu reçete, biriken değişiklikleri temiz bir checkpoint commit'ine almak içindir.
Önemli nokta: bu repoda hem aktif çalışma dosyaları hem de büyük/ikincil binary çıktılar var. Bu yüzden `git add -A` kullanma.

Çalışma dizini:

```powershell
cd D:\YandexDisk\CELLVERSE_PROJECT\CYTOMOVE
```

## 1. Git kilidini güvenli kontrol et

Önce açık git süreci olmadığını doğrula:

```powershell
Get-Process git -ErrorAction SilentlyContinue
```

Çıktı boş değilse bekle veya ilgili Git/Codex/IDE işlemini kapat. Ancak bundan sonra, `.git\index.lock` hala duruyorsa sil:

```powershell
del .git\index.lock
```

`index.lock` aktif git süreci varken silinmemeli; 2026-06-02 kontrolünde makinede aktif `git.exe` süreçleri görüldü.

## 2. LibreOffice / soffice çöplerini temizle

PDF veya LibreOffice pencerelerini kapat, sonra:

```powershell
del docs\lu*.tmp
del docs\zi9SJotS
del "docs\.~lock.Cytomove_manuscript_submission.pdf#"
```

Bu dosyalar `.gitignore` içinde; temizlik yalnızca çalışma ağacını okunur kılmak için.

## 3. Durumu gözden geçir

```powershell
git status --short
```

Özellikle şunları ayrıca değerlendir:

- `BİLDİRİ/` - bildiri dosyaları; bu checkpoint'e dahil edilecek mi?
- `docs/old/` - eski manuscript taslak arşivi; repo şişebilir.
- `docs/Cytomove_zenodo_deposit*.zip` - üç ZIP var; kanonik olanı seç.
- `docs/manuscript_figures/` - büyük PNG/JPG çıktıları içerebilir.

## 4. Güvenli seçici staging

Hafıza, manuscript/preprint kaynakları, trial-gate kodu ve üretici scriptleri için önerilen stage listesi:

```powershell
git add .gitignore AGENT_BRIEF.md ROADMAP.md
git add desktop_alpha/README.md desktop_alpha/TESTER_README.txt desktop_alpha/main.js desktop_alpha/preload.js desktop_alpha/renderer/app.js desktop_alpha/renderer/index.html desktop_alpha/renderer/styles.css
git add docs/COMMIT_PLAYBOOK.md docs/biorxiv-submission-checklist.md docs/manuscript-cytomove-submission.md docs/preprint-readiness-plan.md docs/zenodo-submit-instructions.md
git add docs/references/cytomove-preprint.bib
git add scripts/build_manuscript_docx.py scripts/generate_app_screenshot_figure.py scripts/generate_csma_visual_audit_figure.py scripts/generate_manuscript_figures.py
```

Ardından büyük çıktıları bilinçli ekle:

```powershell
git add docs/Cytomove_manuscript_submission.docx docs/Cytomove_manuscript_submission.pdf
git add docs/zenodo_deposit/
git add docs/manuscript_figures/
```

ZIP dosyaları için yalnızca seçilen kanonik paketi ekle. Örneğin:

```powershell
git add docs/Cytomove_zenodo_deposit_enriched_doi.zip
```

## 5. Commit öncesi son kontrol

```powershell
git diff --cached --stat
git diff --cached --name-only
```

Şunlar staged olmamalı: `github_token.txt`, `.env*`, `wound healing/`, `validation_ref_sets/`, `validation_sets/`, `desktop_alpha/node_modules/`, `desktop_alpha/release/`, `*.tmp`, `.~lock.*`.

## 6. Commit

```powershell
git commit -m "[claude] Preprint submission build and cross-agent memory"
```

Sonraki ajan için `AGENT_BRIEF.md` STATUS bloğunu güncel tut. Push gerekiyorsa `git push`.
