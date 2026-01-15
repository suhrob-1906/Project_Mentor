# Test if courses exist in production database
$baseUrl = "https://project-mentor-nis4.onrender.com"

Write-Host "`n=== Testing Course Endpoints ===" -ForegroundColor Cyan

# Test 1: List all courses
Write-Host "`n1. Testing GET /api/courses/" -ForegroundColor Yellow
try {
    $coursesResponse = Invoke-WebRequest -Uri "$baseUrl/api/courses/" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $courses = $coursesResponse.Content | ConvertFrom-Json
    Write-Host "✅ Courses found: $($courses.Count)" -ForegroundColor Green
    foreach ($course in $courses) {
        Write-Host "  - $($course.slug): $($course.title_en)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Error fetching courses" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 2: Get specific course (python)
Write-Host "`n2. Testing GET /api/courses/python/" -ForegroundColor Yellow
try {
    $pythonResponse = Invoke-WebRequest -Uri "$baseUrl/api/courses/python/" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $pythonCourse = $pythonResponse.Content | ConvertFrom-Json
    Write-Host "✅ Python course found!" -ForegroundColor Green
    Write-Host "  Title: $($pythonCourse.title_en)" -ForegroundColor Gray
    Write-Host "  Modules: $($pythonCourse.modules.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Python course not found" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

# Test 3: Get specific course (javascript)
Write-Host "`n3. Testing GET /api/courses/javascript/" -ForegroundColor Yellow
try {
    $jsResponse = Invoke-WebRequest -Uri "$baseUrl/api/courses/javascript/" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $jsCourse = $jsResponse.Content | ConvertFrom-Json
    Write-Host "✅ JavaScript course found!" -ForegroundColor Green
    Write-Host "  Title: $($jsCourse.title_en)" -ForegroundColor Gray
    Write-Host "  Modules: $($jsCourse.modules.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ JavaScript course not found" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
