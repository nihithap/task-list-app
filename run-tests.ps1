#!/usr/bin/env pwsh
# CI/CD Test Runner for Windows
# Run: .\run-tests.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Task List App - CI/CD Test Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

[int]$passed = 0
[int]$failed = 0

function Test-Item {
    param(
        [string]$TestName,
        [scriptblock]$TestCommand
    )
    
    Write-Host -NoNewline "Testing: $TestName ... "
    
    $result = $false
    $result = & $TestCommand
    if ($result -eq $true) {
        Write-Host "PASSED" -ForegroundColor Green
        $script:passed = $script:passed + 1
    }
    else {
        Write-Host "FAILED" -ForegroundColor Red
        $script:failed = $script:failed + 1
    }
}

# Test 1: Bundle Size Check
Write-Host "[1/8] Bundle Size Check" -ForegroundColor Yellow
Test-Item "index.html exists" { Test-Path "index.html" }
$size = (Get-Item "index.html").Length
$sizeCheck = $size -lt 100000
Test-Item "Bundle size under 100KB" { $sizeCheck }
Write-Host "      File size: $([Math]::Round($size/1024, 2)) KB" -ForegroundColor Gray

# Test 2: HTML Structure
Write-Host "`n[2/8] HTML Structure Validation" -ForegroundColor Yellow
$html = Get-Content "index.html" -Raw
Test-Item "Has task-input element" { $html -match 'id="task-input"' }
Test-Item "Has add-task-button element" { $html -match 'id="add-task-button"' }
Test-Item "Has task-list element" { $html -match 'id="task-list"' }

# Test 3: JavaScript Files
Write-Host "`n[3/8] JavaScript Files Check" -ForegroundColor Yellow
Test-Item "src/utils.js exists" { Test-Path "src/utils.js" }
Test-Item "src/constants.js exists" { Test-Path "src/constants.js" }
Test-Item "src/task-store.js exists" { Test-Path "src/task-store.js" }
Test-Item "src/ui.js exists" { Test-Path "src/ui.js" }
Test-Item "src/app.js exists" { Test-Path "src/app.js" }

# Test 4: Test Files
Write-Host "`n[4/8] Test Files Check" -ForegroundColor Yellow
Test-Item "tests/unit/ exists" { Test-Path "tests/unit" -PathType Container }
Test-Item "tests/integration/ exists" { Test-Path "tests/integration" -PathType Container }
Test-Item "Test files exist" { Test-Path "tests/integration/create-task.test.js" }

# Test 5: Documentation
Write-Host "`n[5/8] Documentation Check" -ForegroundColor Yellow
Test-Item "MVP-SUMMARY.md exists" { Test-Path "MVP-SUMMARY.md" }
Test-Item "PRODUCTION-DEPLOYMENT.md exists" { Test-Path "PRODUCTION-DEPLOYMENT.md" }
Test-Item "CHANGELOG.md exists" { Test-Path "CHANGELOG.md" }
Test-Item "CI-CD-PIPELINE.md exists" { Test-Path "CI-CD-PIPELINE.md" }

# Test 6: Configuration Files
Write-Host "`n[6/8] Configuration Files" -ForegroundColor Yellow
Test-Item "package.json exists" { Test-Path "package.json" }
Test-Item "jest.config.js exists" { Test-Path "jest.config.js" }
Test-Item "jest.setup.js exists" { Test-Path "jest.setup.js" }
Test-Item ".gitignore exists" { Test-Path ".gitignore" }

# Test 7: Git Repository
Write-Host "`n[7/8] Git Repository Check" -ForegroundColor Yellow
Test-Item "Git initialized" { Test-Path ".git" -PathType Container }
$remotes = git remote -v 2>$null
Test-Item "Remote configured" { $remotes -like "*origin*" }

# Test 8: Performance Documentation
Write-Host "`n[8/8] Performance Documentation" -ForegroundColor Yellow
Test-Item "Performance targets documented" { $html -match "second|1000ms|500ms" }
Test-Item "Offline capability mentioned" { $html -match "offline|localStorage" }

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

[int]$total = $passed + $failed
Write-Host "Passed: $passed/$total"
Write-Host "Failed: $failed/$total"

Write-Host ""

if ($failed -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "Some tests failed" -ForegroundColor Red
    exit 1
}
