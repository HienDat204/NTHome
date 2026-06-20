# Deployment Guide

## Các bước chuẩn bị Production

### 1. Cập nhật biến môi trường

Thay đổi file `.env.local`:

```env
# Tạo secret ngẫu nhiên: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=your_random_secret_here_min_32_chars

# Vercel Postgres (auto-injected khi Connect Storage)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# URL production
NEXTAUTH_URL=https://yourdomain.com
```

### 2. Generate build

```bash
npm run build
```

Kiểm tra xem có lỗi không.

### 3. Test production locally

```bash
npm run start
```

Truy cập: http://localhost:3000

## Deploy trên Vercel (Khuyến nghị)

### Bước 1: Push lên GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Bước 2: Kết nối Vercel

1. Truy cập https://vercel.com
2. Click "New Project"
3. Kết nối GitHub repository
4. Import project

### Bước 3: Cấu hình Environment

Tại Vercel Dashboard > Storage, tạo Postgres và Connect vào project để Vercel tự bơm:

```
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_URL
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

Thêm thủ công:

```
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://yourproject.vercel.app
```

### Bước 4: Database Migration

Tại Vercel Dashboard > Deployments, chạy:

```bash
npx prisma db push
npm run prisma:seed
```

Hoặc thêm vào `package.json`:
```json
"postinstall": "prisma db push && npm run prisma:seed"
```

### Bước 5: Deploy

Click Deploy - Vercel sẽ tự động build và deploy.

## Deploy trên Railway, Render, v.v.

### Bước 1: Chuẩn bị

- Commit toàn bộ file (trừ `.env.local`)
- Đảm bảo `database.db` không committed (check `.gitignore`)

### Bước 2: Chọn nền tảng

#### Railway:
```bash
railway link
railway up
```

#### Render:
1. Kết nối GitHub
2. Chọn branch main
3. Build command: `npm install && npx prisma migrate deploy && npm run prisma:seed`
4. Start command: `npm run start`

#### DigitalOcean:
1. Connect GitHub
2. Build command: `npm run build`
3. Run command: `npm run start`

### Bước 3: Set Environment

Add environment variables tương tự như Vercel.

## Optimize cho Production

### 1. Image Optimization

Update `next.config.js`:

```javascript
images: {
  domains: ['yourdomain.com', 'cdn.example.com'],
  formats: ['image/webp', 'image/avif']
}
```

### 2. Database Connection

Để SQLite, sử dụng Prisma với connection pooling:

```env
DATABASE_URL="file:./data/database.db"
```

Hoặc chuyển sang PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### 3. Cache & CDN

Thêm cache headers tại `next.config.js`:

```javascript
headers: async () => [{
  source: '/uploads/(.*)',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000' }
  ]
}]
```

### 4. Security Headers

Thêm vào `next.config.js`:

```javascript
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-XSS-Protection', value: '1; mode=block' }
  ]
}]
```

## Backup & Restore

### Backup Database

```bash
# PostgreSQL
pg_dump $POSTGRES_URL_NON_POOLING > backup.sql
```

### Restore Database

```bash
# PostgreSQL
psql $POSTGRES_URL_NON_POOLING < backup.sql
```

## Monitoring & Logs

### Vercel
- Dashboard > Deployments > Logs

### Railway
```bash
railway logs
```

### Local
```bash
npm run dev 2>&1 | tee logs.txt
```

## CI/CD with GitHub Actions

Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - run: npx prisma migrate deploy
```

## Domain Setup

### Kết nối custom domain tại Vercel

1. Project Settings > Domains
2. Thêm domain
3. Update DNS records (CNAME hoặc A)
4. Verify & activate

### DNS Records

```
CNAME: www.yourdomain.com -> cname.vercel-dns.com
A: yourdomain.com -> 76.76.19.0
```

## Support & Issues

### Lỗi thường gặp

**1. Database locked**
```bash
# Reset database
rm database/database.db
npx prisma migrate deploy
npm run prisma:seed
```

**2. Out of memory**
- Tăng Node memory: `NODE_OPTIONS=--max-old-space-size=2048`

**3. Build timeout**
- Tối ưu hóa imports
- Giảm bundle size

## Checklist Pre-Production

- [ ] Environment variables được cấu hình
- [ ] Database migration thành công
- [ ] Seed data đã được tạo
- [ ] NextAuth secret được thay đổi
- [ ] Build command kiểm tra thành công
- [ ] API routes hoạt động
- [ ] Admin login hoạt động
- [ ] Images tối ưu hóa
- [ ] SSL/HTTPS enabled
- [ ] Email notifications setup (nếu cần)
- [ ] Backup strategy lên kế hoạch

---

Dự án của bạn sẵn sàng production! 🚀
