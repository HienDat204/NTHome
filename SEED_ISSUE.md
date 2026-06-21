# 🔥 VẤN ĐỀ THẬT SỰ - SEED DATA TỰ ĐỘNG PHỤC HỒI

## ❗ PHÁT HIỆN VẤN ĐỀ

Bạn xóa property → Build lại → Property hiện lại

**NGUYÊN NHÂN THẬT SỰ:**

Script `prisma/seed.js` đang dùng `upsert` với logic:
```javascript
await prisma.property.upsert({
  where: { slug: property.slug },
  update: {},              // ← KHÔNG update nếu đã tồn tại
  create: property,        // ← TẠO MỚI nếu không tồn tại
});
```

**Điều này có nghĩa:**
- Xóa property có slug "nha-pho-vi-tri-dep-quan-3"
- Chạy seed → Check slug không tồn tại → TẠO LẠI!
- Property bị "phục hồi" từ seed data

## 🔍 KIỂM TRA

### Bạn đang chạy lệnh nào?

```bash
# ✅ AN TOÀN - Không seed
npm run build

# ❌ NGUY HIỂM - Có seed data
npm run build:with-seed

# ❌ NGUY HIỂM - Có seed data
npm run setup
```

### Check package.json:
```json
{
  "scripts": {
    "build": "... prisma migrate deploy && next build",        // ✅ Không seed
    "build:with-seed": "... && npm run prisma:seed && ...",   // ❌ Có seed!
    "setup": "... && npm run prisma:seed",                    // ❌ Có seed!
  }
}
```

## ✅ GIẢI PHÁP TRIỆT ĐỂ

### Solution 1: Dùng lệnh build đúng (Khuyến nghị)

```bash
# ✅ ĐÚNG - Không seed data
npm run build
npm start

# ❌ SAI - Seed lại data
npm run build:with-seed
```

### Solution 2: Xóa properties khỏi seed data

**File:** `prisma/seed.js`

**Xóa các properties bạn không muốn restore:**

```javascript
// BEFORE
const seedData = {
  properties: [
    {
      title: "Căn hộ cao cấp 2PN tại Landmark 81",
      slug: "can-ho-cao-cap-2pn-landmark-81",
      // ...
    },
    {
      title: "Nhà phố vị trí đẹp quận 3",  // ← Bạn xóa cái này
      slug: "nha-pho-vi-tri-dep-quan-3",
      // ...
    },
    // ... more properties
  ]
}

// AFTER - Xóa property không muốn
const seedData = {
  properties: [
    {
      title: "Căn hộ cao cấp 2PN tại Landmark 81",
      slug: "can-ho-cao-cap-2pn-landmark-81",
      // ...
    },
    // Đã xóa "Nhà phố vị trí đẹp quận 3"
    // ... other properties
  ]
}
```

### Solution 3: Disable seed cho properties (Tốt nhất)

**File:** `prisma/seed.js`

**Comment out phần seed properties:**

```javascript
async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Seed admin - GIỮ LẠI
    const hashedPassword = await bcrypt.hash(seedData.admin.password, 10);
    await prisma.admin.upsert({
      where: { username: seedData.admin.username },
      update: { ...seedData.admin, password: hashedPassword },
      create: { ...seedData.admin, password: hashedPassword },
    });
    console.log("✓ Admin account synced");

    // Seed properties - COMMENT OUT
    // for (const property of seedData.properties) {
    //   await prisma.property.upsert({
    //     where: { slug: property.slug },
    //     update: {},
    //     create: property,
    //   });
    // }
    // console.log(`✓ ${seedData.properties.length} properties synced`);
    console.log("⚠️  Property seed disabled - manual management only");

    // Seed projects - COMMENT OUT
    // for (const project of seedData.projects) {
    //   await prisma.project.upsert({
    //     where: { slug: project.slug },
    //     update: {},
    //     create: project,
    //   });
    // }
    // console.log(`✓ ${seedData.projects.length} projects synced`);
    console.log("⚠️  Project seed disabled - manual management only");

    // Seed articles - GIỮ LẠI nếu muốn
    for (const article of seedData.articles) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {},
        create: article,
      });
    }
    console.log(`✓ ${seedData.articles.length} articles synced`);

    // Seed settings - GIỮ LẠI
    await prisma.setting.upsert({
      where: { id: 1 },
      update: {},
      create: seedData.setting,
    });
    console.log("✓ Settings synced");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
```

### Solution 4: Đổi upsert thành createMany (Nâng cao)

```javascript
// BEFORE - upsert sẽ tạo lại nếu không tồn tại
for (const property of seedData.properties) {
  await prisma.property.upsert({
    where: { slug: property.slug },
    update: {},
    create: property,
  });
}

// AFTER - createMany chỉ tạo nếu chưa có, bỏ qua nếu đã tồn tại (duplicate slug)
try {
  await prisma.property.createMany({
    data: seedData.properties,
    skipDuplicates: true,  // Bỏ qua nếu slug đã tồn tại
  });
  console.log(`✓ Properties seeded`);
} catch (error) {
  console.log(`⚠️  Some properties already exist, skipped`);
}
```

## 🎯 KHUYẾN NGHỊ

### Cho Development (Đang phát triển):
**Solution 3** - Disable seed properties/projects

- Admin vẫn được seed (để login)
- Properties/Projects quản lý thủ công
- Không bị phục hồi sau khi xóa

### Cho Production:
**Solution 1** - Dùng `npm run build` (không seed)

- Database production không bao giờ seed
- Data quản lý hoàn toàn qua admin panel

## 🧪 TEST

### Test 1: Xóa và build không seed
```bash
# 1. Xóa property trong admin (đã login)
# 2. Check database
node test-complete.js  # Property không còn

# 3. Build KHÔNG seed
npm run build

# 4. Check database
node test-complete.js  # Property vẫn không còn ✅
```

### Test 2: Xóa và build CÓ seed
```bash
# 1. Xóa property trong admin
# 2. Check database
node test-complete.js  # Property không còn

# 3. Build CÓ seed
npm run build:with-seed

# 4. Check database
node test-complete.js  # Property hiện lại ❌
```

## 📝 QUY TRÌNH ĐỀ XUẤT

### 1. Fix seed.js (Làm ngay)
```bash
# Mở file
code prisma/seed.js

# Comment out dòng 212-218 (properties seed)
# Comment out dòng 221-227 (projects seed)

# Save file
```

### 2. Build đúng cách
```bash
# ✅ LUÔN dùng lệnh này
npm run build
npm start

# ❌ KHÔNG dùng
npm run build:with-seed
npm run setup (trừ khi setup lần đầu)
```

### 3. Test xóa
```bash
# 1. Login admin
# 2. Xóa property
# 3. Build lại
npm run build

# 4. Verify
node test-complete.js
# Property không còn ✅
```

## 🔥 TÓM TẮT

**VẤN ĐỀ:**
- Seed script dùng `upsert`
- Xóa property → Seed tạo lại
- Build với seed → Data phục hồi

**GIẢI PHÁP:**
1. ✅ Dùng `npm run build` (không seed)
2. ✅ Comment out property/project seed
3. ✅ Đổi sang `createMany` với `skipDuplicates`

**KHUYẾN NGHỊ:**
- Development: Disable seed properties (Solution 3)
- Production: Không bao giờ seed (Solution 1)

---

**🎯 FIX NGAY:** Comment out dòng 212-227 trong `prisma/seed.js`
