$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path "$root\node_modules")) {
  Write-Host "Instalando dependencias (primera vez)..." -ForegroundColor Cyan
  npm install
}

$port = if ($env:PORT) { $env:PORT } else { 4141 }
Start-Process "http://localhost:$port"
node "$root\src\server.mjs"
