'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/properties')
      .then((response) => {
        setProperties(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch properties:', error)
        setLoading(false)
      })
  }, [])

  const removeProperty = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bất động sản này?')) return
    await axios.delete(`/api/properties/${id}`)
    setProperties(properties.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Quản lý Bất động sản</h1>
          <p className="mt-2 text-slate-600">Danh sách bất động sản, sửa, xóa hoặc thêm mới nhanh chóng.</p>
        </div>
        <Link href="/admin/properties/new" className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600">Thêm mới</Link>
      </div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Thành phố</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không có dữ liệu.</td></tr>
            ) : properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 font-semibold text-slate-900">{property.title}</td>
                <td className="px-6 py-4 text-slate-600">{property.city}</td>
                <td className="px-6 py-4 text-slate-600">{property.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600">{property.propertyType}</td>
                <td className="px-6 py-4 space-x-3">
                  <Link href={`/admin/properties/${property.id}`} className="text-secondary">Sửa</Link>
                  <button onClick={() => removeProperty(property.id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
