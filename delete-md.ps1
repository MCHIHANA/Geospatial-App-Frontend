Write-Host "This will delete all .md files recursively in $PWD"
$confirm = Read-Host "Type 'Y' to proceed"
if ($confirm -ne 'Y') {
    Write-Host "Aborted"
    exit 1
}
Get-ChildItem -Path . -Filter *.md -Recurse -File | Remove-Item -Force
Write-Host "Done"
