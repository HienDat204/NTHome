# 🚀 TURSO IMPORT GUIDE - SQLite Database với WAL Mode

## ✅ ĐÃ HOÀN THÀNH

Database đã được chuyển sang **WAL (Write-Ahead Logging) mode** thành công!

```
✅ Journal mode: WAL
✅ Database size: 15.53 MB
✅ Properties: 7
✅ Projects: 3
✅ Articles: 2
```

## 📁 File Database

**Location:** `e:\GIT\NTHome\NTHome\database\database.db`

**Thông tin:**
- Size: 15.53 MB
- Pages: 3,976
- Page size: 4,096 bytes
- Mode: WAL (Write-Ahead Logging)

## 🚀 IMPORT VÀO TURSO

### Cách 1: Turso Web UI (Khuyến nghị)

**Bước 1: Đăng nhập Turso**
```
https://app.turso.tech/
```

**Bước 2: Tạo Database mới**
1. Click "Create Database"
2. Chọn "Import from SQLite"
3. Upload file: `database/database.db`
4. Đặt tên database: `nthome-db` (hoặc tên bạn muốn)
5. Chọn region: Closest to you (Singapore hoặc Tokyo)
6. Click "Create"

**Bước 3: Lấy Database URL**

Sau khi tạo xong, Turso sẽ hiển thị:
```
Database URL: libsql://nthome-db-xxxxx.turso.io
Auth Token: eyJhbGc...
```

**Lưu lại** 2 thông tin này!

### Cách 2: Turso CLI

**Bước 1: Install Turso CLI**
```bash
# Windows (PowerShell)
irm https://get.turso.tech/install.ps1 | iex

# Mac/Linux
curl -sSfL https://get.turso.tech/install.sh | bash
```

**Bước 2: Login**
```bash
turso auth login
```

**Bước 3: Import Database**
```bash
# Navigate to project folder
cd e:\GIT\NTHome\NTHome

# Create database from file
turso db create nthome-db --from-file database/database.db

# Get connection string
turso db show nthome-db
```

**Bước 4: Tạo Auth Token**
```bash
turso db tokens create nthome-db
```

## 🔧 CẤU HÌNH PROJECT

### 1. Update Environment Variables

**File:** `.env` hoặc `.env.local`

```env
# Turso Database (Production)
DATABASE_URL="libsql://nthome-db-xxxxx.turso.io"
TURSO_AUTH_TOKEN="eyJhbGc..."

# NextAuth
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-app.railway.app"

# Node
NODE_ENV="production"
```

### 2. Update Prisma Schema

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Models giữ nguyên...
```

**Lưu ý:** Turso dùng `libsql://` protocol, nhưng Prisma vẫn set provider = "sqlite"

### 3. Install Turso Client (Optional)

Nếu dùng Turso features nâng cao:

```bash
npm install @libsql/client
```

## 🚀 DEPLOY LÊN RAILWAY

### Bước 1: Set Environment Variables

**Railway Dashboard → Variables:**

```
DATABASE_URL=libsql://nthome-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-app.railway.app
NODE_ENV=production
```

### Bước 2: Update Build Command

**Railway Dashboard → Settings → Build:**

```
Build Command: npm run build:railway
Start Command: npm start
```

**Lưu ý:** KHÔNG chạy `prisma migrate deploy` với Turso production database!

### Bước 3: Deploy

```bash
git add .
git commit -m "feat: migrate to Turso database"
git push origin main
```

Railway sẽ tự động deploy với Turso database.

## 📊 SO SÁNH: LOCAL VS TURSO

| Feature | Local SQLite | Turso |
|---------|-------------|-------|
| Location | `database/database.db` | Cloud (Edge) |
| Connection | `file:./database.db` | `libsql://...` |
| Auth | None | Token required |
| Replicas | No | Yes (Global) |
| Backups | Manual | Automatic |
| Scaling | Single server | Edge network |
| Cost | Free | Free tier: 500 DBs, 9 GB storage |

## 🧪 TEST CONNECTION

### Test Turso Connection

**Create:** `scripts/test-turso.js`

```javascript
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function testConnection() {
  try {
    const result = await client.execute('SELECT COUNT(*) as count FROM Property');
    console.log('✅ Turso connected!');
    console.log('Properties:', result.rows[0].count);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

**Run:**
```bash
node scripts/test-turso.js
```

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Migrations

**LOCAL (Development):**
```bash
# Run migrations normally
npx prisma migrate dev
```

**TURSO (Production):**
```bash
# DON'T run migrate deploy on production!
# Turso database is already populated from import

# Instead, for schema changes:
1. Test migration locally
2. Export updated database
3. Re-import to Turso (or use schema sync tools)
```

### 2. Seed Data

**Không seed trên production:**
```bash
# NEVER run on production Turso
npm run prisma:seed  # ❌ DON'T!

# Seed data đã có trong database import rồi
```

### 3. Backups

**Turso tự động backup**, nhưng bạn nên:

```bash
# Backup định kỳ về local
turso db dump nthome-db > backup-$(date +%Y%m%d).sql

# Hoặc dùng Turso web UI → Export
```

### 4. Schema Changes

Khi thay đổi schema trong development:

```bash
# 1. Test locally
npx prisma migrate dev --name add_new_field

# 2. Nếu OK, export database mới
node scripts/convert-to-wal-simple.js

# 3. Re-import to Turso (create new database or update)
turso db create nthome-db-v2 --from-file database/database.db
```

## 🎯 CHECKLIST DEPLOY

- [x] Convert database to WAL mode
- [x] Database file ready: `database/database.db`
- [ ] Create Turso account
- [ ] Import database to Turso
- [ ] Get DATABASE_URL and TURSO_AUTH_TOKEN
- [ ] Update Railway environment variables
- [ ] Update build command: `npm run build:railway`
- [ ] Push code to Git
- [ ] Verify deployment
- [ ] Test production site

## 📚 RESOURCES

- **Turso Docs:** https://docs.turso.tech/
- **Prisma + Turso:** https://www.prisma.io/docs/guides/database/turso
- **Turso Dashboard:** https://app.turso.tech/
- **Turso CLI:** https://docs.turso.tech/cli/introduction

## 🎉 KẾT QUẢ

**TRƯỚC:**
```
❌ Local SQLite only
❌ Single server
❌ No automatic backups
```

**SAU:**
```
✅ Turso Cloud Database (Edge)
✅ Global replicas
✅ Automatic backups
✅ Production ready
✅ Free tier available
```

---

**🚀 DATABASE ĐÃ SẴN SÀNG IMPORT VÀO TURSO!**

Upload file `database/database.db` vào https://app.turso.tech/
