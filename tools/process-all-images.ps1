# process-all-images.ps1 - Resize and optimize PIRO product images
# Output: images/{id}.jpg (industrial) and images/{id}-d.jpg (decorative)

$base     = "E:\Claude code\Content\Photos\Products"
$dstDir   = "C:\Users\user\Desktop\Claude code\piro-site\images"
$resizeSc = "C:\Users\user\Desktop\Claude code\piro-site\tools\resize.ps1"

if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }

$ok   = 0
$skip = 0

function Invoke-Resize {
    param([string]$src, [string]$dst)
    if ($src -eq 'NONE') { return $false }
    $fullSrc = Join-Path $base $src
    if (-not (Test-Path $fullSrc)) {
        Write-Warning "NOT FOUND: $fullSrc"
        return $false
    }
    try {
        $out = & powershell -File $resizeSc -Src $fullSrc -Dst $dst -MaxW 1600 -Quality 88 2>&1
        Write-Host $out
        return $true
    } catch {
        Write-Warning "FAILED: $fullSrc -> $_"
        return $false
    }
}

# id | industrial_rel | decorative_rel
$mapping = @(
  @{id='alto';         ind='Bar table - Alto - 5501\piro\_DSC2567.jpg';                        dec='Bar table - Alto - 5501\_DSC2567.jpg'},
  @{id='alef';         ind='Barstool - Aleph - 2401\piro\_DSC7325.jpg';                        dec='Barstool - Aleph - 2401\@_DSC9315.jpg'},
  @{id='leanbar';      ind='Barstool - Lean - 2403\piro\_DSC0418.jpg';                         dec='Barstool - Lean - 2403\@_DSC9235.jpg'},
  @{id='elara160';     ind='NONE';                                                               dec='Bedstead - ELARA 160\@_DSC3234.jpg'},
  @{id='linda160';     ind='Bedstead - Linda 160 - 4109\piro\_DSC0802.jpg';                     dec='Bedstead - Linda 160 - 4109\_DSC0802.jpg'},
  @{id='neda160';      ind='Bedstead - Neda 160 - 4102\DK 4102\1.jpg';                          dec='Bedstead - Neda 160 - 4102\4102001\IMG_1305.jpg'},
  @{id='neda90';       ind='Bedstead - Neda 90 - 4112\piro\_DSC3830.jpg';                       dec='Bedstead - Neda 90 - 4112\_DSC3829.jpg'},
  @{id='nosha160';     ind='Bedstead - Nosha 160 - 4101\dk 4101\1.jpg';                         dec='Bedstead - Nosha 160 - 4101\4101001\_DSC3268.jpg'},
  @{id='nosha90';      ind='Bedstead - Nosha 90 - 4105\piro\_DSC0787.jpg';                      dec='Bedstead - Nosha 90 - 4105\_DSC0787.jpg'},
  @{id='lat120';       ind='Bench - Lat 120 - 2301\piro\_DSC3072.jpg';                          dec='Bench - Lat 120 - 2301\2301001\_DSC3076.jpg'},
  @{id='lat150';       ind='Bench - Lat 150 - 2304\piro\_DSC0410.jpg';                          dec='Bench - Lat 150 - 2304\_DSC0410.jpg'},
  @{id='lat200';       ind='Bench - Lat 200 - 2303\piro\_DSC0405.jpg';                          dec='Bench - Lat 200 - 2303\_DSC0405.jpg'},
  @{id='mogensen';     ind='Bench - Mogensen - 2302\piro\_DSC3717.jpg';                         dec='Bench - Mogensen - 2302\_DSC3717.jpg'},
  @{id='mogensen2';    ind='Bench - Mogensen - 2305\piro\_DSC0824.jpg';                         dec='Bench - Mogensen - 2305\_DSC0824.jpg'},
  @{id='cabinet';      ind='Cabinet - Mood - 3503\DK 3503\_DSC3751.jpg';                        dec='Cabinet - Mood - 3503\3503001\IMG_1187.jpg'},
  @{id='chairb';       ind='Chair - B - 2107\piro\1.jpg';                                       dec='Chair - B - 2107\_DSC7299.jpg'},
  @{id='hyrcani';      ind='Chair - Hyrcani -  2105\piro\_DSC3653.jpg';                         dec='Chair - Hyrcani -  2105\2105002\_DSC3110.jpg'},
  @{id='lean';         ind='Chair - Lean - 2113\piro\_DSC2071.jpg';                             dec='Chair - Lean - 2113\_DSC2071.jpg'},
  @{id='zen';          ind='Chair - Zen - 2109\piro\1.jpg';                                     dec='Chair - Zen - 2109\_DSC7264.jpg'},
  @{id='tana';         ind='Clothes Hanger - Tana - 6311\piro\garment rack with shelves 01.jpg'; dec='Clothes Hanger - Tana - 6311\_DSC2652.jpg'},
  @{id='emi';          ind='Coffee Table - EMI - 5105\tech.jpg';                                dec='Coffee Table - EMI - 5105\_DSC7493.jpg'},
  @{id='en';           ind='Coffee Table - EN - 5101\piro\_DSC7240.jpg';                        dec='Coffee Table - EN - 5101\_DSC7240.jpg'},
  @{id='kazoko';       ind='Coffee Table - Kazoko - 5104\DK 5104\1.jpg';                        dec='Coffee Table - Kazoko - 5104\5104001\@_DSC4259.jpg'},
  @{id='sencilla';     ind='Coffee Table - Sencilla - 5108\piro\_DSC0456.jpg';                  dec='Coffee Table - Sencilla - 5108\_DSC0456.jpg'},
  @{id='shonin';       ind='Coffee Table - Shonin - 5103\dk 5103\1.jpg';                        dec='Coffee Table - Shonin - 5103\_DSC2174.jpg'},
  @{id='coffeesimple'; ind='Coffee Table - Simple - 5107\tech.jpg';                             dec='Coffee Table - Simple - 5107\_DSC2189.jpg'},
  @{id='console110';   ind='Console - Mood 110 - 3103\piro\_DSC3158.jpg';                       dec='Console - Mood 110 - 3103\@_DSC9235.jpg'},
  @{id='console130';   ind='Console - Mood 130 - 3102\piro\_DSC3158.jpg';                       dec='Console - Mood 130 - 3102\3102001\IMG_0465.jpg'},
  @{id='arasbaran6';   ind='Dining Table - Arasbaran 6 - 5301\piro\_DSC3649.jpg';               dec='Dining Table - Arasbaran 6 - 5301\5301001\@_DSC4455.jpg'},
  @{id='arasbaran8';   ind='Dining Table - Arasbaran 8 - 5305\tech.jpg';                        dec='Dining Table - Arasbaran 8 - 5305\5305001\_DSC55099.jpg'},
  @{id='cerca4';       ind='Dining Table - Cerca 4 - 5310\piro\_DSC2617.jpg';                   dec='Dining Table - Cerca 4 - 5310\_DSC2617.jpg'},
  @{id='cerca8';       ind='Dining Table - Cerca 8 - 5316\piro\_DSC3711.jpg';                   dec='Dining Table - Cerca 8 - 5316\_DSC3711.jpg'},
  @{id='diningmood';   ind='Dining Table - Mood - 5302\DK 5302\1.jpg';                          dec='Dining Table - Mood - 5302\5302001\_DSC1902.jpg'},
  @{id='ox';           ind='Dining Table - OX - 5307\piro\_DSC8286.jpg';                        dec='Dining Table - OX - 5307\_DSC8286.jpg'},
  @{id='pianura';      ind='Dining Table - pianura - 5319\piro\des table.jpg';                  dec='Dining Table - pianura - 5319\_DSC2606.jpg'},
  @{id='diningsimple'; ind='Dining Table - Simple - 5309\tech.jpg';                             dec='Dining Table - Simple - 5309\_DSC8220.jpg'},
  @{id='talk';         ind='NONE';                                                               dec='Dining Table - Talk - 5308\_DSC9070.jpg'},
  @{id='kaya4';        ind='NONE';                                                               dec='Dining Table -Kaya 4\@_DSC31892.jpg'},
  @{id='dresser';      ind='Dresser - Mood - 3602\piro\_DSC0728.jpg';                           dec='Dresser - Mood - 3602\_DSC0728.jpg'},
  @{id='dresser2';     ind='Dresser - Mood Large - 3603\piro\_DSC0765.jpg';                     dec='Dresser - Mood Large - 3603\_DSC0765.jpg'},
  @{id='kido2';        ind='Floor Lamp - Kido - 6102\DK 6102\1.jpg';                            dec='Floor Lamp - Kido - 6102\6102001\_DSC0587_resize.jpg'},
  @{id='kido';         ind='Floor Lamp - Kido - 6103\piro\_DSC7899.jpg';                        dec='Floor Lamp - Kido - 6103\_DSC7899.jpg'},
  @{id='rash';         ind='Floor Lamp - Rash - 6101\DK 6101\1.jpg';                            dec='Floor Lamp - Rash - 6101\_DSC2174.jpg'},
  @{id='freshboxl';    ind='Fresh Box  - Large - 3506\piro\_DSC2118.jpg';                       dec='Fresh Box  - Large - 3506\_DSC2118.jpg'},
  @{id='freshboxs';    ind='Fresh box - Small - 3505\piro\_DSC2148.jpg';                        dec='Fresh box - Small - 3505\_DSC2148.jpg'},
  @{id='blando';       ind='Lounge Chair - Blando - 2205\piro\_DSC7701.jpg';                    dec='Lounge Chair - Blando - 2205\_DSC7694.jpg'},
  @{id='lam';          ind='Lounge Chair - Lam - 2201\piro\_DSC3851.jpg';                       dec='Lounge Chair - Lam - 2201\2201001\_DSC3851.jpg'},
  @{id='diba2';        ind='Loveseat - Diba 2 - 2554\piro\_DSC0708.jpg';                        dec='Loveseat - Diba 2 - 2554\_DSC0708.jpg'},
  @{id='diba3';        ind='Loveseat - Diba 3 - 2526\piro\_DSC7387.jpg';                        dec='Loveseat - Diba 3 - 2526\_DSC7387.jpg'},
  @{id='hamdam';       ind='Loveseat - Hamdam - 2202\piro\@_DSC4549.jpg';                       dec='Loveseat - Hamdam - 2202\2202001\_DSC3808 Tall.jpg'},
  @{id='sense';        ind='Make up table - sense - 3106\tech.jpg';                             dec='Make up table - sense - 3106\_DSC2635.jpg'},
  @{id='mirror';       ind='Mirror - Miro - 6210\piro\@_DSC4318.png';                           dec='Mirror - Miro - 6210\_DSC3299P.jpg'},
  @{id='mono';         ind='Nightstand - Mono - 3308\piro\_DSC2718.jpg';                        dec='Nightstand - Mono - 3308\_DSC2718.jpg'},
  @{id='nightmood';    ind='Nightstand - Mood - 3302\piro\_DSC3469.jpg';                        dec='Nightstand - Mood - 3302\3302001\IMG_0567.jpg'},
  @{id='piso';         ind='NONE';                                                               dec='Shelf - piso - 6312\_DSC2674 copy.jpg'},
  @{id='sheen2s';      ind='Shelf - Sheen - Short - 2S - 6305\tech.jpg';                        dec='Shelf - Sheen - Short - 2S - 6305\_DSC3120.jpg'},
  @{id='sheen3s';      ind='Shelf - Sheen - Short - 3S - 6303\piro\_DSC1725.jpg';               dec='Shelf - Sheen - Short - 3S - 6303\6303001\_DSC1725.jpg'},
  @{id='sheentall';    ind='Shelf - Sheen - Tall - 6301\piro\_DSC3130.jpg';                     dec='Shelf - Sheen - Tall - 6301\6301001\_DSC3130.jpg'},
  @{id='sheenw';       ind='Shelf - Sheen - Wide - 6302\piro\@_DSC4363.jpg';                    dec='Shelf - Sheen - Wide - 6302\6302001\@_DSC4363.jpg'},
  @{id='sideen';       ind='Side Table - EN - 5201\DK 5201\1.jpg';                              dec='Side Table - EN - 5201\_DSC3455 E.jpg'},
  @{id='sidemore';     ind='Side Table - More - 3303\piro\_DSC8144.jpg';                        dec='Side Table - More - 3303\_DSC8144.jpg'},
  @{id='nik';          ind='Side Table - Nik - 5205\tech.jpg';                                  dec='Side Table - Nik - 5205\_DSC9023.jpg'},
  @{id='sidesencilla'; ind='Side Table - Sencilla - 5213-14\piro\_DSC0362.jpg';                 dec='Side Table - Sencilla - 5213-14\_DSC0362.jpg'},
  @{id='shonins';      ind='Side Table - Shonin - 5207\DK 5208\1 (2).jpg';                      dec='Side Table - Shonin - 5207\_DSC2174.jpg'},
  @{id='sideboard';    ind='Sideboard - Mood - 3203\piro\_DSC35491.jpg';                        dec='Sideboard - Mood - 3203\3203001\IMG_1090.jpg'},
  @{id='sideboard2';   ind='Sideboard - Mood - 3204\piro\_DSC55829.jpg';                        dec='Sideboard - Mood - 3204\3204001\_DSC55829.jpg'},
  @{id='gordo1';       ind='Sofa - Gordo 1 - 2553\piro\IMG_7266س.jpg';                          dec='NONE'},
  @{id='gordo2';       ind='Sofa - Gordo 2 - 2544\piro\_DSC2808.jpg';                           dec='Sofa - Gordo 2 - 2544\_DSC2808.jpg'},
  @{id='gordocl';      ind='Sofa - Gordo 2 + Chaise Lounge - 2547\piro\_DSC8477.jpg';           dec='Sofa - Gordo 2 + Chaise Lounge - 2547\_DSC8477.jpg'},
  @{id='henka';        ind='Sofa - Henka - 2590\piro\_DSC5157.jpg';                             dec='NONE'},
  @{id='hermosa1';     ind='NONE';                                                               dec='Sofa - Hermosa 1 - 2583\_DSC2713.jpg'},
  @{id='hermosa2';     ind='Sofa - Hermosa 2 - 2584\piro\_DSC2708.jpg';                         dec='Sofa - Hermosa 2 - 2584\_DSC2708.jpg'},
  @{id='hermosa3';     ind='Sofa - Hermosa 3\piro\_DSC2708.jpg';                                dec='Sofa - Hermosa 3\_DSC2708.jpg'},
  @{id='muge1';        ind='NONE';                                                               dec='Sofa - Muge 1\_DSC5264.jpg'},
  @{id='muge2';        ind='NONE';                                                               dec='Sofa - Muge 2\_DSC5260 1500.jpg'},
  @{id='palma1';       ind='Sofa - Palma 1 - 2548\piro\_DSC9098.jpg';                           dec='Sofa - Palma 1 - 2548\_DSC9098.jpg'},
  @{id='palma2';       ind='Sofa - Palma 2 - 2549\piro\_DSC3705.jpg';                           dec='Sofa - Palma 2 - 2549\_DSC3705.jpg'},
  @{id='palma3';       ind='Sofa - Palma 3 - 2550\piro\_DSC0440.jpg';                           dec='Sofa - Palma 3 - 2550\_DSC0440.jpg'},
  @{id='palmacl';      ind='Sofa - Palma Chaise Lounge - 2552\piro\_DSC3686.jpg';               dec='Sofa - Palma Chaise Lounge - 2552\_DSC3686.jpg'},
  @{id='palmal';       ind='Sofa - Palma L - 2569\piro\_DSC3673.jpg';                           dec='Sofa - Palma L - 2569\_DSC3673.jpg'},
  @{id='shito2';       ind='Sofa - Shito 2 - 2520\piro\_DSC2696.jpg';                           dec='Sofa - Shito 2 - 2520\_DSC2696.jpg'},
  @{id='shito3';       ind='Sofa - Shito 3 - 2521\piro\_DSC55519.jpg';                          dec='Sofa - Shito 3 - 2521\_DSC55519.jpg'},
  @{id='shitocl';      ind='Sofa - Shito Chaise Lounge - 2523\piro\_DSC55239.jpg';              dec='Sofa - Shito Chaise Lounge - 2523\2523001\_DSC55239.jpg'},
  @{id='shitol';       ind='Sofa - Shito L - 2529\piro\IMG_7060.jpg';                           dec='NONE'},
  @{id='tehran1';      ind='Sofa - Tehran 1 - 2534\piro\_DSC7415.jpg';                          dec='Sofa - Tehran 1 - 2534\_DSC7415 cr.jpg'},
  @{id='tehran25';     ind='Sofa - Tehran 2.5 - 2501\piro\@_DSC4518.jpg';                       dec='Sofa - Tehran 2.5 - 2501\2501001\@_DSC4518.jpg'},
  @{id='tehran35';     ind='Sofa - Tehran 3.5 - 2503\piro\@_DSC4518.jpg';                       dec='Sofa - Tehran 3.5 - 2503\2503001\@_DSC4518.jpg'},
  @{id='tehrancl';     ind='Sofa - Tehran Chaise Lounge - 2562\piro\teh ch 2.jpg';              dec='NONE'},
  @{id='tehranl';      ind='Sofa - Tehran L -2506\piro\@_DSC4553.jpg';                          dec='Sofa - Tehran L -2506\2506001\_DSC1706.jpg'},
  @{id='largo';        ind='TV Console - Largo - 3406\piro\_DSC2090.jpg';                       dec='TV Console - Largo - 3406\_DSC2090.jpg'},
  @{id='tvmood2';      ind='TV Console - Mood 2 - 3407\piro\IMG_711.jpg';                       dec='NONE'},
  @{id='tvmood3';      ind='TV Console - Mood 3 - 3401\piro\@_DSC3960.jpg';                     dec='TV Console - Mood 3 - 3401\3401001\_DSC0346.jpg'},
  @{id='etude';        ind='NONE';                                                               dec='Writing Desk - Etude\@_DSC3174.jpg'},
  @{id='rain';         ind='NONE';                                                               dec='Writing Desk - Rain - 5412\_DSC7349.jpg'},
  @{id='sketch';       ind='NONE';                                                               dec='Writing Desk - Sketch - 5401\5401004\_DSC0753.jpg'}
)

