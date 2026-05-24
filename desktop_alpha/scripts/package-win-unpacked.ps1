$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$electronDist = Join-Path $root "node_modules\electron\dist"
$electronExe = Join-Path $electronDist "electron.exe"
$releaseRoot = Join-Path $root "release"
$outDir = Join-Path $releaseRoot "win-unpacked"
$appDir = Join-Path $outDir "resources\app"

if (!(Test-Path -LiteralPath $electronExe)) {
  throw "Electron runtime not found at $electronExe. Run npm install first."
}

if (Test-Path -LiteralPath $outDir) {
  Remove-Item -LiteralPath $outDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Copy-Item -Path (Join-Path $electronDist "*") -Destination $outDir -Recurse -Force

New-Item -ItemType Directory -Force -Path $appDir | Out-Null
Copy-Item -LiteralPath (Join-Path $root "main.js") -Destination $appDir -Force
Copy-Item -LiteralPath (Join-Path $root "preload.js") -Destination $appDir -Force
Copy-Item -LiteralPath (Join-Path $root "package.json") -Destination $appDir -Force
Copy-Item -LiteralPath (Join-Path $root "renderer") -Destination $appDir -Recurse -Force

$targetExe = Join-Path $outDir "Cytomove Desktop Alpha.exe"
Rename-Item -LiteralPath (Join-Path $outDir "electron.exe") -NewName "Cytomove Desktop Alpha.exe"

Write-Output "Created $targetExe"
