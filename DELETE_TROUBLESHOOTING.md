# 🔧 GIẢI QUYẾT VẤN ĐỀ XÓA - HƯỚNG DẪN TRIỆT ĐỂ

## ❗ Vấn đề

Khi xóa property/project tại:
- `http://localhost:3000/admin/properties`
- `http://localhost:3000/admin/projects`

Build source lại thì sản phẩm đã xóa vẫn còn!

## 🔍 Nguyên nhân

### Có 3 nguyên nhân chính:

### 1. **Chưa đăng nhập Admin** (Phổ biến nhất)
```
Frontend gọi DELETE /api/properties/[id]
    ↓
API check authentication → FAIL (403 Forbidden)
    ↓
Frontend không xóa được trong DB
    ↓
Nhưng state React bị xóa (do code cũ không check error)
    ↓
Refresh page → Data lại load từ DB → Sản phẩm hiện lại
```

### 2. **Session hết hạn**
```
User đã login nhưng session hết hạn
    ↓
API trả về 401 Unauthorized
    ↓
Database không bị xóa
    ↓
Frontend state bị xóa (bug)
    ↓
Refresh → Sản phẩm hiện lại
```

### 3. **Lỗi database constraint**
```
Property có foreign key references
    ↓
Database không cho xóa
    ↓
API trả về 500 Internal Server Error
    ↓
Frontend không xử lý lỗi
    ↓
State bị xóa nhưng DB không xóa
```

## ✅ GIẢI PHÁP TRIỆT ĐỂ

### Bước 1: Đảm bảo đã login Admin

1. Vào `http://localhost:3000/admin/login`
2. Đăng nhập với tài khoản admin
3. Kiểm tra trong browser DevTools:
   ```javascript
   // Console
   document.cookie // Phải có next-auth.session-token
   ```

### Bước 2: Kiểm tra API hoạt động

**Mở Browser DevTools (F12) → Network tab:**

1. Click "Xóa" một property
2. Xem request DELETE `/api/properties/[id]`
3. Check status code:
   - ✅ **204 hoặc 200** → Xóa thành công
   - ❌ **403** → Chưa login hoặc không có quyền
   - ❌ **401** → Session hết hạn
   - ❌ **500** → Lỗi server/database

### Bước 3: Debug bằng Script

```bash
# Test API delete
node debug-delete.js 57

# Output nếu chưa login:
# ❌ DELETE failed (403 Forbidden)
# ➡️ Solution: Login at http://localhost:3000/admin/login first
```

### Bước 4: Xóa trực tiếp database (Nếu API bị lỗi)

```bash
# Xóa property
node admin-delete-property.js 57

# Xóa project
node admin-delete-project.js 22
```

**⚠️ Chú ý:** Scripts này XÓA TRỰC TIẾP trong database, bỏ qua authentication!

## 🛠️ Fix Code (Đã hoàn thành)

### Frontend đã được fix:

**File:** `src/app/admin/properties/page.js`

```javascript
const removeProperty = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return

  try {
    const response = await axios.delete(`/api/properties/${id}`)

    // CHỈ xóa state KHI API thành công
    if (response.status === 204 || response.status === 200) {
      setProperties(properties.filter(item => item.id !== id))
      alert('✅ Đã xóa thành công!')
    }
  } catch (error) {
    console.error('Failed to delete:', error)

    // Hiển thị lỗi rõ ràng
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('❌ Lỗi: Bạn chưa đăng nhập hoặc không có quyền xóa!')
    } else {
      alert('❌ Lỗi khi xóa: ' + (error.response?.data?.error || error.message))
    }
  }
}
```

**Tương tự cho:** `src/app/admin/projects/page.js`

## 🧪 Quy trình Test Đúng

### Test Case 1: Xóa khi đã login ✅

```bash
# 1. Login admin
http://localhost:3000/admin/login

# 2. Vào trang quản lý
http://localhost:3000/admin/properties

# 3. Click "Xóa" property ID 57

# 4. Thấy alert: "✅ Đã xóa thành công!"

# 5. Property biến mất khỏi danh sách

# 6. Kiểm tra database
sqlite3 database/database.db "SELECT COUNT(*) FROM Property WHERE id = 57;"
# Output: 0 (đã xóa)

# 7. Build lại
npm run build

# 8. Kiểm tra lại database
sqlite3 database/database.db "SELECT COUNT(*) FROM Property WHERE id = 57;"
# Output: vẫn là 0 (không phục hồi)
```

### Test Case 2: Xóa khi chưa login ❌

```bash
# 1. Logout hoặc clear cookies

# 2. Vào trang quản lý (có thể bị redirect về login)
http://localhost:3000/admin/properties

# 3. Click "Xóa" property ID 57

# 4. Thấy alert: "❌ Lỗi: Bạn chưa đăng nhập hoặc không có quyền xóa!"

# 5. Property VẪN còn trong danh sách

# 6. Kiểm tra database
sqlite3 database/database.db "SELECT COUNT(*) FROM Property WHERE id = 57;"
# Output: 1 (không bị xóa)
```

