# GSI to GSI JS/TS Replacement Script
$root = 'C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index'
$exclude = @('node_modules', '.git', '.ignore')

# Get all .js and .ts files
$jsFiles = Get-ChildItem -Path $root -Include '*.js','*.ts' -Recurse | Where-Object { 
    $path = $_.FullName
    $isExcluded = $false
    foreach ($ex in $exclude) {
        if ($path -like "*\$ex\*") {
            $isExcluded = $true
            break
        }
    }
    -not $isExcluded
}

Write-Host "Found $($jsFiles.Count) .js/.ts files to process"

# Replacement patterns (order matters - most specific first)
$replacements = @(
    @{Old='GetShitIndexed'; New='GetShitIndexed'},
    @{Old='GetShitIndexed'; New='getShitIndexed'},
    @{Old='Get Shit Indexed'; New='Get Shit Indexed'},
    @{Old='get-shit-indexed'; New='get-shit-indexed'},
    @{Old='get_shit_indexed'; New='get_shit_indexed'},
    @{Old='GSI'; New='GSI'},
    @{Old='GSI'; New='gsi'}
)

$count = 0
foreach ($file in $jsFiles) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        foreach ($r in $replacements) {
            $content = $content -replace [regex]::Escape($r.Old), $r.New
        }
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $count++
            Write-Host "Updated: $($file.Name)"
        }
    } catch {
        Write-Host "Skipped: $($file.Name) - $($_.Exception.Message)"
    }
}
Write-Host "Updated $count .js/.ts files"
