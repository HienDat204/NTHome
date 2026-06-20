# Quick Start Guide

## Bước 1: Cài đặt Dependencies

Mở terminal tại thư mục `real-estate-site` và chạy:

```bash
npm install
```

## Bước 2: Khởi tạo Database

Chạy Prisma migration để tạo SQLite database:

```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ:
- Tạo file `database/database.db`
- Tạo tất cả các bảng theo schema
- Cho phép bạn đặt tên migration (ví dụ: "init")

## Bước 3: Seed Sample Data

Thêm dữ liệu mẫu để test:

```bash
npm run prisma:seed
```

Điều này sẽ tạo:
- 1 admin account: admin@example.com / 123456
- 6 bất động sản mẫu
- 3 dự án mẫu
- 2 bài viết mẫu
- Cấu hình website

## Bước 4: Chạy Development Server

```bash
npm run dev
```

Truy cập tại: http://localhost:3000

## Đăng nhập Admin

1. Truy cập: http://localhost:3000/admin/login
2. Email: admin@example.com
3. Password: 123456
4. Chuyển hướng đến: http://localhost:3000/admin/dashboard

## Hoặc Một Lệnh Duy Nhất

```bash
npm run setup
```

Lệnh này sẽ tự động chạy:
1. `npm install` - Cài dependencies
2. `npx prisma migrate dev` - Tạo database
3. `npm run prisma:seed` - Thêm dữ liệu mẫu

## Quản trị Database

Xem và quản lý database trực tiếp:

```bash
npx prisma studio
```

Sẽ mở Prisma Studio tại http://localhost:5555

## Build cho Production

```bash
npm run build
npm run start
```

## Các tệp quan trọng

- `.env.local` - Biến môi trường (thay đổi NEXTAUTH_SECRET)
- `prisma/schema.prisma` - Database schema
- `prisma/seed.js` - Dữ liệu seed
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - TailwindCSS configuration

## Troubleshooting

### Lỗi "Cannot find module"
- Chạy lại `npm install`

### Database bị khóa
- Xóa folder `.next` và chạy lại

### Port 3000 đã bị dùng
- Chạy: `npm run dev -- -p 3001`

## Các route chính

**Public:**
- / - Trang chủ
- /bat-dong-san - Danh sách bất động sản
- /bat-dong-san/[slug] - Chi tiết bất động sản
- /du-an - Danh sách dự án
- /du-an/[slug] - Chi tiết dự án
- /tin-tuc - Danh sách bài viết
- /tin-tuc/[slug] - Chi tiết bài viết
- /lien-he - Trang liên hệ

**Admin:**
- /admin/login - Đăng nhập
- /admin/dashboard - Bảng điều khiển
- /admin/properties - Quản lý bất động sản
- /admin/projects - Quản lý dự án
- /admin/articles - Quản lý bài viết
- /admin/contacts - Danh sách liên hệ
- /admin/settings - Cấu hình website

## API Endpoints

Tất cả API routes tại `/api/`:
- /api/properties
- /api/projects
- /api/articles
- /api/contacts
- /api/settings
- /api/auth/[...nextauth]
