'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TABS = [
  { key: 'mua-ban', label: 'Mua bán', href: '/bat-dong-san/mua-ban' },
  { key: 'cho-thue', label: 'Cho thuê', href: '/bat-dong-san/cho-thue' },
]

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('mua-ban')
  const [fields, setFields] = useState({ q: '', city: '', district: '' })
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const tab = TABS.find(t => t.key === activeTab) || TABS[0]
    const params = new URLSearchParams()
    if (fields.q)         params.set('q',        fields.q)
    if (fields.city)      params.set('city',     fields.city)
    if (fields.district)  params.set('district', fields.district)
    const qs = params.toString()
    router.push(`${tab.href}${qs ? `?${qs}` : ''}`)
  }

  const set = (key, val) => setFields(prev => ({ ...prev, [key]: val }))

  return (
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Chào mừng đến với Next Estate</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
          Tìm kiếm ngôi nhà<br />
          <span className="text-primary">bạn yêu thích</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Mua nhà, thuê nhà, đầu tư dự án — tất cả trong một nền tảng uy tín
        </p>

        {/* Search Box */}
        <div className="mx-auto mt-10 max-w-3xl">
          {/* Tab Pills */}
          <div className="flex justify-center gap-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-semibold transition-colors first:rounded-tl-xl last:rounded-tr-xl ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-black/50 text-slate-200 hover:bg-black/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col overflow-hidden rounded-b-2xl rounded-tr-2xl bg-white shadow-2xl sm:flex-row"
          >
            <input
              type="text"
              value={fields.q}
              onChange={e => set('q', e.target.value)}
              placeholder="Tìm tên, địa chỉ, dự án..."
              className="flex-1 border-b border-slate-100 px-5 py-4 text-base text-slate-700 placeholder-slate-400 focus:outline-none sm:border-b-0 sm:border-r"
            />
            <input
              type="text"
              value={fields.city}
              onChange={e => set('city', e.target.value)}
              placeholder="Thành phố"
              className="flex-1 border-b border-slate-100 px-5 py-4 text-base text-slate-700 placeholder-slate-400 focus:outline-none sm:border-b-0 sm:border-r"
            />
            <input
              type="text"
              value={fields.district}
              onChange={e => set('district', e.target.value)}
              placeholder="Quận / huyện"
              className="flex-1 px-5 py-4 text-base text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-8 py-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 flex justify-center gap-10 text-white">
          {[
            { num: '150+', label: 'Bất động sản' },
            { num: '20+', label: 'Dự án mới' },
            { num: '10k+', label: 'Khách hàng' },
            { num: '5+', label: 'Năm kinh nghiệm' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold text-primary">{stat.num}</div>
              <div className="mt-1 text-xs text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  )
}

