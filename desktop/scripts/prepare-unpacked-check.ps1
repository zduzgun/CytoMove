$ErrorActionPreference = 'Stop'

$project = Split-Path -Parent $PSScriptRoot
$root = Split-Path -Parent $project
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$sourceWin = Join-Path $project 'release-portable-20260622-144527\win-unpacked'
$targetRoot = Join-Path $project ("release-unpacked-filepicker-check-" + $stamp)
$targetWin = Join-Path $targetRoot 'win-unpacked'
$tmp = Join-Path $project ('.tmp-asar\cytomove-asar-' + $stamp)
$asar = Join-Path $project 'node_modules\.bin\asar.cmd'

if (!(Test-Path -LiteralPath $sourceWin)) {
  throw "Source win-unpacked not found: $sourceWin"
}

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
Copy-Item -LiteralPath $sourceWin -Destination $targetWin -Recurse
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

& $asar extract (Join-Path $targetWin 'resources\app.asar') $tmp
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Copy-Item -LiteralPath (Join-Path $project 'renderer\desktop\file-picker.js') -Destination (Join-Path $tmp 'renderer\desktop\file-picker.js') -Force
Copy-Item -LiteralPath (Join-Path $project 'renderer\app.js') -Destination (Join-Path $tmp 'renderer\app.js') -Force
Copy-Item -LiteralPath (Join-Path $project 'renderer\index.html') -Destination (Join-Path $tmp 'renderer\index.html') -Force
Copy-Item -LiteralPath (Join-Path $project 'renderer\styles.css') -Destination (Join-Path $tmp 'renderer\styles.css') -Force
Copy-Item -LiteralPath (Join-Path $project 'preload.js') -Destination (Join-Path $tmp 'preload.js') -Force
Copy-Item -LiteralPath (Join-Path $project 'main.js') -Destination (Join-Path $tmp 'main.js') -Force

& $asar pack $tmp (Join-Path $targetWin 'resources\app.asar')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "CHECK_WIN_UNPACKED=$targetWin"
