$ErrorActionPreference = 'Stop'

$project = Split-Path -Parent $PSScriptRoot
$cache = Join-Path $project '.electron-cache'
$output = Join-Path $project ('release-portable-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))

$env:ELECTRON_BUILDER_CACHE = $cache
$builder = Join-Path $project 'node_modules/electron-builder/out/cli/cli.js'

& node $builder --win portable `
  --config.win.signAndEditExecutable=false `
  "--config.directories.output=$output" `
  "--config.electronDownload.cache=$cache"

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Unsigned portable build: $output"
