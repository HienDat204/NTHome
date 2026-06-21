# Database Backup & Restore Guide

## Vị trí Database
Database SQLite nằm ở: `database/database.db`

## Backup Database

### Tự động (khuyến nghị)
Tạo script backup tự động:

```bash
# Windows (PowerShell)
Copy-Item database\database.db database\database.backup.db

# Linux/Mac
cp database/database.db database/database.backup.db
```

### Thủ công
1. Copy file `database/database.db` sang vị trí an toàn
2. Đặt tên theo ngày: `database-YYYYMMDD.db`

## Restore Database

### Từ backup file
```bash
# Windows (PowerShell)
Copy-Item database\database.backup.db database\database.db -Force

# Linux/Mac
cp database/database.backup.db database/database.db
```

## Lưu ý quan trọng

### ✅ AN TOÀN - Database KHÔNG bị mất khi:
- Run `npm run dev` (development mode)
- Run `npm run build` (production build)
- Git pull/push (database.db đã trong .gitignore)
- Cài đặt dependencies (`npm install`)

### ⚠️ CHÚ Ý - Database có thể bị mất khi:
- Xóa thư mục `database/`
- Run migration sai (`npx prisma migrate reset` - XÓA TẤT CẢ DỮ LIỆU)
- Deploy lên server mới mà không copy database

## Migration An toàn

### Khi thêm field mới hoặc thay đổi schema:
```bash
# Tạo migration (an toàn)
npx prisma migrate dev --name ten_migration

# Chỉ update Prisma Client (không đụng database)
npx prisma generate
```

### ❌ TUYỆT ĐỐI KHÔNG dùng:
```bash
# XÓA TOÀN BỘ DATABASE!
npx prisma migrate reset

# Trừ khi bạn muốn reset về trạng thái ban đầu
```

## Kiểm tra dữ liệu

```bash
# Đếm số projects
sqlite3 database/database.db "SELECT COUNT(*) FROM Project;"

# Đếm số properties
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"

# Xem tất cả projects
sqlite3 database/database.db "SELECT id, name, slug FROM Project;"

# Kiểm tra images của project
sqlite3 database/database.db "SELECT projectId, COUNT(*) FROM ProjectImage GROUP BY projectId;"
```

## Export/Import dữ liệu

### Export sang SQL file
```bash
sqlite3 database/database.db .dump > backup.sql
```

### Import từ SQL file
```bash
sqlite3 database/database.db < backup.sql
```

## Tình huống Deploy Production

### Chuẩn bị:
1. Backup database hiện tại
2. Copy file `database.db` vào server
3. Đảm bảo folder `database/` có quyền write

### Trên server:
```bash
# Tạo thư mục nếu chưa có
mkdir -p database

# Copy database từ local
scp database/database.db user@server:/path/to/app/database/

# Hoặc sử dụng rsync
rsync -avz database/database.db user@server:/path/to/app/database/
```

## File .env.local
Đảm bảo có cấu hình đúng:

```env
DATABASE_URL="file:../database/database.db"
```

## Giải pháp backup tự động

Tạo script `backup.js`:

```javascript
const fs = require('fs');
const path = require('path');

const date = new Date().toISOString().split('T')[0];
const source = path.join(__dirname, 'database', 'database.db');
const dest = path.join(__dirname, 'database', `backup-${date}.db`);

fs.copyFileSync(source, dest);
console.log(`✅ Backup created: backup-${date}.db`);
```

Chạy định kỳ:
```bash
node backup.js
```

## Troubleshooting

### Database bị lock
```bash
# Xóa file lock
rm database/database.db-journal
```

### Migration bị lỗi
```bash
# Xóa migrations lỗi
rm -rf prisma/migrations/[tên-migration-lỗi]

# Tạo lại migration
npx prisma migrate dev --name ten_moi
```

### File .next gây lỗi EPERM
```bash
# Xóa cache Next.js
rm -rf .next

# Build lại
npm run build
```
