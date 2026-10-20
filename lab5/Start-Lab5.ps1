$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$labUrl = 'http://127.0.0.1:8055/lab5/results.html'
try {
    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8055/index.html' -TimeoutSec 2 -UseBasicParsing
    if ($response.StatusCode -eq 200 -and $response.Content -match 'Learn') {
        Start-Process $labUrl
        exit 0
    }
} catch { }
[void](Start-Process powershell.exe -WindowStyle Hidden -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSScriptRoot\Open-Lab5Browser.ps1`"")
Set-Location -LiteralPath $projectDirectory
& 'C:\Users\Artemka\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 8055 --bind 127.0.0.1
