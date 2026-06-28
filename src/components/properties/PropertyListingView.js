'use client'

import Link from 'next/link'
import PropertyCard from '@/components/cards/PropertyCard'
import {
  filterProperties,
  LISTING_TYPES,
  SALE_TYPES,
  RENT_TYPES,
  LEGACY_SALE_VALUES,
  LEGACY_RENT_VALUES,
  normalizeText,
  getListingTypeLabel,
} from '@/lib/listings'

function buildQuery(baseSearchParams, patch) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(baseSearchParams || {})) {
    if (value) params.set(key, value)
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
  }
  return params.toString() ? `?${params.toString()}` : ''
}

export default function PropertyListingView({
  properties = [],
  listingType = LISTING_TYPES.all.value,
  parentListingType = null,
  searchParams = {},
  title,
  description,
}) {
  const query = searchParams.q || ''
  const city = searchParams.city || ''
  const district = searchParams.district || ''
  const listingTypeFilter = searchParams.listingTypeFilter || ''

  // Trang con (ban_nha, cho_thue_mat_bang…): dùng listingType cụ thể để lọc đúng sub-type.
  // Trang cha (sale, rent, all): dùng parentListingType nếu có.
  const filterType = (() => {
    if (listingType !== LISTING_TYPES.all.value && listingType !== 'sale' && listingType !== 'rent') {
      // Đây là trang con — dùng listingType cụ thể
      return listingType
    }
    // Trang cha — dùng parentListingType hoặc listingType
    return parentListingType || listingType
  })()

  const filteredProperties = filterProperties(properties, {
    listingType: filterType,
    q: query,
    city,
    district,
    listingTypeFilter,
  })

  const renderedProperties = filteredProperties.map((property) => ({
    ...property,
    price: property.price?.toString?.() ?? String(property.price),
  }))

  const cities = Array.from(
    new Map(
      properties
        .map((p) => [normalizeText(p.city), p.city])
        .filter(([k, v]) => k && v),
    ).values(),
  ).filter(Boolean).slice(0, 6)

  const districts = Array.from(
    new Map(
      properties
        .map((p) => [normalizeText(p.district), p.district])
        .filter(([k, v]) => k && v),
    ).values(),
  ).filter(Boolean).slice(0, 6)

  // Available listingType values — always show pills for the active tab
  const availableListingTypes = (() => {
    const isOnSale = LEGACY_SALE_VALUES.includes(filterType)
    const isOnRent = LEGACY_RENT_VALUES.includes(filterType)

    const pool = properties.filter((p) => {
      if (isOnSale)  return LEGACY_SALE_VALUES.includes(p.listingType)
      if (isOnRent)  return LEGACY_RENT_VALUES.includes(p.listingType)
      return true
    })

    const types = new Set(pool.map((p) => p.listingType).filter(Boolean))

    // Always show pills for the active tab type; grey out ones with no data
    if (isOnSale)  return Object.values(SALE_TYPES).map(t => ({ ...t, hasData: types.has(t.value) }))
    if (isOnRent)  return Object.values(RENT_TYPES).map(t => ({ ...t, hasData: types.has(t.value) }))
    return []
  })()

  const isOnSale = LEGACY_SALE_VALUES.includes(filterType)
  const isOnRent = LEGACY_RENT_VALUES.includes(filterType)

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">
            {getListingTypeLabel(listingType)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Kết quả</p>
          <p className="mt-1 text-2xl font-semibold">{filteredProperties.length}</p>
        </div>
      </div>

      <div className="mb-8 rounded-[2rem] bg-white p-5 shadow-lg shadow-slate-200/70">
        <form method="get" className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Tìm theo tên, địa chỉ, thành phố, quận..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <input
            type="text"
            name="city"
            defaultValue={city}
            placeholder="Thành phố"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <input
            type="text"
            name="district"
            defaultValue={district}
            placeholder="Quận / huyện"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <input
            type="text"
            name="listingTypeFilter"
            defaultValue={listingTypeFilter}
            placeholder="Loại bất động sản"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <button
            type="submit"
            className="rounded-2xl bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Lọc
          </button>
        </form>

        {/* Tabs: Tất cả / Mua bán / Cho thuê */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/bat-dong-san${buildQuery(searchParams, { q: query, city: '', district: '', listingTypeFilter: '' })}`}
            className={`rounded-full px-4 py-2 transition ${!isOnSale && !isOnRent ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Tất cả
          </Link>
          <Link
            href={`/bat-dong-san/mua-ban${buildQuery(searchParams, { q: query, city: '', district: '', listingTypeFilter: '' })}`}
            className={`rounded-full px-4 py-2 transition ${isOnSale ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Mua bán
          </Link>
          <Link
            href={`/bat-dong-san/cho-thue${buildQuery(searchParams, { q: query, city: '', district: '', listingTypeFilter: '' })}`}
            className={`rounded-full px-4 py-2 transition ${isOnRent ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Cho thuê
          </Link>
        </div>

        {/* Property type pills — scoped to current tab context */}
        {availableListingTypes.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Loại bất động sản</p>
            <div className="flex flex-wrap gap-2">
              {availableListingTypes.map((item) => (
                <Link
                  key={item.value}
                  href={buildQuery(searchParams, { listingTypeFilter: item.value })}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${listingTypeFilter === item.value ? 'bg-primary text-white' : item.hasData ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-50 text-slate-300 cursor-default'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredProperties.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-12 text-center text-slate-500 shadow-lg shadow-slate-200/70">
          Không tìm thấy bất động sản phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {renderedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}
