'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ siteName: '', hotline: '', email: '', facebook: '', zalo: '', address: '' })

  useEffect(() => {
    axios.get('/api/settings').then((response) => {
      setSettings(response.data)
      setForm(response.data)
    })
  }, [])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await axios.put('/api/settings', form)
    alert('Cập nhật cấu hình thành công')
  }

  if (!settings) return <div className="container mx-auto px-6 py-20">Đang tải...</div>

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Cấu hình Website</h1>
        <p className="mt-2 text-slate-600">Cập nhật logo, hotline, email, Facebook, Zalo và địa chỉ doanh nghiệp.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/50 md:grid-cols-2">
        {['siteName', 'hotline', 'email', 'facebook', 'zalo', 'address'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-slate-700">{field === 'siteName' ? 'Tên website' : field === 'hotline' ? 'Hotline' : field === 'email' ? 'Email' : field === 'facebook' ? 'Facebook' : field === 'zalo' ? 'Zalo' : 'Địa chỉ'}</label>
            <input value={form[field]} name={field} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" />
          </div>
        ))}
        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white hover:bg-blue-600">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  )
}
