# Auto-startup hook for CodeGraphContext MCP server
# When Claude Code starts, automatically start CG server if not running

$CG_SERVER_NAME = "CodeGraphContext"
$CG_SERVER_EXE = "cgc.EXE"

# Check if CG server process is running
$CG_PROCESS = Get-Process | Where-Object ($_.EXE -like "*$CG_SERVER_EXE*") -ErrorAction SilentlyContinue
if ($CG_PROCESS) {
    Write-Host "CG Server already running, skipping auto-start"
    exit 0
}

# Start CG server
Write-Host "Starting $CG_SERVER_NAME server..."
$StartInfo = Start-Process -FilePath "C:\Users\mose\AppData\Roaming\Python314\Scripts\cgc.EXE" -ArgumentList "mcp","start" -PassThru -NoNewWindow -WindowStyle Hidden
$CG_SERVER = $StartInfo.Register($false)

# Wait for server to be ready
Start-Sleep -Seconds 5
Write-Host "Waiting for $CG_SERVER_NAME to initialize..."
try {
    $CG_SERVER.WaitForExit(30000) # Wait up to 30 seconds for server to respond
    Write-Host "$CG_SERVER_NAME server started successfully (PID: $($CG_SERVER.Id))"
    exit 0
}
catch {
    Write-Host "ERROR: Failed to start $CG_SERVER_NAME server: $_"
    exit 1
}

# Register with GSI workflows
# After server starts, register it so GSI workflows can use CG tools
Write-Host "Registering with GSI workflows..."
& "$CG_SERVER_EXE" mcp add_code_to_graph
Write-Host "Auto-startup hook complete"
