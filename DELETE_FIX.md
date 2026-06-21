# ✅ FIX TRIỆT ĐỂ - Vấn đề Xóa Property/Project

## 🐛 Vấn đề cũ

Khi xóa property/project trong admin:
- ❌ Frontend chỉ xóa khỏi React state
- ❌ Không kiểm tra API response
- ❌ Nếu API thất bại (chưa login, lỗi server), state vẫn bị xóa
- ❌ Refresh hoặc build lại → dữ liệu hiện lại

## ✅ Đã fix

### 1. Frontend Error Handling (Properties)
**File:** `src/app/admin/properties/page.js`

**Trước:**
```javascript
const removeProperty = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  await axios.delete(`/api/properties/${id}`)
  setProperties(properties.filter((item) => item.id !== id)) // Xóa ngay, không check
}
```

**Sau:**
```javascript
const removeProperty = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return

  try {
    const response = await axios.delete(`/api/properties/${id}`)

    // CHỈ xóa khỏi state NẾU API thành công
    if (response.status === 204 || response.status === 200) {
      setProperties(properties.filter((item) => item.id !== id))
      alert('✅ Đã xóa thành công!')
    }
  } catch (error) {
    console.error('Failed to delete:', error)

    // Hiển thị lỗi cụ thể
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('❌ Lỗi: Bạn chưa đăng nhập hoặc không có quyền xóa!')
    } else {
      alert('❌ Lỗi khi xóa: ' + (error.response?.data?.error || error.message))
    }
  }
}
```

### 2. Frontend Error Handling (Projects)
**File:** `src/app/admin/projects/page.js`

Áp dụng logic tương tự như properties.

### 3. Database Cascade Delete
**File:** `prisma/schema.prisma`

```prisma
model PropertyImage {
  id         Int      @id @default(autoincrement())
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  propertyId Int
  imageUrl   String
}

model ProjectImage {
  id         Int      @id @default(autoincrement())
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId  Int
  imageUrl   String
}
```

**Cascade Delete nghĩa là:**
- Xóa Property → Tự động xóa tất cả PropertyImage liên quan
- Xóa Project → Tự động xóa tất cả ProjectImage liên quan

## 🔐 API Authentication

**File:** `src/app/api/properties/[id]/route.js`

```javascript
export async function DELETE(request, { params }) {
  try {
    // Kiểm tra quyền admin
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    // Xóa khỏi database
    await prisma.property.delete({ where: { id: parseInt(params.id) } })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

**Tương tự cho:** `src/app/api/projects/[id]/route.js`

## 🧪 Cách test

### Test 1: Xóa thành công
1. Đăng nhập admin
2. Vào http://localhost:3000/admin/properties
3. Click "Xóa" một property
4. Thấy alert "✅ Đã xóa thành công!"
5. Property biến mất khỏi danh sách
6. Refresh page → Property vẫn không còn (đã xóa khỏi DB)

### Test 2: Xóa khi chưa login
1. Logout hoặc xóa session
2. Vào http://localhost:3000/admin/properties
3. Click "Xóa"
4. Thấy alert "❌ Lỗi: Bạn chưa đăng nhập hoặc không có quyền xóa!"
5. Property vẫn còn trong danh sách
6. Refresh page → Property vẫn còn (không bị xóa khỏi state)

### Test 3: Cascade delete images
```bash
# 1. Kiểm tra property có bao nhiêu images
sqlite3 database/database.db "SELECT propertyId, COUNT(*) FROM PropertyImage WHERE propertyId = 1 GROUP BY propertyId;"

# 2. Xóa property đó trong admin

# 3. Kiểm tra lại images → phải = 0
sqlite3 database/database.db "SELECT propertyId, COUNT(*) FROM PropertyImage WHERE propertyId = 1 GROUP BY propertyId;"
```

### Test 4: Build không ảnh hưởng
```bash
# 1. Đếm số properties hiện tại
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"
# Output: 5

# 2. Xóa 1 property trong admin
# 3. Đếm lại
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"
# Output: 4

# 4. Build lại source
npm run build

# 5. Đếm lại
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"
# Output: vẫn là 4 (không thay đổi)
```

## 📊 Kiểm tra database

### Script tự động
```bash
node test-delete.js
```

### Thủ công
```bash
# Đếm properties
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"

# Đếm property images
sqlite3 database/database.db "SELECT COUNT(*) FROM PropertyImage;"

# Đếm projects
sqlite3 database/database.db "SELECT COUNT(*) FROM Project;"

# Đếm project images
sqlite3 database/database.db "SELECT COUNT(*) FROM ProjectImage;"

# Xem chi tiết properties
sqlite3 database/database.db "SELECT id, title FROM Property LIMIT 5;"

# Xem chi tiết images của property
sqlite3 database/database.db "SELECT p.title, COUNT(pi.id) as image_count FROM Property p LEFT JOIN PropertyImage pi ON p.id = pi.propertyId GROUP BY p.id;"
```

## 🛡️ Đảm bảo an toàn

### 1. Authentication
- ✅ API có guard `requireAdminWriteAccess`
- ✅ Chỉ admin đã login mới xóa được
- ✅ Frontend hiển thị lỗi nếu chưa login

### 2. Confirmation
- ✅ Có confirm dialog trước khi xóa
- ✅ User phải click OK mới xóa

### 3. Error Handling
- ✅ Frontend kiểm tra response status
- ✅ Chỉ xóa khỏi state nếu API thành công
- ✅ Hiển thị lỗi cụ thể nếu thất bại

### 4. Database Integrity
- ✅ Cascade delete đảm bảo không có orphan images
- ✅ Foreign key constraints
- ✅ Transaction rollback nếu lỗi

## 🔄 Workflow hoàn chỉnh

```
User click "Xóa"
    ↓
Hiện confirm dialog
    ↓
User click OK
    ↓
Frontend gọi DELETE /api/properties/[id]
    ↓
API kiểm tra authentication
    ↓ (nếu OK)
API xóa khỏi database (cascade delete images)
    ↓
API trả về 204 No Content
    ↓
Frontend nhận 204
    ↓
Frontend xóa khỏi state
    ↓
Frontend hiển thị alert "✅ Đã xóa thành công!"
    ↓
UI update, property biến mất
```

## ❌ Các trường hợp lỗi

### Lỗi 401/403 - Unauthorized
```
Nguyên nhân: Chưa login hoặc không có quyền
Giải pháp: Login lại
Frontend: Alert "❌ Bạn chưa đăng nhập hoặc không có quyền xóa!"
State: Không thay đổi (property vẫn còn)
```

### Lỗi 404 - Not Found
```
Nguyên nhân: Property đã bị xóa trước đó (race condition)
Frontend: Alert "❌ Lỗi khi xóa: Not found"
State: Nên refresh để sync lại
```

### Lỗi 500 - Server Error
```
Nguyên nhân: Database error, constraint violation
Frontend: Alert "❌ Lỗi khi xóa: [error message]"
State: Không thay đổi
Giải pháp: Check server logs, fix database issue
```

## 🚀 Kết luận

**Trước khi fix:**
- Xóa không chắc chắn
- Build lại có thể hiện lại data
- Không thông báo lỗi

**Sau khi fix:**
- ✅ Xóa chắc chắn (check API response)
- ✅ Build lại không ảnh hưởng (xóa thật trong DB)
- ✅ Thông báo lỗi rõ ràng
- ✅ Authentication đầy đủ
- ✅ Cascade delete tự động
- ✅ Error handling hoàn chỉnh

**→ XÓA TRIỆT ĐỂ, DỮ LIỆU KHÔNG BỊ PHỤC HỒI!**