Write-Host "=== PIRO Image Processing Started ===" -ForegroundColor Cyan
Write-Host "Total products: $($mapping.Count)" -ForegroundColor Cyan
Write-Host ""

foreach ($item in $mapping) {
    $id  = $item.id
    $ind = $item.ind
    $dec = $item.dec

    # ----- industrial -----
    if ($ind -ne 'NONE') {
        $dst = Join-Path $dstDir "$id.jpg"
        $result = Invoke-Resize -src $ind -dst $dst
        if ($result) { $ok++ } else { $skip++ }
    }

    # ----- decorative -----
    if ($dec -ne 'NONE') {
        $dst = Join-Path $dstDir "$id-d.jpg"
        # if same source as industrial, just copy the already-processed file
        if ($dec -eq $ind -and $ind -ne 'NONE') {
            $indDst = Join-Path $dstDir "$id.jpg"
            if (Test-Path $indDst) {
                Copy-Item $indDst $dst -Force
                Write-Host "COPY: $id-d.jpg (same as industrial)" -ForegroundColor DarkGray
                $ok++
            }
        } else {
            $result = Invoke-Resize -src $dec -dst $dst
            if ($result) { $ok++ } else { $skip++ }
        }
    }

    # if both are NONE
    if ($ind -eq 'NONE' -and $dec -eq 'NONE') {
        Write-Warning "BOTH NONE: $id - skip"
        $script:skip++
    }
}

Write-Host ""
Write-Host "=== Processing Complete ===" -ForegroundColor Green
Write-Host "Successful: $ok" -ForegroundColor Green
Write-Host "Failed/Skipped: $skip" -ForegroundColor Yellow
