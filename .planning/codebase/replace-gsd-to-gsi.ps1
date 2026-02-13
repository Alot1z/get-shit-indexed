# GSI to GSI Bulk Replacement Script
$root = 'C:\github-repos\my-claude-code-repos\get-shit-indexed-code-index'
$exclude = @('node_modules', '.git', '.ignore')

# Get all .md files
$mdFiles = Get-ChildItem -Path $root -Filter '*.md' -Recurse | Where-Object { 
    $path = $_.FullName
    -not ($exclude | Where-Object { $path -like "*\$_\*" })
}

Write-Host "Found $($mdFiles.Count) .md files to process"

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
foreach ($file in $mdFiles) {
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
}
Write-Host "Updated $count .md files"
