const { execSync } = require('child_process');

if (process.platform !== 'win32') {
  process.exit(0);
}

const repoPath = process.cwd();
const psScript = `
$repo = '${repoPath}'
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -and $_.CommandLine -like ("*" + $repo + "*") } |
  ForEach-Object {
    try {
      Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop
      Write-Output ("[build] Stopped node process " + $_.ProcessId)
    } catch {
      Write-Output ("[build] Could not stop process " + $_.ProcessId + ": " + $_.Exception.Message)
    }
  }
`;

const encoded = Buffer.from(psScript, 'utf16le').toString('base64');

try {
  execSync(`powershell -NoProfile -EncodedCommand ${encoded}`, { stdio: 'inherit' });
} catch (_error) {
  // Continue; cleanup step will still detect lock if any remains.
  console.warn('[build] Process cleanup had issues, continuing to cache cleanup...');
}
