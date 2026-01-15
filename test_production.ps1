# Test the deployed frontend
Write-Host "`n=== Waiting for Vercel deployment ===" -ForegroundColor Cyan
Write-Host "Vercel usually takes 1-2 minutes to deploy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n=== Testing Production Site ===" -ForegroundColor Cyan
Write-Host "Opening browser to test registration and login..." -ForegroundColor Yellow

# Open the registration page
Start-Process "https://project-mentor-one.vercel.app/register"

Write-Host "`nPlease test the following:" -ForegroundColor Green
Write-Host "1. Register a new account" -ForegroundColor White
Write-Host "2. After registration, you should be redirected to /courses/backend or /courses/frontend" -ForegroundColor White
Write-Host "3. The course page should load without 404 errors" -ForegroundColor White
Write-Host "`nIf everything works, the fix is complete! ✅" -ForegroundColor Green
