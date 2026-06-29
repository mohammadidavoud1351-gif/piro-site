# resize.ps1 — Resize/optimize a JPG for web using System.Drawing
# Usage: powershell -File resize.ps1 -Src "<source>" -Dst "<dest.jpg>" -MaxW 1400 -Quality 82
param(
  [Parameter(Mandatory=$true)][string]$Src,
  [Parameter(Mandatory=$true)][string]$Dst,
  [int]$MaxW = 1400,
  [int]$Quality = 82
)
Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile($Src)
$ratio = $img.Height / $img.Width
$w = [Math]::Min($MaxW, $img.Width)
$h = [int]($w * $ratio)

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, 0, 0, $w, $h)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

$dir = Split-Path $Dst
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
$bmp.Save($Dst, $codec, $ep)

$g.Dispose(); $bmp.Dispose(); $img.Dispose()
$kb = [math]::Round((Get-Item $Dst).Length / 1KB)
Write-Output "OK: $Dst  (${w}x${h}, ${kb}KB)"
