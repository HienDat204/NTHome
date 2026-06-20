'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin/dashboard', label: 'Bảng điều khiển', icon: '📊' },
  { href: '/admin/properties', label: 'Bất động sản', icon: '🏠' },
  { href: '/admin/projects', label: 'Dự án', icon: '🏗️' },
  { href: '/admin/articles', label: 'Bài viết', icon: '📝' },
  { href: '/admin/contacts', label: 'Liên hệ', icon: '💬' },
  { href: '/admin/settings', label: 'Cấu hình', icon: '⚙️' }
]

export default function AdminLayout({ children }) {
  const path = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 border-r border-slate-200 bg-white md:block sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Next Estate</h1>
          <p className="mt-1 text-xs text-slate-500">Admin Dashboard</p>
        </div>
        <nav className="space-y-1 px-4 py-6">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${path === item.href ? 'bg-blue-600/10 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <Link href="/" className="block rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">← Về trang chủ</Link>
          <button onClick={handleLogout} className="block w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100">Đăng xuất</button>
        </div>
      </aside>
      <main className="flex-1 py-8 md:py-12">{children}</main>
    </div>
  )
}
