$labUrl = 'http://127.0.0.1:8055/lab5/results.html'
for ($attempt = 0; $attempt -lt 40; $attempt++) {
    try {
        $response = Invoke-WebRequest -Uri $labUrl -TimeoutSec 1 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Start-Process $labUrl
            exit 0
        }
    } catch { }
    Start-Sleep -Milliseconds 250
}
