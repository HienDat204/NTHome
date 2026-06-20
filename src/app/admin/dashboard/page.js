import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'Admin Dashboard | Next Estate'
}

async function getStats() {
  try {
    const [properties, projects, articles, contacts] = await Promise.all([
      prisma.property.count(),
      prisma.project.count(),
      prisma.article.count(),
      prisma.contact.count()
    ])
    return { properties, projects, articles, contacts }
  } catch (error) {
    console.error('AdminDashboard DB fallback:', error)
    return { properties: 0, projects: 0, articles: 0, contacts: 0 }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Bảng điều khiển</h1>
          <p className="mt-2 text-slate-600">Tổng quan số liệu quản trị và truy cập các chức năng nhanh.</p>
        </div>
        <Link href="/admin/properties" className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600">Quản lý Bất động sản</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.24em] text-secondary">{key === 'properties' ? 'Bất động sản' : key === 'projects' ? 'Dự án' : key === 'articles' ? 'Bài viết' : 'Liên hệ'}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
