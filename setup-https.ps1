# Vision Aid HTTPS Setup Script
# This script sets up HTTPS for local development with camera access on mobile

Write-Host "Vision Aid HTTPS Setup" -ForegroundColor Cyan
Write-Host "=====================`n" -ForegroundColor Cyan

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "172.*" -or $_.IPAddress -like "10.*" } | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "Could not detect local IP address. Using localhost..." -ForegroundColor Yellow
    $localIP = "localhost"
}

Write-Host "Detected Local IP: $localIP" -ForegroundColor Green

# Step 1: Install mkcert (if not already installed)
Write-Host "`n[Step 1/4] Checking for mkcert..." -ForegroundColor Yellow

$mkcertPath = Get-Command mkcert -ErrorAction SilentlyContinue

if (-not $mkcertPath) {
    Write-Host "mkcert not found. Installing via chocolatey..." -ForegroundColor Yellow
    
    # Check if chocolatey is installed
    $chocoPath = Get-Command choco -ErrorAction SilentlyContinue
    
    if (-not $chocoPath) {
        Write-Host "`nChocolatey is not installed." -ForegroundColor Red
        Write-Host "Please install mkcert manually:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor White
        Write-Host "2. Or install Chocolatey first: https://chocolatey.org/install" -ForegroundColor White
        Write-Host "3. Then run: choco install mkcert" -ForegroundColor White
        exit 1
    }
    
    Write-Host "Installing mkcert..." -ForegroundColor Yellow
    choco install mkcert -y
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install mkcert. Please install manually." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ mkcert is available" -ForegroundColor Green

# Step 2: Create certificate directory
Write-Host "`n[Step 2/4] Creating certificate directory..." -ForegroundColor Yellow
$certDir = "C:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui\certs"

if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir -Force | Out-Null
}

Write-Host "✓ Certificate directory ready: $certDir" -ForegroundColor Green

# Step 3: Generate certificates
Write-Host "`n[Step 3/4] Generating SSL certificates..." -ForegroundColor Yellow

Set-Location $certDir

# Install local CA
mkcert -install

# Generate certificate for localhost and local IP
mkcert localhost $localIP 127.0.0.1 ::1

# Rename files to expected names
$certFiles = Get-ChildItem -Path $certDir -Filter "*.pem"
if ($certFiles.Count -ge 2) {
    $certFile = $certFiles | Where-Object { $_.Name -notlike "*-key.pem" } | Select-Object -First 1
    $keyFile = $certFiles | Where-Object { $_.Name -like "*-key.pem" } | Select-Object -First 1
    
    if ($certFile) { Rename-Item -Path $certFile.FullName -NewName "localhost.pem" -Force }
    if ($keyFile) { Rename-Item -Path $keyFile.FullName -NewName "localhost-key.pem" -Force }
    
    Write-Host "✓ SSL certificates generated successfully" -ForegroundColor Green
}
else {
    Write-Host "✗ Failed to generate certificates" -ForegroundColor Red
    exit 1
}

# Step 4: Create HTTPS start script
Write-Host "`n[Step 4/4] Creating HTTPS startup script..." -ForegroundColor Yellow

$httpsStartScript = @"
# Vision Aid HTTPS Startup Script
Write-Host "Starting Vision Aid with HTTPS..." -ForegroundColor Green

# Set environment variables for HTTPS
`$env:HTTPS = 'true'
`$env:SSL_CRT_FILE = 'certs\localhost.pem'
`$env:SSL_KEY_FILE = 'certs\localhost-key.pem'
`$env:HOST = '0.0.0.0'

# Start YOLO Service
Write-Host "`n[1/3] Starting YOLO Service on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\yolo-service'; `$env:PORT='8000'; .venv\Scripts\python.exe app.py" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Back-end
Write-Host "[2/3] Starting Back-end Server on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\Back-end'; `$env:PORT='3001'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Front-end with HTTPS
Write-Host "[3/3] Starting Front-end with HTTPS on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui'; `$env:HTTPS='true'; `$env:SSL_CRT_FILE='certs\localhost.pem'; `$env:SSL_KEY_FILE='certs\localhost-key.pem'; `$env:HOST='0.0.0.0'; `$env:PORT='3000'; `$env:BROWSER='none'; npm start" -WindowStyle Normal

Write-Host "`nAll services are starting with HTTPS!`n" -ForegroundColor Green
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  Local:   https://localhost:3000" -ForegroundColor White
Write-Host "  Mobile:  https://$localIP:3000" -ForegroundColor White
Write-Host "`nNote: You may see a security warning on first access." -ForegroundColor Yellow
Write-Host "Click 'Advanced' and 'Proceed' to continue.`n" -ForegroundColor Yellow
"@

$httpsStartScript | Out-File -FilePath "C:\Users\ASUS\Desktop\Vision aid\start-https.ps1" -Encoding UTF8 -Force

Write-Host "✓ HTTPS startup script created" -ForegroundColor Green

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "HTTPS Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Stop any running services (close PowerShell windows)" -ForegroundColor White
Write-Host "2. Run: .\start-https.ps1" -ForegroundColor White
Write-Host "3. Access on mobile: https://$localIP:3000`n" -ForegroundColor White

Write-Host "Mobile Access URL:" -ForegroundColor Cyan
Write-Host "  https://$localIP:3000" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
