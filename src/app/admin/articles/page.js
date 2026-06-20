'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    axios.get('/api/articles').then((response) => setArticles(response.data))
  }, [])

  const removeArticle = async (id) => {
    if (!confirm('Xóa bài viết này?')) return
    await axios.delete(`/api/articles/${id}`)
    setArticles(articles.filter((article) => article.id !== id))
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Quản lý Bài viết</h1>
          <p className="mt-2 text-slate-600">Tạo và cập nhật nội dung website, tin tức và bài viết tư vấn.</p>
        </div>
        <Link href="/admin/articles/new" className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600">Thêm mới</Link>
      </div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 font-semibold text-slate-900">{article.title}</td>
                <td className="px-6 py-4 text-slate-600">{new Date(article.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 space-x-3">
                  <Link href={`/admin/articles/${article.id}`} className="text-secondary">Sửa</Link>
                  <button onClick={() => removeArticle(article.id)} className="text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
