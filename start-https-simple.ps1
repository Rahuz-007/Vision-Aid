# Vision Aid HTTPS Startup Script (Simple Method)
# Uses React's built-in self-signed certificate

Write-Host "Starting Vision Aid with HTTPS (Simple Method)..." -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "172.*" -or $_.IPAddress -like "10.*" } | Select-Object -First 1).IPAddress

if (-not $localIP) {
    $localIP = "localhost"
}

Write-Host "Local IP Address: $localIP`n" -ForegroundColor Cyan

# Start YOLO Service
Write-Host "[1/3] Starting YOLO Service on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\yolo-service'; `$env:PORT='8000'; .venv\Scripts\python.exe app.py" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Back-end
Write-Host "[2/3] Starting Back-end Server on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\Back-end'; `$env:PORT='3001'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Front-end with HTTPS
Write-Host "[3/3] Starting Front-end with HTTPS on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui'; `$env:HTTPS='true'; `$env:HOST='0.0.0.0'; `$env:PORT='3000'; `$env:BROWSER='none'; npm start" -WindowStyle Normal

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "All services are starting with HTTPS!" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Green

Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  Computer:  https://localhost:3000" -ForegroundColor White
Write-Host "  Mobile:    https://$localIP:3000" -ForegroundColor White
Write-Host ""
Write-Host "Mobile Quick Access:" -ForegroundColor Yellow
Write-Host "  https://$localIP:3000" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "  - You WILL see a security warning on mobile" -ForegroundColor Yellow
Write-Host "  - Click 'Advanced' then 'Proceed to $localIP (unsafe)'" -ForegroundColor Yellow
Write-Host "  - This is normal for local development" -ForegroundColor Yellow
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - YOLO Service:  http://localhost:8000" -ForegroundColor White
Write-Host "  - Backend API:   http://localhost:3001" -ForegroundColor White
Write-Host "  - Frontend App:  https://localhost:3000" -ForegroundColor White
Write-Host ""
