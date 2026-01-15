# Test backend course endpoint
$baseUrl = "https://project-mentor-nis4.onrender.com"

Write-Host "`n=== Testing Backend Course Endpoint ===" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/courses/backend/" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "✅ Backend course loaded successfully!" -ForegroundColor Green
    $course = $response.Content | ConvertFrom-Json
    Write-Host "Title: $($course.title_en)" -ForegroundColor Gray
    Write-Host "Modules: $($course.modules.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Error loading backend course" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nError Response:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Gray
    }
}

# Also test with authentication
Write-Host "`n=== Testing with Authentication ===" -ForegroundColor Cyan
$loginBody = @{
    username = "testuser3303"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login/" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json" } `
        -Body $loginBody `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.access
    
    Write-Host "✅ Logged in successfully" -ForegroundColor Green
    
    # Now try to get course with auth
    $courseResponse = Invoke-WebRequest -Uri "$baseUrl/api/courses/backend/" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $token" } `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "✅ Course loaded with auth!" -ForegroundColor Green
    $course = $courseResponse.Content | ConvertFrom-Json
    Write-Host "Modules: $($course.modules.Count)" -ForegroundColor Gray
    
}
catch {
    Write-Host "❌ Error with authenticated request" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
