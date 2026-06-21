# Real Estate Website - Next.js 15 + React 19

Website bất động sản chuyên nghiệp, production-ready với Next.js 14, React 18, TailwindCSS, Prisma ORM và PostgreSQL.

## 🚨 VẤN ĐỀ XÓA PROPERTY/PROJECT?

**➡️ ĐỌC NGAY: [DELETE_SOLUTION.md](DELETE_SOLUTION.md)**

### Quick Fix:
1. **PHẢI LOGIN ADMIN:** http://localhost:3000/admin/login
2. Mở DevTools (F12) → Network tab
3. Click "Xóa" → Xem alert "✅ Đã xóa thành công!"
4. Check Network status = 204 hoặc 200

**⚠️ Nếu thấy alert lỗi → Bạn chưa login! Quay lại bước 1.**

### Test & Debug Tools:
```bash
# Test trạng thái database
node test-complete.js

# Debug API delete
node debug-delete.js <property_id>

# Xóa trực tiếp database (bypass API - last resort)
node admin-delete-property.js <property_id>
node admin-delete-project.js <project_id>
```

### Documentation:
- **[DELETE_SOLUTION.md](DELETE_SOLUTION.md)** - ⭐ Giải pháp xóa triệt để
- [DELETE_TROUBLESHOOTING.md](DELETE_TROUBLESHOOTING.md) - Troubleshooting chi tiết
- [DELETE_FIX.md](DELETE_FIX.md) - Chi tiết fix code
- [DATABASE_BACKUP.md](DATABASE_BACKUP.md) - Backup & restore
- [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - Tổng kết dự án

## Tính năng

- ✅ **Public Website**: Trang chủ, danh sách bất động sản, dự án, tin tức
- ✅ **Chi tiết động**: Metadata SEO, URL slug friendly, breadcrumb
- ✅ **Admin Dashboard**: Quản lý bất động sản, dự án, bài viết, liên hệ
- ✅ **Xác thực**: NextAuth với credentials provider
- ✅ **Database**: PostgreSQL + Prisma ORM
- ✅ **Responsive**: 100% mobile-friendly
- ✅ **Performance**: Optimized images, fast load times

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5
- **Styling**: TailwindCSS + @tailwindcss/typography
- **Icons**: React Icons
- **Forms**: React Hook Form + Zod

## Cài đặt

### 1. Clone và cài đặt dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Khởi tạo database và seed data

\`\`\`bash
npm run setup
\`\`\`

Hoặc từng bước:
\`\`\`bash
npx prisma db push
npm run prisma:seed
\`\`\`

### 3. Chạy development server

\`\`\`bash
npm run dev
\`\`\`

Truy cập: http://localhost:3000

## Đăng nhập Admin

- **URL**: http://localhost:3000/admin/login

## Cấu trúc dự án

\`\`\`
src/
├── app/
│ ├── page.js # Trang chủ
│ ├── layout.js # Layout chính
│ ├── globals.css # CSS toàn cục
│ ├── bat-dong-san/ # Bất động sản
│ ├── du-an/ # Dự án
│ ├── tin-tuc/ # Tin tức
│ ├── lien-he/ # Liên hệ
│ ├── admin/ # Admin dashboard
│ └── api/ # API routes
├── components/
│ ├── layout/ # Header, Footer
│ ├── home/ # Homepage sections
│ └── admin/ # Admin components
├── lib/
│ ├── prisma.js # Prisma client
│ └── auth.js # Auth helpers
prisma/
├── schema.prisma # Database schema
└── seed.js # Seed data
public/
└── uploads/ # Upload folder
\`\`\`

## Database Schema

### Admin

- id, username, email, password, createdAt

### Property

- id, title, slug, description, price, area, bedrooms, bathrooms, address, city, district, propertyType, thumbnail, featured, createdAt

### PropertyImage

- id, propertyId, imageUrl

### Project

- id, name, slug, investor, address, description, thumbnail

### Article

- id, title, slug, excerpt, content, thumbnail, createdAt

### Contact

- id, name, phone, email, message, createdAt

### Setting

- id, siteName, logo, hotline, email, facebook, zalo, address

## API Endpoints

### Properties

- GET /api/properties
- POST /api/properties
- GET /api/properties/[id]
- PUT /api/properties/[id]
- DELETE /api/properties/[id]

### Projects

- GET /api/projects
- POST /api/projects
- GET /api/projects/[id]
- PUT /api/projects/[id]
- DELETE /api/projects/[id]

### Articles

- GET /api/articles
- POST /api/articles
- GET /api/articles/[id]
- PUT /api/articles/[id]
- DELETE /api/articles/[id]

### Contacts

- GET /api/contacts
- POST /api/contacts

### Settings

- GET /api/settings
- PUT /api/settings

## Biến môi trường

\`\`\`env
NEXTAUTH_SECRET=change_this_secret_in_production
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Build & Deploy

\`\`\`bash
npm run build
npm run start
\`\`\`

Luu y:
- `npm run build` chi migrate schema, khong seed lai du lieu.
- Neu can reset du lieu mau, chay thu cong `npm run prisma:seed` hoac `npm run build:with-seed`.

## SEO

- ✅ Metadata API
- ✅ Slug-based URLs
- ✅ Open Graph tags
- ✅ Dynamic meta tags per page
- ✅ Structured data JSON-LD ready

## Lưu ý

- Thay đổi `NEXTAUTH_SECRET` trước khi deploy
- Cấu hình `.env` cho production
- Sử dụng database hostedSQL cho production
- Optimize images trước khi upload

## Liên hệ

Email: info@nextestate.vn
Hotline: 0935 278 703
