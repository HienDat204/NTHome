import Link from 'next/link'
import PropertyCard from '@/components/cards/PropertyCard'
import {
  filterProperties,
  LISTING_TYPES,
  normalizeText,
  getListingTypeLabel,
} from '@/lib/listings'

function buildQuery(baseSearchParams, patch) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(baseSearchParams || {})) {
    if (value) {
      params.set(key, value)
    }
  }

  for (const [key, value] of Object.entries(patch)) {
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

function buildListingHref(path, baseSearchParams, patch) {
  return `${path}${buildQuery(baseSearchParams, patch)}`
}

export default function PropertyListingView({
  properties,
  listingType = LISTING_TYPES.all.value,
  searchParams = {},
  title,
  description,
}) {
  const query = searchParams.q || ''
  const city = searchParams.city || ''
  const district = searchParams.district || ''
  const propertyType = searchParams.propertyType || ''

  const filteredProperties = filterProperties(properties, {
    listingType,
    q: query,
    city,
    district,
    propertyType,
  })
  const renderedProperties = filteredProperties.map((property) => ({
    ...property,
    price: property.price?.toString?.() ?? String(property.price),
  }))

  const cities = Array.from(
    new Map(
      properties
        .map((property) => [normalizeText(property.city), property.city])
        .filter(([key, value]) => key && value),
    ).values(),
  )
    .filter(Boolean)
    .slice(0, 6)

  const districts = Array.from(
    new Map(
      properties
        .map((property) => [normalizeText(property.district), property.district])
        .filter(([key, value]) => key && value),
    ).values(),
  )
    .filter(Boolean)
    .slice(0, 6)

  const propertyTypes = Array.from(
    new Map(
      properties
        .map((property) => [normalizeText(property.propertyType), property.propertyType])
        .filter(([key, value]) => key && value),
    ).values(),
  )
    .filter(Boolean)
    .slice(0, 6)

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-secondary">
            {getListingTypeLabel(listingType)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
            Kết quả
          </p>
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
            name="propertyType"
            defaultValue={propertyType}
            placeholder="Loại nhà đất"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <button
            type="submit"
            className="rounded-2xl bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Lọc
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={
              listingType === LISTING_TYPES.all.value
                ? buildListingHref(LISTING_TYPES.all.path, searchParams, { q: query, city: '', district: '', propertyType: '' })
                : buildListingHref(LISTING_TYPES.all.path, searchParams, { q: query, city: '', district: '', propertyType: '' })
            }
            className={`rounded-full px-4 py-2 transition ${
              !city && !district && !propertyType ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </Link>
          <Link
            href={
              listingType === LISTING_TYPES.sale.value
                ? buildListingHref(LISTING_TYPES.sale.path, searchParams, {})
                : buildListingHref(LISTING_TYPES.sale.path, searchParams, {})
            }
            className={`rounded-full px-4 py-2 transition ${listingType === LISTING_TYPES.sale.value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Bán nhà
          </Link>
          <Link
            href={
              listingType === LISTING_TYPES.rent.value
                ? buildListingHref(LISTING_TYPES.rent.path, searchParams, {})
                : buildListingHref(LISTING_TYPES.rent.path, searchParams, {})
            }
            className={`rounded-full px-4 py-2 transition ${listingType === LISTING_TYPES.rent.value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Cho thuê
          </Link>
        </div>

        {(cities.length > 0 || districts.length > 0 || propertyTypes.length > 0) && (
          <div className="mt-5 space-y-4">
            {cities.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Thành phố</p>
                <div className="flex flex-wrap gap-2">
                  {cities.map((item) => (
                    <Link
                      key={item}
                      href={buildQuery(searchParams, { city: item })}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${normalizeText(city) === normalizeText(item) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {districts.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Quận / huyện</p>
                <div className="flex flex-wrap gap-2">
                  {districts.map((item) => (
                    <Link
                      key={item}
                      href={buildQuery(searchParams, { district: item })}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${normalizeText(district) === normalizeText(item) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {propertyTypes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Loại bất động sản</p>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((item) => (
                    <Link
                      key={item}
                      href={buildQuery(searchParams, { propertyType: item })}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${normalizeText(propertyType) === normalizeText(item) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
