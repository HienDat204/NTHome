'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function EditProjectPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [existingImages, setExistingImages] = useState([])
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${id}`)
        setFormData(response.data)
        if (response.data.images && response.data.images.length > 0) {
          setExistingImages(response.data.images)
        }
      } catch (err) {
        setError('Không tìm thấy dự án')
      } finally {
        setFetching(false)
      }
    }
    fetchProject()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNewImagesUpload = async (e) => {
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

      // Upload ảnh lên server ngay
      for (const imageUrl of uploadedImages) {
        await axios.post(`/api/projects/${id}/images`, { imageUrl })
      }

      // Refresh danh sách ảnh
      const response = await axios.get(`/api/projects/${id}`)
      if (response.data.images) {
        setExistingImages(response.data.images)
      }
    } catch (err) {
      setError('Lỗi upload ảnh: ' + (err.response?.data?.error || err.message))
    } finally {
      setUploadingImages(false)
    }
  }

  const handleDeleteExistingImage = async (imageId) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return

    try {
      await axios.delete(`/api/projects/${id}/images/${imageId}`)
      setExistingImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      setError('Lỗi khi xóa ảnh: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { images, ...payload } = formData
      await axios.put(`/api/projects/${id}`, payload)
      router.push('/admin/projects')
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi cập nhật')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="container mx-auto px-6 py-10 text-center">Đang tải...</div>

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/projects" className="text-secondary font-semibold hover:underline">← Quay lại</Link>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Chỉnh sửa dự án</h1>
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
              value={formData.highlightInfo || ''}
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
              onChange={handleNewImagesUpload}
              disabled={uploadingImages}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            {uploadingImages && (
              <p className="mt-2 text-sm text-blue-600">Đang upload ảnh...</p>
            )}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-2">Ảnh hiện có:</p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.imageUrl}
                        alt="Project"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
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
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
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
