param(
  [string]$InputRoot = "validation_ref_sets\raw\whad_camad",
  [string]$OutputRoot = "validation_ref_sets\browser_ready\whad_camad_png"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$inputPath = Resolve-Path (Join-Path $projectRoot $InputRoot)
$outputPath = Join-Path $projectRoot $OutputRoot
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$files = Get-ChildItem -LiteralPath $inputPath -Recurse -File |
  Where-Object { $_.Extension -match '^\.(tif|tiff)$' }

$converted = 0
foreach($file in $files) {
  $relative = Resolve-Path -LiteralPath $file.FullName -Relative
  $relative = $file.FullName.Substring($inputPath.Path.Length).TrimStart('\','/')
  $targetRelative = [System.IO.Path]::ChangeExtension($relative, ".png")
  $target = Join-Path $outputPath $targetRelative
  $targetDir = Split-Path -Parent $target
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  $img = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $img.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    $converted += 1
  } finally {
    $img.Dispose()
  }
}

Write-Host "Converted $converted TIFF files to $OutputRoot"
