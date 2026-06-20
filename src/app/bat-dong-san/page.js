import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const filters = ['Hà Nội', 'TP HCM', 'Đà Nẵng', 'Căn hộ', 'Biệt thự']

async function getProperties() {
  return prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 12 })
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">Danh sách</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bất động sản nổi bật</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((item) => (
            <button key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-secondary hover:text-secondary">{item}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <Link key={property.id} href={`/bat-dong-san/${property.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${property.thumbnail})` }} />
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{property.propertyType}</span>
                <span className="text-sm font-semibold text-slate-900">{property.price.toLocaleString()} ₫</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{property.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{property.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{property.area} m²</span>
                <span>{property.bedrooms} PN</span>
                <span>{property.bathrooms} WC</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
