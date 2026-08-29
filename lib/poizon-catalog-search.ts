import { callOtapi } from '@/lib/otapi'

type JsonRecord = Record<string, unknown>

const KNOWN_BRANDS: Array<[string, string]> = [
  ['new balance', 'New Balance'],
  ['nike', 'Nike'],
  ['adidas', 'Adidas'],
  ['asics', 'ASICS'],
  ['salomon', 'Salomon'],
  ["arc'teryx", "Arc'teryx"],
  ['arcteryx', "Arc'teryx"],
  ['jordan', 'Jordan'],
  ['puma', 'PUMA'],
  ['reebok', 'Reebok'],
  ['converse', 'Converse'],
  ['vans', 'Vans'],
  ['li-ning', 'Li-Ning'],
  ['lining', 'Li-Ning'],
  ['chanel', 'CHANEL'],
]

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character)
}

function resolveBrandQuery(query: string) {
  const normalized = query.trim().replace(/\s+/g, ' ')
  const lower = normalized.toLowerCase()

  for (const [alias, brand] of KNOWN_BRANDS) {
    if (lower === alias) return { brand, title: '' }
    if (lower.startsWith(`${alias} `)) {
      return { brand, title: normalized.slice(alias.length).trim() }
    }
  }

  return { brand: '', title: normalized }
}

function contentItems(raw: unknown): JsonRecord[] {
  if (!isRecord(raw)) return []
  const result = raw.Result
  if (!isRecord(result)) return []
  const items1 = result.Items
  if (!isRecord(items1)) return []
  const items2 = items1.Items
  if (!isRecord(items2)) return []
  const content = items2.Content
  return Array.isArray(content) ? content.filter(isRecord) : []
}

function imageUrls(item: JsonRecord) {
  const pictures = Array.isArray(item.Pictures) ? item.Pictures.filter(isRecord) : []
  return pictures
    .map((picture) => typeof picture.Url === 'string' ? picture.Url : undefined)
    .filter((url): url is string => Boolean(url))
    .slice(0, 5)
}

function priceInfo(item: JsonRecord) {
  const price = isRecord(item.Price) ? item.Price : undefined
  const promotion = isRecord(item.PromotionPrice) ? item.PromotionPrice : undefined

  const regularCny = typeof price?.OriginalPrice === 'number' ? price.OriginalPrice : undefined
  const promotionCny = typeof promotion?.OriginalPrice === 'number' ? promotion.OriginalPrice : undefined
  const currency = typeof price?.OriginalCurrencyCode === 'string' ? price.OriginalCurrencyCode : 'CNY'

  return {
    price: promotionCny ?? regularCny,
    regularPrice: regularCny,
    promotionPrice: promotionCny,
    currency,
  }
}

export async function searchPoizonCatalog(query: string, framePosition = 0, frameSize = 20) {
  const { brand, title } = resolveBrandQuery(query)
  const parts = [
    '<SearchItemsParameters>',
    '<Provider>Poizon</Provider>',
    '<SearchMethod>Default</SearchMethod>',
    brand ? `<BrandId>${escapeXml(brand)}</BrandId>` : '',
    title ? `<ItemTitle>${escapeXml(title)}</ItemTitle>` : '',
    '</SearchItemsParameters>',
  ]

  const raw = await callOtapi('BatchSearchItemsFrame', {
    framePosition,
    frameSize,
    blockList: '',
    xmlParameters: parts.join(''),
  })

  const items = contentItems(raw).map((item) => {
    const prices = priceInfo(item)
    return {
      id: typeof item.Id === 'string' ? item.Id : undefined,
      title: typeof item.Title === 'string' ? item.Title : undefined,
      originalTitle: typeof item.OriginalTitle === 'string' ? item.OriginalTitle : undefined,
      brand: typeof item.BrandName === 'string' ? item.BrandName : undefined,
      brandId: typeof item.BrandId === 'string' ? item.BrandId : undefined,
      categoryId: typeof item.CategoryId === 'string' ? item.CategoryId : undefined,
      images: imageUrls(item),
      mainImage: typeof item.MainPictureUrl === 'string' ? item.MainPictureUrl : undefined,
      available: item.IsSellAllowed === true,
      quantity: typeof item.MasterQuantity === 'number' ? item.MasterQuantity : undefined,
      ...prices,
    }
  })

  return {
    raw,
    items,
    search: {
      mode: brand ? 'brand' : 'text',
      brand: brand || undefined,
      title: title || undefined,
    },
  }
}
