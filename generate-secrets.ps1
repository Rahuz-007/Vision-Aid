# Vision Aid - Generate Production Secrets
# Run this script to generate secure secrets for your .env file

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Vision Aid - Secret Generator" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Generating secure secrets..." -ForegroundColor Yellow
Write-Host ""

# Generate JWT Secret
$jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Green

# Generate Session Secret
$sessionSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host "SESSION_SECRET=$sessionSecret" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Copy these secrets to your .env file" -ForegroundColor White
Write-Host "2. NEVER commit .env files to git" -ForegroundColor White
Write-Host "3. Use different secrets for dev/staging/production" -ForegroundColor White
Write-Host "`n" -ForegroundColor White

# Offer to create .env if it doesn't exist
if (-not (Test-Path "Back-end\.env")) {
    Write-Host ".env file not found. Would you like to create one from .env.example? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        Copy-Item "Back-end\.env.example" "Back-end\.env"
        
        # Replace placeholders with generated secrets
        $envContent = Get-Content "Back-end\.env" -Raw
        $envContent = $envContent -replace 'REPLACE_WITH_GENERATED_SECRET_MIN_32_CHARS', $jwtSecret
        $envContent = $envContent -replace 'REPLACE_WITH_DIFFERENT_GENERATED_SECRET_MIN_32_CHARS', $sessionSecret
        Set-Content "Back-end\.env" $envContent
        
        Write-Host "`n✅ Created Back-end\.env with generated secrets!" -ForegroundColor Green
        Write-Host "⚠️  Remember to update other variables (MONGODB_URI, etc.)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ℹ️  .env file already exists. Please update it manually with the secrets above." -ForegroundColor Cyan
}

Write-Host ""

