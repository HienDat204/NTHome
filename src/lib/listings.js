export const SALE_TYPES = {
  ban_nha: {
    value: 'ban_nha',
    label: 'Bán nhà',
    shortLabel: 'Bán nhà',
    path: '/bat-dong-san/ban-nha',
    description: 'Nhà riêng, nhà phố, biệt thự chào bán giá tốt.',
  },
  ban_toa_can_ho: {
    value: 'ban_toa_can_ho',
    label: 'Bán tòa căn hộ',
    shortLabel: 'Bán tòa căn hộ',
    path: '/bat-dong-san/ban-toa-can-ho',
    description: 'Tòa căn hộ, chung cư nguyên căn đang bán.',
  },
  ban_dat: {
    value: 'ban_dat',
    label: 'Bán đất',
    shortLabel: 'Bán đất',
    path: '/bat-dong-san/ban-dat',
    description: 'Đất nền, đất thổ cư, đất nông nghiệp chào bán.',
  },
  ban_khach_san: {
    value: 'ban_khach_san',
    label: 'Bán khách sạn',
    shortLabel: 'Bán khách sạn',
    path: '/bat-dong-san/ban-khach-san',
    description: 'Khách sạn, nhà nghỉ, cơ sở lưu trú chào bán.',
  },
}

export const RENT_TYPES = {
  cho_thue_nha: {
    value: 'cho_thue_nha',
    label: 'Cho thuê nhà',
    shortLabel: 'Cho thuê nhà',
    path: '/bat-dong-san/cho-thue-nha',
    description: 'Nhà cho thuê nguyên căn, diện tích đa dạng.',
  },
  cho_thue_mat_bang: {
    value: 'cho_thue_mat_bang',
    label: 'Cho thuê mặt bằng',
    shortLabel: 'Cho thuê mặt bằng',
    path: '/bat-dong-san/cho-thue-mat-bang',
    description: 'Mặt bằng kinh doanh, shophouse, showroom cho thuê.',
  },
  cho_thue_can_ho: {
    value: 'cho_thue_can_ho',
    label: 'Cho thuê căn hộ',
    shortLabel: 'Cho thuê căn hộ',
    path: '/bat-dong-san/cho-thue-can-ho',
    description: 'Căn hộ cho thuê tại các khu vực trung tâm.',
  },
  cho_thue_dat: {
    value: 'cho_thue_dat',
    label: 'Cho thuê đất',
    shortLabel: 'Cho thuê đất',
    path: '/bat-dong-san/cho-thue-dat',
    description: 'Đất cho thuê, mặt bằng nông nghiệp cho thuê.',
  },
}

export const LISTING_TYPES = {
  all: {
    value: 'all',
    label: 'Bất động sản',
    shortLabel: 'Tất cả',
    badge: '',
    path: '/bat-dong-san',
    description: 'Tất cả bất động sản nổi bật trên hệ thống.',
  },
  sale: {
    value: 'sale',
    label: 'Mua bán',
    shortLabel: 'Mua bán',
    badge: 'Đang bán',
    path: '/bat-dong-san/mua-ban',
    description: 'Danh sách bất động sản đang bán.',
  },
  rent: {
    value: 'rent',
    label: 'Cho thuê',
    shortLabel: 'Cho thuê',
    badge: 'Đang cho thuê',
    path: '/bat-dong-san/cho-thue',
    description: 'Tổng hợp những bất động sản cho thuê hot nhất.',
  },
}

export const LISTING_MENU_ITEMS = [
  LISTING_TYPES.sale,
  LISTING_TYPES.rent,
  LISTING_TYPES.all,
]

// Backward compatibility
export const LEGACY_SALE_VALUES = ['sale', 'ban_nha', 'ban_toa_can_ho', 'ban_dat', 'ban_khach_san']
export const LEGACY_RENT_VALUES = ['rent', 'cho_thue_nha', 'cho_thue_mat_bang', 'cho_thue_can_ho', 'cho_thue_dat']

export function isSaleListingType(v) { return LEGACY_SALE_VALUES.includes(v) }
export function isRentListingType(v) { return LEGACY_RENT_VALUES.includes(v) }

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
  if (LISTING_TYPES[listingType]) return LISTING_TYPES[listingType].label
  if (SALE_TYPES[listingType]) return SALE_TYPES[listingType].label
  if (RENT_TYPES[listingType]) return RENT_TYPES[listingType].label
  return 'Bất động sản'
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
    listingTypeFilter = '',
  } = filters

  const normalizedListingTypeFilter = normalizeText(listingTypeFilter)
  const normalizedQuery = normalizeText(q)
  const normalizedCity = normalizeText(city)
  const normalizedDistrict = normalizeText(district)

  // On a sub-type page (e.g. cho_thue_mat_bang), if no pill filter is active,
  // fall back to the specific listingType so the page shows only its own type.
  const effectiveListingType = normalizedListingTypeFilter
    ? normalizedListingTypeFilter
    : normalizeText(listingType)

  return properties.filter((property) => {
    const v = property.listingType || 'sale'

    if (normalizedListingTypeFilter) {
      // Pill clicked — match exact sub-type
      if (normalizeText(v) !== normalizedListingTypeFilter) return false
    } else {
      // No pill filter — match the current page context (all / sale / rent / sub-type)
      const isSale   = LEGACY_SALE_VALUES.includes(v)
      const isRent   = LEGACY_RENT_VALUES.includes(v)
      const isSaleL  = LEGACY_SALE_VALUES.includes(effectiveListingType)
      const isRentL  = LEGACY_RENT_VALUES.includes(effectiveListingType)

      if (isSaleL && !isSale)  return false
      if (isRentL && !isRent)  return false
      if (!isSaleL && !isRentL && effectiveListingType !== 'all' && normalizeText(v) !== effectiveListingType) {
        return false
      }
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

    return true
  })
}
