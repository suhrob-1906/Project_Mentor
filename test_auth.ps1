# Test authentication endpoints
$baseUrl = "https://project-mentor-nis4.onrender.com"

Write-Host "`n=== Testing Registration ===" -ForegroundColor Cyan
$registerBody = @{
    username = "testuser$(Get-Random -Maximum 9999)"
    password = "testpass123"
    email    = "test@example.com"
    track    = "backend"
} | ConvertTo-Json

try {
    $regResponse = Invoke-WebRequest -Uri "$baseUrl/auth/register/" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $registerBody `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "Registration successful!" -ForegroundColor Green
    $regData = $regResponse.Content | ConvertFrom-Json
    Write-Host "User created: $($regData.user.username)" -ForegroundColor Green
    
    # Extract username for login
    $username = $regData.user.username
    
    Write-Host "`n=== Testing Login ===" -ForegroundColor Cyan
    $loginBody = @{
        username = $username
        password = "testpass123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login/" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $loginBody `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "Login successful!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Access token received: $($loginData.access.Substring(0,20))..." -ForegroundColor Green
    
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}
