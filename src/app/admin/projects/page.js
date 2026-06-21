'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get('/api/projects').then((response) => setProjects(response.data))
  }, [])

  const removeProject = async (id) => {
    if (!confirm('Xóa dự án này?')) return

    try {
      const response = await axios.delete(`/api/projects/${id}`)

      // Chỉ xóa khỏi state nếu API call thành công
      if (response.status === 204 || response.status === 200) {
        setProjects(projects.filter((project) => project.id !== id))
        alert('✅ Đã xóa thành công!')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)

      // Hiển thị lỗi cụ thể cho user
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('❌ Lỗi: Bạn chưa đăng nhập hoặc không có quyền xóa!')
      } else {
        alert('❌ Lỗi khi xóa: ' + (error.response?.data?.error || error.message))
      }
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Quản lý Dự án</h1>
          <p className="mt-2 text-slate-600">Xem danh sách, thêm mới hoặc cập nhật dự án bất động sản.</p>
        </div>
        <Link href="/admin/projects/new" className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600">Thêm mới</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
            {project.highlightInfo && (
              <p className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                {project.highlightInfo}
              </p>
            )}
            <p className="mt-3 text-slate-600 line-clamp-4">{project.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{project.investor}</span>
              <div className="space-x-3">
                <Link href={`/admin/projects/${project.id}`} className="text-secondary">Sửa</Link>
                <button onClick={() => removeProject(project.id)} className="text-red-600">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
