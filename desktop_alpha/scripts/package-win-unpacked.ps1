$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$electronDist = Join-Path $root "node_modules\electron\dist"
$electronExe = Join-Path $electronDist "electron.exe"
$releaseRoot = Join-Path $root "release"
$outDir = Join-Path $releaseRoot "win-unpacked"
$appDir = Join-Path $outDir "resources\app"
$version = (Get-Content -LiteralPath (Join-Path $root "package.json") | ConvertFrom-Json).version
$zipPath = Join-Path $releaseRoot "Cytomove-Desktop-Alpha-$version-win-x64.zip"
$packageFolderName = "Cytomove Desktop Alpha $version"
$stageRoot = Join-Path ([System.IO.Path]::GetTempPath()) "cytomove-desktop-alpha-pack"
$stageOut = Join-Path $stageRoot $packageFolderName

function Invoke-WithRetry {
  param(
    [Parameter(Mandatory = $true)]
    [scriptblock]$Action,
    [Parameter(Mandatory = $true)]
    [string]$Label
  )

  $lastError = $null
  for ($attempt = 1; $attempt -le 5; $attempt++) {
    try {
      & $Action
      return
    } catch {
      $lastError = $_
      if ($attempt -eq 5) {
        throw
      }
      Write-Warning "$Label failed on attempt $attempt. Retrying..."
      Start-Sleep -Seconds (1 + $attempt)
    }
  }

  throw $lastError
}

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
Copy-Item -LiteralPath (Join-Path $root "TESTER_README.txt") -Destination $outDir -Force

$targetExe = Join-Path $outDir "Cytomove Desktop Alpha.exe"
Rename-Item -LiteralPath (Join-Path $outDir "electron.exe") -NewName "Cytomove Desktop Alpha.exe"

Write-Output "Created $targetExe"

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

if (Test-Path -LiteralPath $stageRoot) {
  Remove-Item -LiteralPath $stageRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null

Invoke-WithRetry -Label "Package staging copy" -Action {
  if (Test-Path -LiteralPath $stageOut) {
    Remove-Item -LiteralPath $stageOut -Recurse -Force
  }
  Copy-Item -LiteralPath $outDir -Destination $stageOut -Recurse -Force
}

Invoke-WithRetry -Label "ZIP creation" -Action {
  if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }
  Compress-Archive -LiteralPath $stageOut -DestinationPath $zipPath -Force
}

if (Test-Path -LiteralPath $stageRoot) {
  Remove-Item -LiteralPath $stageRoot -Recurse -Force
}

Write-Output "Created $zipPath"
