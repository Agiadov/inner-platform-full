type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function findItem(raw: unknown): JsonRecord | undefined {
  if (!isRecord(raw)) return undefined
  const direct = raw.OtapiItemFullInfo
  if (isRecord(direct)) return direct
  const result = raw.Result
  if (isRecord(result) && isRecord(result.OtapiItemFullInfo)) return result.OtapiItemFullInfo
  return undefined
}

function getPrice(priceValue: unknown) {
  if (!isRecord(priceValue)) return undefined
  const amount = typeof priceValue.OriginalPrice === 'number' ? priceValue.OriginalPrice : Number(priceValue.OriginalPrice)
  const currency = typeof priceValue.OriginalCurrencyCode === 'string' ? priceValue.OriginalCurrencyCode : undefined
  if (!Number.isFinite(amount)) return undefined
  return { amount, currency }
}

function getConfiguratorValue(configurators: unknown, pidPattern: RegExp) {
  if (!Array.isArray(configurators)) return undefined
  for (const configurator of configurators) {
    if (!isRecord(configurator)) continue
    const pid = String(configurator.Pid ?? '')
    if (!pidPattern.test(pid)) continue
    const value = configurator.Vid
    if (typeof value === 'string' || typeof value === 'number') return String(value)
  }
  return undefined
}

function promotionPriceMap(item: JsonRecord) {
  const map = new Map<string, { amount: number; currency?: string }>()
  const promotions = Array.isArray(item.Promotions) ? item.Promotions : []

  for (const promotion of promotions) {
    if (!isRecord(promotion) || !Array.isArray(promotion.ConfiguredItems)) continue
    for (const configured of promotion.ConfiguredItems) {
      if (!isRecord(configured)) continue
      const id = configured.Id
      if (typeof id !== 'string' && typeof id !== 'number') continue
      const price = getPrice(configured.Price)
      if (price) map.set(String(id), price)
    }
  }

  return map
}

export function normalizePoizonConfiguredVariants(raw: unknown) {
  const item = findItem(raw)
  if (!item) return []

  const promotionPrices = promotionPriceMap(item)
  const configuredItems = Array.isArray(item.ConfiguredItems) ? item.ConfiguredItems : []

  return configuredItems
    .filter(isRecord)
    .map((configured) => {
      const id = String(configured.Id ?? '')
      const regularPrice = getPrice(configured.Price)
      const promotionPrice = promotionPrices.get(id)
      const quantity = typeof configured.Quantity === 'number' ? configured.Quantity : Number(configured.Quantity)
      const size = getConfiguratorValue(configured.Configurators, /尺码|size/i)
      const version = getConfiguratorValue(configured.Configurators, /版本|version/i)
      const effective = promotionPrice ?? regularPrice

      return {
        id,
        size,
        version,
        price: effective?.amount,
        regularPrice: regularPrice?.amount,
        promotionPrice: promotionPrice?.amount,
        currency: effective?.currency ?? regularPrice?.currency ?? 'CNY',
        quantity: Number.isFinite(quantity) ? quantity : undefined,
        available: Number.isFinite(quantity) ? quantity > 0 : undefined,
      }
    })
    .filter((variant) => variant.id && variant.size)
}

export function normalizePoizonItemMeta(raw: unknown) {
  const item = findItem(raw)
  if (!item) return {}

  const basePrice = getPrice(item.Price)
  const promotions = Array.isArray(item.Promotions) ? item.Promotions : []
  let promotionPrice: { amount: number; currency?: string } | undefined

  for (const promotion of promotions) {
    if (!isRecord(promotion)) continue
    promotionPrice = getPrice(promotion.Price)
    if (promotionPrice) break
  }

  return {
    brand: typeof item.BrandName === 'string' ? item.BrandName : undefined,
    article: Array.isArray(item.FeaturedValues)
      ? item.FeaturedValues.find((entry) => isRecord(entry) && entry.Name === 'article' && typeof entry.Value === 'string')?.Value
      : undefined,
    productUrl: typeof item.ExternalItemUrl === 'string' ? item.ExternalItemUrl : undefined,
    price: (promotionPrice ?? basePrice)?.amount,
    regularPrice: basePrice?.amount,
    promotionPrice: promotionPrice?.amount,
    currency: (promotionPrice ?? basePrice)?.currency ?? 'CNY',
  }
}
