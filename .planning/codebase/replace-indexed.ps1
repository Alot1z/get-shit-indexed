# GSD to GSI Replacement Script for get-shit-indexed directory
$targetDir = 'C:\github-repos\my-claude-code-repos\get-shit-done-code-index\get-shit-indexed'

# Get all files
$files = Get-ChildItem -Path $targetDir -Include '*.md','*.json','*.js','*.ts' -Recurse

Write-Host "Found $($files.Count) files to process in get-shit-indexed"

# Replacement patterns (order matters - most specific first)
$replacements = @(
    @{Old='GetShitDone'; New='GetShitIndexed'},
    @{Old='getShitDone'; New='getShitIndexed'},
    @{Old='Get Shit Done'; New='Get Shit Indexed'},
    @{Old='get-shit-done'; New='get-shit-indexed'},
    @{Old='get_shit_done'; New='get_shit_indexed'},
    @{Old='GSD'; New='GSI'},
    @{Old='gsd'; New='gsi'}
)

$count = 0
foreach ($file in $files) {
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
Write-Host "Updated $count files in get-shit-indexed"
