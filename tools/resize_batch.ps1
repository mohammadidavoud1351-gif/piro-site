# resize_batch.ps1 - Batch resize staged images to 1500px wide, quality 88
# Usage: .\resize_batch.ps1

Add-Type -AssemblyName System.Drawing

$stagingDir = "C:\Users\user\Desktop\Claude code\piro-site\images\_staging"
$outputDir  = "C:\Users\user\Desktop\Claude code\piro-site\images"
$targetWidth = 1500
$quality = 88L

$files = Get-ChildItem -Path $stagingDir -Filter "*.jpg"
$total = $files.Count
$done  = 0
$errors = @()

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$qualityParam = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qualityParam.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, $quality)

foreach ($file in $files) {
    $destPath = Join-Path $outputDir $file.Name
    try {
        $src = [System.Drawing.Image]::FromFile($file.FullName)
        $origW = $src.Width
        $origH = $src.Height

        if ($origW -gt $targetWidth) {
            $ratio  = $targetWidth / $origW
            $newW   = $targetWidth
            $newH   = [int]($origH * $ratio)
        } else {
            $newW = $origW
            $newH = $origH
        }

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g   = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($src, 0, 0, $newW, $newH)
        $g.Dispose()
        $src.Dispose()

        $bmp.Save($destPath, $jpegCodec, $qualityParam)
        $bmp.Dispose()

        $sizekb = [int]((Get-Item $destPath).Length / 1024)
        Write-Host "OK  $($file.Name)  ${origW}x${origH} -> ${newW}x${newH}  ${sizekb}KB"
        $done++
    } catch {
        $errors += $file.Name
        Write-Host "ERR $($file.Name): $_"
    }
}

Write-Host ""
Write-Host "Done: $done / $total"
if ($errors.Count -gt 0) {
    Write-Host "Errors: $($errors -join ', ')"
}
