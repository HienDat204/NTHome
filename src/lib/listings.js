export const LISTING_TYPES = {
  sale: {
    value: 'sale',
    label: 'Bán nhà',
    shortLabel: 'Bán nhà',
    badge: 'Đang bán',
    path: '/bat-dong-san/ban-nha',
    description: 'Danh sách bất động sản đang bán với giá tốt nhất thị trường.',
  },
  rent: {
    value: 'rent',
    label: 'Cho thuê',
    shortLabel: 'Cho thuê',
    badge: 'Đang cho thuê',
    path: '/bat-dong-san/cho-thue',
    description: 'Tổng hợp những bất động sản cho thuê hot nhất trên thị trường hiện nay.',
  },
  all: {
    value: 'all',
    label: 'Bất động sản',
    shortLabel: 'Tất cả',
    badge: '',
    path: '/bat-dong-san',
    description: 'Tất cả bất động sản nổi bật đang có trên hệ thống.',
  },
}

export const LISTING_MENU_ITEMS = [
  LISTING_TYPES.sale,
  LISTING_TYPES.rent,
  LISTING_TYPES.all,
]

export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getListingTypeLabel(listingType) {
  return LISTING_TYPES[listingType]?.label || LISTING_TYPES.all.label
}

export function getListingTypeBadge(listingType) {
  return LISTING_TYPES[listingType]?.badge || LISTING_TYPES.sale.badge
}

export function filterProperties(properties = [], filters = {}) {
  const {
    listingType = 'all',
    q = '',
    city = '',
    district = '',
    propertyType = '',
  } = filters

  const normalizedQuery = normalizeText(q)
  const normalizedCity = normalizeText(city)
  const normalizedDistrict = normalizeText(district)
  const normalizedPropertyType = normalizeText(propertyType)

  return properties.filter((property) => {
    const propertyListingType = property.listingType || 'sale'
    if (listingType !== 'all' && propertyListingType !== listingType) {
      return false
    }

    if (normalizedQuery) {
      const haystack = normalizeText(
        [
          property.title,
          property.description,
          property.address,
          property.city,
          property.district,
          property.propertyType,
        ]
          .filter(Boolean)
          .join(' '),
      )

      if (!haystack.includes(normalizedQuery)) {
        return false
      }
    }

    if (normalizedCity) {
      const value = normalizeText(property.city)
      if (!value.includes(normalizedCity)) {
        return false
      }
    }

    if (normalizedDistrict) {
      const value = normalizeText(property.district)
      if (!value.includes(normalizedDistrict)) {
        return false
      }
    }

    if (normalizedPropertyType) {
      const value = normalizeText(property.propertyType)
      if (!value.includes(normalizedPropertyType)) {
        return false
      }
    }

    return true
  })
}
