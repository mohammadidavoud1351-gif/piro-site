# sync.ps1 — آپدیت سایت پیرو به GitHub
# استفاده: .\sync.ps1
# یا با پیام commit: .\sync.ps1 "توضیح تغییر"

param([string]$msg = "")

$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

Write-Host "`n=== پیرو — Sync to GitHub ===" -ForegroundColor Cyan

# وضعیت فعلی
$status = git status --short
if (-not $status) {
    Write-Host "هیچ تغییری نیست." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nتغییرات:" -ForegroundColor White
git status --short

# پیام commit
if (-not $msg) {
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    $msg = "update site $date"
}

Write-Host "`nCommit: $msg" -ForegroundColor Green

# stage + commit + push
git add -A
git commit -m $msg
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ آپلود شد! سایت در چند دقیقه آپدیت می‌شه." -ForegroundColor Green
    Write-Host "  https://piro-studio.github.io/piro/" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ خطا در push. لطفاً دستی بررسی کنید." -ForegroundColor Red
}
