# Vision Aid - Quick Start Script
# This script helps you start all services easily

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " Vision Aid - Quick Start" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$dockerAvailable = Test-Command "docker"
$nodeAvailable = Test-Command "node"
$mongoAvailable = Test-Command "mongod"
$redisAvailable = Test-Command "redis-server"
$pythonAvailable = Test-Command "python"

Write-Host ""
Write-Host "System Check:" -ForegroundColor Cyan
Write-Host "  Docker:   $(if ($dockerAvailable) { '✓ Installed' } else { '✗ Not Found' })" -ForegroundColor $(if ($dockerAvailable) { 'Green' } else { 'Red' })
Write-Host "  Node.js:  $(if ($nodeAvailable) { '✓ Installed' } else { '✗ Not Found' })" -ForegroundColor $(if ($nodeAvailable) { 'Green' } else { 'Red' })
Write-Host "  MongoDB:  $(if ($mongoAvailable) { '✓ Installed' } else { '✗ Not Found' })" -ForegroundColor $(if ($mongoAvailable) { 'Green' } else { 'Red' })
Write-Host "  Redis:    $(if ($redisAvailable) { '✓ Installed' } else { '✗ Not Found' })" -ForegroundColor $(if ($redisAvailable) { 'Green' } else { 'Red' })
Write-Host "  Python:   $(if ($pythonAvailable) { '✓ Installed' } else { '✗ Not Found' })" -ForegroundColor $(if ($pythonAvailable) { 'Green' } else { 'Red' })
Write-Host ""

# Ask user which method to use
Write-Host "How would you like to start Vision Aid?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Docker Compose (Recommended - starts everything)" -ForegroundColor Green
Write-Host "2. Manual Start (individual services)"
Write-Host "3. Check Status Only"
Write-Host "4. Stop All Services"
Write-Host "5. View Logs"
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        # Docker Compose Start
        Write-Host ""
        Write-Host "Starting all services with Docker Compose..." -ForegroundColor Green
        Write-Host ""
        
        if ($dockerAvailable) {
            docker-compose up -d
            
            Write-Host ""
            Write-Host "================================================" -ForegroundColor Cyan
            Write-Host " Services Started Successfully!" -ForegroundColor Green
            Write-Host "================================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Access your services:" -ForegroundColor Yellow
            Write-Host "  Frontend:  http://localhost:3001" -ForegroundColor White
            Write-Host "  Backend:   http://localhost:3000" -ForegroundColor White
            Write-Host "  YOLO:      http://localhost:8000" -ForegroundColor White
            Write-Host "  MongoDB:   mongodb://admin:password@localhost:27017" -ForegroundColor White
            Write-Host "  Redis:     redis://localhost:6379" -ForegroundColor White
            Write-Host ""
            Write-Host "Useful commands:" -ForegroundColor Yellow
            Write-Host "  View logs:    docker-compose logs -f" -ForegroundColor Gray
            Write-Host "  Stop all:     docker-compose down" -ForegroundColor Gray
            Write-Host "  Restart:      docker-compose restart" -ForegroundColor Gray
            Write-Host ""
        }
        else {
            Write-Host "Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
            Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        }
    }
    
    "2" {
        # Manual Start
        Write-Host ""
        Write-Host "Manual Start Instructions:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please open separate terminal windows for each service:" -ForegroundColor White
        Write-Host ""
        Write-Host "Terminal 1 - MongoDB:" -ForegroundColor Cyan
        Write-Host "  mongod" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Terminal 2 - Redis:" -ForegroundColor Cyan
        Write-Host "  redis-server" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Terminal 3 - Backend:" -ForegroundColor Cyan
        Write-Host "  cd Back-end" -ForegroundColor Gray
        Write-Host "  npm start" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Terminal 4 - YOLO Service:" -ForegroundColor Cyan
        Write-Host "  cd yolo-service" -ForegroundColor Gray
        Write-Host "  python app.py" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Terminal 5 - Frontend:" -ForegroundColor Cyan
        Write-Host "  cd 'front -end\\vision-aid-ui'" -ForegroundColor Gray
        Write-Host "  npm start" -ForegroundColor Gray
        Write-Host ""
    }
    
    "3" {
        # Check Status
        Write-Host ""
        Write-Host "Checking service status..." -ForegroundColor Yellow
        Write-Host ""
        
        if ($dockerAvailable) {
            docker-compose ps
        }
        else {
            Write-Host "Docker not available. Checking manual services..." -ForegroundColor Yellow
            
            # Check Backend
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2
                Write-Host "Backend:  ✓ Running" -ForegroundColor Green
            }
            catch {
                Write-Host "Backend:  ✗ Not Running" -ForegroundColor Red
            }
            
            # Check YOLO
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2
                Write-Host "YOLO:     ✓ Running" -ForegroundColor Green
            }
            catch {
                Write-Host "YOLO:     ✗ Not Running" -ForegroundColor Red
            }
            
            # Check Frontend
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 2
                Write-Host "Frontend: ✓ Running" -ForegroundColor Green
            }
            catch {
                Write-Host "Frontend: ✗ Not Running" -ForegroundColor Red
            }
        }
        Write-Host ""
    }
    
    "4" {
        # Stop All
        Write-Host ""
        Write-Host "Stopping all services..." -ForegroundColor Yellow
        Write-Host ""
        
        if ($dockerAvailable) {
            docker-compose down
            Write-Host "All Docker services stopped." -ForegroundColor Green
        }
        else {
            Write-Host "Please manually stop all services in their terminal windows." -ForegroundColor Yellow
            Write-Host "Press Ctrl+C in each terminal." -ForegroundColor White
        }
        Write-Host ""
    }
    
    "5" {
        # View Logs
        Write-Host ""
        Write-Host "Viewing logs..." -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to exit log view." -ForegroundColor Gray
        Write-Host ""
        
        if ($dockerAvailable) {
            docker-compose logs -f
        }
        else {
            Write-Host "Docker not available. Showing backend logs..." -ForegroundColor Yellow
            if (Test-Path ".\Back-end\logs\combined.log") {
                Get-Content ".\Back-end\logs\combined.log" -Tail 50 -Wait
            }
            else {
                Write-Host "No log files found." -ForegroundColor Red
            }
        }
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Thank you for using Vision Aid! 💜" -ForegroundColor Magenta
Write-Host ""
