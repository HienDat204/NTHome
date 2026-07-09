'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [additionalImages, setAdditionalImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    district: '',
    propertyType: 'Căn hộ',
    listingType: 'sale',
    promoBadge: '',
    featured: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)
    setError('')

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataObj = new FormData()
        formDataObj.append('file', file)

        const response = await axios.post('/api/upload', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        return response.data.imageUrl
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setAdditionalImages(prev => [...prev, ...uploadedImages])
    } catch (err) {
      setError('Lỗi upload ảnh: ' + (err.response?.data?.error || err.message))
    } finally {
      setUploadingImages(false)
    }
  }

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
  }

  const formatPriceInput = (value) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return Number(digits).toLocaleString('vi-VN')
  }

  const handlePriceChange = (e) => {
    const raw = e.target.value
    const formatted = formatPriceInput(raw)
    setFormData(prev => ({ ...prev, price: formatted }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const rawPrice = formData.price.replace(/\./g, '')
    if (!rawPrice || isNaN(Number(rawPrice)) || Number(rawPrice) <= 0) {
      setError('Vui lòng nhập giá hợp lệ')
      return
    }
    if (additionalImages.length === 0) {
      setError('Vui lòng tải lên ít nhất 1 ảnh chi tiết')
      return
    }

    setLoading(true)
    setError('')
    try {
      await axios.post('/api/properties', {
        ...formData,
        price: rawPrice,
        area: parseInt(formData.area),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        additionalImages: additionalImages
      })
      router.push('/admin/properties')
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi thêm bất động sản')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/properties" className="text-secondary font-semibold hover:underline">← Quay lại</Link>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Thêm bất động sản mới</h1>
      </div>

      <div className="max-w-2xl rounded-3xl bg-white p-8 shadow-lg">
        {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            ></textarea>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Giá (VNĐ)</label>
              <input
                type="text"
                inputMode="numeric"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                required
                placeholder="Ví dụ: 1.200.000.000"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Diện tích (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Phòng ngủ</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phòng tắm</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Thành phố</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Quận/Huyện</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Loại bất động sản</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                <optgroup label="Mua bán">
                  <option value="ban_nha">Bán nhà</option>
                  <option value="ban_toa_can_ho">Bán tòa căn hộ</option>
                  <option value="ban_dat">Bán đất</option>
                  <option value="ban_khach_san">Bán khách sạn</option>
                </optgroup>
                <optgroup label="Cho thuê">
                  <option value="cho_thue_nha">Cho thuê nhà</option>
                  <option value="cho_thue_mat_bang">Cho thuê mặt bằng</option>
                  <option value="cho_thue_can_ho">Cho thuê căn hộ</option>
                  <option value="cho_thue_dat">Cho thuê đất</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Thông tin nổi bật</label>
            <input
              type="text"
              name="promoBadge"
              value={formData.promoBadge}
              onChange={handleChange}
              placeholder="Ví dụ: Full nội thất, Pháp lý rõ ràng..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Ảnh chi tiết (nhiều ảnh)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesUpload}
              disabled={uploadingImages}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            {uploadingImages && (
              <p className="mt-2 text-sm text-blue-600">Đang upload ảnh...</p>
            )}
            {additionalImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {additionalImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">Nổi bật</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-secondary px-6 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Thêm mới'}
            </button>
            <Link
              href="/admin/properties"
              className="flex-1 rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