## 📋 Checklist Trước Khi Xóa

- [ ] Đã login admin
- [ ] Session còn hiệu lực (không hết hạn)
- [ ] Browser DevTools mở (để debug nếu lỗi)
- [ ] Network tab enabled
- [ ] Console tab mở (xem error logs)
- [ ] Đã backup database (nếu xóa nhiều)

## 🔐 Authentication Flow

```
User → Frontend (Click Xóa)
    ↓
Frontend → API DELETE /api/properties/[id]
    ↓
API → Check authentication (requireAdminWriteAccess)
    ↓
├─ Token hợp lệ + role=admin + referer=/admin/* → PASS
│   ↓
│   API → prisma.property.delete()
│   ↓
│   API → Return 204 No Content
│   ↓
│   Frontend → Xóa khỏi state
│   ↓
│   Frontend → Alert "✅ Đã xóa thành công!"
│
└─ Token không hợp lệ hoặc không phải admin → FAIL
    ↓
    API → Return 403 Forbidden
    ↓
    Frontend → Catch error
    ↓
    Frontend → Alert "❌ Lỗi: Bạn chưa đăng nhập..."
    ↓
    Frontend → State KHÔNG thay đổi (property vẫn còn)
```

## 🚨 Các Lỗi Thường Gặp

### Lỗi 1: "Admin access required" (403)
**Nguyên nhân:** Token không hợp lệ hoặc role không phải admin

**Giải pháp:**
```bash
# 1. Kiểm tra cookie
document.cookie

# 2. Login lại
http://localhost:3000/admin/login

# 3. Kiểm tra user role trong database
sqlite3 database/database.db "SELECT username, email FROM Admin;"
```

### Lỗi 2: "Write operations are only allowed from admin pages" (403)
**Nguyên nhân:** Request không từ `/admin/*`

**Giải pháp:**
- Đảm bảo xóa từ trang admin, không phải trang public
- Check referer header trong DevTools

### Lỗi 3: Session hết hạn (401)
**Nguyên nhân:** NextAuth session timeout

**Giải pháp:**
```bash
# Login lại
http://localhost:3000/admin/login
```

### Lỗi 4: Database constraint (500)
**Nguyên nhân:** Foreign key references

**Giải pháp:**
```bash
# Check cascade delete trong schema
# PropertyImage và ProjectImage phải có onDelete: Cascade
```

## 🛡️ Đảm Bảo Delete Hoạt Động

### 1. Kiểm tra Schema
```prisma
model PropertyImage {
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  //                                                                   ^^^^^^^^^^^^^^^^
  //                                                          Phải có onDelete: Cascade
}
```

### 2. Kiểm tra API Guard
```javascript
// src/lib/admin-api-guard.js
export async function requireAdminWriteAccess(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  
  return null // PASS
}
```

### 3. Kiểm tra Frontend Error Handling
```javascript
// PHẢI có try-catch
// PHẢI check response.status
// PHẢI hiển thị error cho user
// PHẢI giữ nguyên state nếu API fail
```

## 📊 Monitoring

### Sau khi xóa, kiểm tra:

```bash
# 1. Đếm properties còn lại
sqlite3 database/database.db "SELECT COUNT(*) FROM Property;"

# 2. Đếm property images (phải giảm nếu có cascade delete)
sqlite3 database/database.db "SELECT COUNT(*) FROM PropertyImage;"

# 3. Xem properties chi tiết
sqlite3 database/database.db "SELECT id, title FROM Property ORDER BY id DESC LIMIT 5;"

# 4. Check orphan images (không nên có)
sqlite3 database/database.db "
  SELECT pi.id, pi.imageUrl 
  FROM PropertyImage pi 
  LEFT JOIN Property p ON pi.propertyId = p.id 
  WHERE p.id IS NULL;
"
```

## 🎯 Kết Luận

### Để xóa TRIỆT ĐỂ:

1. ✅ **BẮT BUỘC login admin trước**
2. ✅ Check DevTools để debug
3. ✅ Đợi thấy alert "✅ Đã xóa thành công!"
4. ✅ Nếu thấy alert lỗi → FIX lỗi đó trước
5. ✅ Verify trong database sau khi xóa

### Nếu vẫn không xóa được:

```bash
# Debug API
node debug-delete.js <id>

# Xóa trực tiếp database (last resort)
node admin-delete-property.js <id>
node admin-delete-project.js <id>
```

---

**🔥 QUAN TRỌNG:**
- Không thể xóa nếu chưa login!
- Alert lỗi là DẤU HIỆU xóa không thành công!
- Chỉ tin vào alert "✅ Đã xóa thành công!"
- Verify trong database sau khi xóa để chắc chắn!
