# Setup Fresh Database - Run this in PowerShell
# =============================================
# 1. Xoa DB cu
$dbPath = "E:\GIT\NTHome\NTHome\database\database.db"
$journalPath = "E:\GIT\NTHome\NTHome\database\database.db-journal"
$lockPath = "E:\GIT\NTHome\NTHome\database\database.db-lock"

if (Test-Path $dbPath) {
    Remove-Item $dbPath -Force
    Write-Host "[OK] Deleted: $dbPath"
} else {
    Write-Host "[--] No old database found."
}
if (Test-Path $journalPath) { Remove-Item $journalPath -Force }
if (Test-Path $lockPath) { Remove-Item $lockPath -Force }

# 2. Tao thu muc database
$dbDir = Split-Path $dbPath -Parent
if (-not (Test-Path $dbDir)) {
    New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
}

# 3. Setup env
$env:DATABASE_URL = "file:./database/database.db"

# 4. Prisma db push
Write-Host "`n[1/2] Running prisma db push..."
npx prisma db push --skip-generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] prisma db push failed."
    exit 1
}

# 5. Seed data
Write-Host "`n[2/2] Running prisma db seed..."
npx prisma db seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] prisma db seed failed."
    exit 1
}

Write-Host "`n============================================="
Write-Host "  DONE! Database is ready."
Write-Host "  Start dev server: npm run dev"
Write-Host "============================================="
