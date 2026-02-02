# Vision Aid Project Startup Script
Write-Host "Starting Vision Aid Project..." -ForegroundColor Green

# Start YOLO Service (Python) on port 5000 (standard)
Write-Host "`n[1/3] Starting YOLO Service on port 5000..." -ForegroundColor Yellow
$env:PORT = '5000'
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\yolo-service'; `$env:PORT='5000'; venv\Scripts\python.exe app.py" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Back-end (Node.js) on port 3000
Write-Host "[2/3] Starting Back-end Server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\Back-end'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Front-end (React) on port 3001
Write-Host "[3/3] Starting Front-end React App on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui'; `$env:PORT='3001'; `$env:BROWSER='none'; npm start" -WindowStyle Normal

Write-Host "`nAll services are starting!" -ForegroundColor Green
Write-Host "`nServices:" -ForegroundColor Cyan
Write-Host "  - YOLO Service:    http://localhost:5000" -ForegroundColor White
Write-Host "  - Back-end API:    http://localhost:3000" -ForegroundColor White
Write-Host "  - Front-end App:   http://localhost:3001" -ForegroundColor White
Write-Host "`nCheck the PowerShell windows for service status and logs." -ForegroundColor Yellow
