'use client'

import { useState } from 'react'

export default function QuickContactForm({ propertyTitle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Tôi muốn biết thêm về ${propertyTitle}.`,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/contacts/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Không thể gửi liên hệ')
      }

      setSuccess('Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `Tôi muốn biết thêm về ${propertyTitle}.`,
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
      <div>
        <label className="block text-sm font-medium text-slate-700">Họ tên <span className="text-red-600">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Số điện thoại <span className="text-red-600">*</span></label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Tin nhắn <span className="text-red-600">*</span></label>
        <textarea
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  )
}
