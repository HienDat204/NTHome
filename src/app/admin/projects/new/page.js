'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [additionalImages, setAdditionalImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    investor: '',
    address: '',
    description: '',
    highlightInfo: '',
    thumbnail: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImagesUpload = async (e) => {
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

        return response.data.image
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setAdditionalImages(prev => [...prev, ...uploadedImages])

      // Tự động set thumbnail là ảnh đầu tiên nếu chưa có
      if (!formData.thumbnail && uploadedImages.length > 0) {
        setFormData(prev => ({ ...prev, thumbnail: uploadedImages[0] }))
      }
    } catch (err) {
      setError('Lỗi upload ảnh: ' + (err.response?.data?.error || err.message))
    } finally {
      setUploadingImages(false)
    }
  }

  const handleDeleteImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Tạo project trước
      const response = await axios.post('/api/projects', formData)
      const projectId = response.data.id

      // Upload từng ảnh vào project
      if (additionalImages.length > 0) {
        for (const imageUrl of additionalImages) {
          await axios.post(`/api/projects/${projectId}/images`, { imageUrl })
        }
      }

      router.push('/admin/projects')
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi thêm dự án')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/projects" className="text-secondary font-semibold hover:underline">← Quay lại</Link>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Thêm dự án mới</h1>
      </div>

      <div className="max-w-2xl rounded-3xl bg-white p-8 shadow-lg">
        {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Tên dự án</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
            <label className="block text-sm font-medium text-slate-700">Nhà đầu tư</label>
            <input
              type="text"
              name="investor"
              value={formData.investor}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
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

          <div>
            <label className="block text-sm font-medium text-red-600">Thông tin nổi bật</label>
            <textarea
              name="highlightInfo"
              value={formData.highlightInfo}
              onChange={handleChange}
              rows="3"
              placeholder="Ví dụ: Ưu đãi mở bán, tiến độ mới nhất, chính sách đặc biệt..."
              className="mt-2 w-full rounded-lg border border-red-200 px-4 py-2 text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/40"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Ảnh dự án (nhiều ảnh)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
              disabled={uploadingImages}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            {uploadingImages && (
              <p className="mt-2 text-sm text-blue-600">Đang upload ảnh...</p>
            )}
            {additionalImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-2">Ảnh đã chọn ({additionalImages.length}):</p>
                <div className="grid grid-cols-3 gap-3">
                  {additionalImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                          Thumbnail
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              href="/admin/projects"
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
