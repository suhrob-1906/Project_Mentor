# Test authentication endpoints with proper data types
$baseUrl = "https://project-mentor-nis4.onrender.com"

Write-Host "`n=== Testing Registration ===" -ForegroundColor Cyan
$randomNum = Get-Random -Maximum 9999
$testUsername = "testuser$randomNum"
$registerBody = @{
    username         = $testUsername
    password         = "testpass123"
    email            = "test$randomNum@example.com"
    track            = "backend"
    age              = 25  # Integer, not string
    primary_language = "python"
    goal             = "job"
} | ConvertTo-Json

Write-Host "Sending registration data:" -ForegroundColor Yellow
Write-Host $registerBody -ForegroundColor Gray

try {
    $regResponse = Invoke-WebRequest -Uri "$baseUrl/auth/register/" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $registerBody `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "`n✅ Registration successful!" -ForegroundColor Green
    $regData = $regResponse.Content | ConvertFrom-Json
    Write-Host "User created: $($regData.user.username)" -ForegroundColor Green
    Write-Host "Access token: $($regData.access.Substring(0,30))..." -ForegroundColor Green
    
    Write-Host "`n=== Testing Login ===" -ForegroundColor Cyan
    $loginBody = @{
        username = $testUsername
        password = "testpass123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login/" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $loginBody `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Access token: $($loginData.access.Substring(0,30))..." -ForegroundColor Green
    
    Write-Host "`n✅ ALL TESTS PASSED!" -ForegroundColor Green
    
}
catch {
    Write-Host "`n❌ Error occurred!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse Body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Gray
    }
}
