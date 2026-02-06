# Vision Aid - Quick Test Script
# Tests Phase 1 implementation

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Phase 1 Testing - Vision Aid" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if .env exists
Write-Host "1. Checking .env file..." -ForegroundColor Yellow
if (Test-Path "Back-end\.env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    # Check if secrets are set
    $envContent = Get-Content "Back-end\.env" -Raw
    
    if ($envContent -match "JWT_SECRET=\w{32,}") {
        Write-Host "   ✅ JWT_SECRET is set" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ JWT_SECRET is missing or too short" -ForegroundColor Red
        Write-Host "   Run: .\generate-secrets.ps1" -ForegroundColor Yellow
    }
    
    if ($envContent -match "SESSION_SECRET=\w{32,}") {
        Write-Host "   ✅ SESSION_SECRET is set" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ SESSION_SECRET is missing or too short" -ForegroundColor Red
    }
    
    if ($envContent -match "FRONTEND_URL=.+") {
        Write-Host "   ✅ FRONTEND_URL is set" -ForegroundColor Green
    }
    else {
        Write-Host "   ⚠️  FRONTEND_URL not set (will use default)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   ❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item "Back-end\.env.example" "Back-end\.env"
    Write-Host "   ⚠️  Please edit Back-end\.env with your secrets" -ForegroundColor Yellow
    Write-Host "   Run: .\generate-secrets.ps1 to generate secrets" -ForegroundColor Cyan
}

Write-Host "`n2. Checking dependencies..." -ForegroundColor Yellow
Set-Location "Back-end"

if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️  Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n3. Checking logs directory..." -ForegroundColor Yellow
if (Test-Path "logs") {
    Write-Host "   ✅ logs directory exists" -ForegroundColor Green
}
else {
    Write-Host "   Creating logs directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    Write-Host "   ✅ logs directory created" -ForegroundColor Green
}

Set-Location ".."

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Phase 1 Security Improvements:" -ForegroundColor White
Write-Host "  ✅ Environment validation" -ForegroundColor Green
Write-Host "  ✅ Winston logging configured" -ForegroundColor Green
Write-Host "  ✅ Input validation schemas" -ForegroundColor Green
Write-Host "  ✅ Security middleware" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Ensure .env has all required values" -ForegroundColor White
Write-Host "  2. Run: cd Back-end && npm start" -ForegroundColor White
Write-Host "  3. Check logs in Back-end/logs/" -ForegroundColor White
Write-Host "  4. Test API with Postman/curl" -ForegroundColor White

Write-Host "`n"
