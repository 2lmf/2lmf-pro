
# Image Optimization Script
Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [int]$Quality = 80
    )

    if (-not (Test-Path $SourcePath)) {
        Write-Host "File not found: $SourcePath" -ForegroundColor Red
        return
    }

    try {
        $img = [System.Drawing.Image]::FromFile($SourcePath)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

        if (Test-Path $DestPath) {
            Remove-Item $DestPath
        }

        $img.Save($DestPath, $codec, $encoderParams)
        $img.Dispose()

        $origSize = (Get-Item $SourcePath).Length / 1KB
        $newSize = (Get-Item $DestPath).Length / 1KB
        Write-Host "Optimized $SourcePath -> $DestPath ($([math]::Round($origSize))KB -> $([math]::Round($newSize))KB)" -ForegroundColor Green
    }
    catch {
        Write-Host "Error optimizing ${SourcePath}: $_" -ForegroundColor Red
    }
}

$baseDir = "c:\Users\Karlo\.gemini\antigravity\scratch\2lmf-web-kalkulator"

# Optimize Targets
Optimize-Image -SourcePath "$baseDir\stone_wool.png" -DestPath "$baseDir\stone_wool.jpg" -Quality 75
Optimize-Image -SourcePath "$baseDir\ventilated_facade.png" -DestPath "$baseDir\ventilated_facade.jpg" -Quality 75
Optimize-Image -SourcePath "$baseDir\ograde.jpg" -DestPath "$baseDir\ograde_opt.jpg" -Quality 75
