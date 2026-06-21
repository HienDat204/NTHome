'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)

  useEffect(() => {
    axios.get('/api/contacts').then((response) => setContacts(response.data))
  }, [])

  const removeContact = async (id) => {
    if (!confirm('Xóa liên hệ này?')) return

    try {
      setLoadingDeleteId(id)
      await axios.delete(`/api/contacts/${id}`)
      window.location.reload()
    } catch (error) {
      alert(error.response?.data?.error || 'Không thể xóa liên hệ')
    } finally {
      setLoadingDeleteId(null)
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Quản lý Liên hệ</h1>
        <p className="mt-2 text-slate-600">Danh sách khách hàng đã gửi yêu cầu từ website.</p>
      </div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Tin nhắn</th>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {contacts.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.email}</td>
                <td className="px-6 py-4 text-slate-600">{item.phone}</td>
                <td className="px-6 py-4 text-slate-600 max-w-xl truncate">{item.message}</td>
                <td className="px-6 py-4 text-slate-600">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeContact(item.id)}
                    disabled={loadingDeleteId === item.id}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingDeleteId === item.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
