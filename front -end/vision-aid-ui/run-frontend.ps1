$ErrorActionPreference = 'SilentlyContinue'

# Change to frontend directory
cd "c:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui"

# Start npm start
$process = Start-Process npm -ArgumentList "start" -NoNewWindow -PassThru

Write-Host "Frontend process started with PID: $($process.Id)"

# Keep the script running so the process stays alive
while (-not $process.HasExited) {
    Start-Sleep -Seconds 10
}

Write-Host "Frontend process ended"
