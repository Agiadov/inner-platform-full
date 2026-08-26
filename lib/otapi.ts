const OTAPI_BASE_URL = 'https://otapi.net/service-json'
const DEFAULT_LANGUAGE = 'en'
const POIZON_PROVIDER = 'Poizon'

export type JsonRecord = Record<string, unknown>

export class OtapiError extends Error {
  status: number
  code?: string
  retryAfter?: string
  details?: unknown

  constructor(message: string, options: { status?: number; code?: string; retryAfter?: string; details?: unknown } = {}) {
    super(message)
    this.name = 'OtapiError'
    this.status = options.status ?? 502
    this.code = options.code
    this.retryAfter = options.retryAfter
    this.details = options.details
  }
}

function getInstanceKey() {
  const key = process.env.OTAPI_INSTANCE_KEY?.trim()
  if (!key) {
    throw new OtapiError('OTCommerce API is not configured.', { status: 503, code: 'OTAPI_NOT_CONFIGURED' })
  }
  return key
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function firstRecord(...values: unknown[]): JsonRecord | undefined {
  return values.find(isRecord) as JsonRecord | undefined
}

function scalar(value: unknown): string | number | boolean | undefined {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (!isRecord(value)) return undefined

  for (const key of ['Value', 'value', 'Amount', 'amount', 'OriginalValue', 'ConvertedValue', 'DisplayValue']) {
    const candidate = value[key]
    if (typeof candidate === 'string' || typeof candidate === 'number' || typeof candidate === 'boolean') return candidate
  }

  return undefined
}

function pickScalar(record: JsonRecord | undefined, keys: string[]) {
  if (!record) return undefined
  for (const key of keys) {
    const value = scalar(record[key])
    if (value !== undefined) return value
  }
  return undefined
}

function pickString(record: JsonRecord | undefined, keys: string[]) {
  const value = pickScalar(record, keys)
  return value === undefined ? undefined : String(value)
}

function pickNumber(record: JsonRecord | undefined, keys: string[]) {
  const value = pickScalar(record, keys)
  if (value === undefined || typeof value === 'boolean') return undefined
  const number = Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(number) ? number : undefined
}

function findObjectContaining(value: unknown, keys: string[], depth = 0): JsonRecord | undefined {
  if (depth > 5) return undefined
  if (isRecord(value)) {
    if (keys.some((key) => key in value)) return value
    for (const child of Object.values(value)) {
      const found = findObjectContaining(child, keys, depth + 1)
      if (found) return found
    }
  } else if (Array.isArray(value)) {
    for (const child of value) {
      const found = findObjectContaining(child, keys, depth + 1)
      if (found) return found
    }
  }
  return undefined
}

function collectImageUrls(value: unknown, depth = 0, urls = new Set<string>()): Set<string> {
  if (depth > 6 || urls.size >= 30) return urls

  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value) && /\.(?:jpe?g|png|webp|avif)(?:\?|$)/i.test(value)) urls.add(value)
    return urls
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, depth + 1, urls))
    return urls
  }

  if (isRecord(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (/image|picture|photo|picurl|url/i.test(key) || depth < 3) collectImageUrls(child, depth + 1, urls)
    }
  }

  return urls
}

function extractAttributePairs(value: unknown, depth = 0, pairs: Array<{ name: string; value: string }> = []) {
  if (depth > 5 || pairs.length >= 30) return pairs

  if (Array.isArray(value)) {
    value.forEach((item) => extractAttributePairs(item, depth + 1, pairs))
    return pairs
  }

  if (!isRecord(value)) return pairs

  const name = pickString(value, ['Name', 'name', 'Title', 'title', 'PropertyName', 'AttributeName'])
  const attrValue = pickString(value, ['Value', 'value', 'Text', 'text', 'PropertyValue', 'AttributeValue'])
  if (name && attrValue) pairs.push({ name, value: attrValue })

  for (const child of Object.values(value)) extractAttributePairs(child, depth + 1, pairs)
  return pairs
}

function variantArrayCandidates(value: unknown, depth = 0, output: JsonRecord[][] = []) {
  if (depth > 6) return output

  if (Array.isArray(value)) {
    const records = value.filter(isRecord)
    if (records.length && records.some((entry) => pickString(entry, ['ConfigurationId', 'configurationId', 'SkuId', 'skuId', 'Id', 'id']))) {
      output.push(records)
    }
    value.forEach((child) => variantArrayCandidates(child, depth + 1, output))
    return output
  }

  if (!isRecord(value)) return output

  for (const [key, child] of Object.entries(value)) {
    if (/config|variant|sku/i.test(key) && Array.isArray(child)) {
      const records = child.filter(isRecord)
      if (records.length) output.push(records)
    }
    variantArrayCandidates(child, depth + 1, output)
  }

  return output
}

function extractPrice(record: JsonRecord) {
  const direct = pickNumber(record, ['Price', 'price', 'CurrentPrice', 'SalePrice', 'PromoPrice', 'OriginalPrice'])
  if (direct !== undefined) return direct

  const priceRecord = firstRecord(record.Price, record.price, record.PriceInfo, record.PriceObject, record.ConvertedPrice)
  return pickNumber(priceRecord, ['Value', 'value', 'Amount', 'amount', 'ConvertedValue', 'OriginalValue'])
}

function extractCurrency(record: JsonRecord) {
  const direct = pickString(record, ['Currency', 'currency', 'CurrencyCode', 'currencyCode'])
  if (direct) return direct
  const priceRecord = firstRecord(record.Price, record.price, record.PriceInfo, record.PriceObject, record.ConvertedPrice)
  return pickString(priceRecord, ['Currency', 'currency', 'CurrencyCode', 'currencyCode'])
}

function normalizeVariant(record: JsonRecord, index: number) {
  const attributes = extractAttributePairs(record)
  const sizeAttribute = attributes.find((entry) => /size|размер|尺码/i.test(entry.name))
  const fallbackSize = pickString(record, ['Size', 'size', 'SizeName', 'sizeName', 'Value', 'value'])
  const availability = pickScalar(record, ['IsAvailable', 'isAvailable', 'IsInStock', 'isInStock', 'Available', 'available'])
  const quantity = pickNumber(record, ['Quantity', 'quantity', 'Stock', 'stock', 'AvailableQuantity', 'availableQuantity'])

  return {
    id: pickString(record, ['ConfigurationId', 'configurationId', 'SkuId', 'skuId', 'Id', 'id']) ?? `variant-${index + 1}`,
    size: sizeAttribute?.value ?? fallbackSize,
    price: extractPrice(record),
    currency: extractCurrency(record),
    available: typeof availability === 'boolean' ? availability : quantity !== undefined ? quantity > 0 : undefined,
    quantity,
    attributes,
  }
}

function rootPayload(raw: unknown) {
  if (!isRecord(raw)) return raw
  return raw.Result ?? raw.result ?? raw.Data ?? raw.data ?? raw
}

export function normalizePoizonItem(raw: unknown, requestedId?: string) {
  const payload = rootPayload(raw)
  const item = findObjectContaining(payload, ['ItemId', 'itemId', 'Title', 'OriginalTitle', 'Pictures', 'Configurations']) ?? (isRecord(payload) ? payload : {})
  const variantArrays = variantArrayCandidates(item)
  const variants = variantArrays.flat().map(normalizeVariant)
  const uniqueVariants = Array.from(new Map(variants.map((variant) => [variant.id, variant])).values())
  const availability = pickScalar(item, ['IsAvailable', 'isAvailable', 'IsInStock', 'isInStock', 'Available', 'available'])
  const quantity = pickNumber(item, ['Quantity', 'quantity', 'Stock', 'stock', 'AvailableQuantity', 'availableQuantity'])

  return {
    id: pickString(item, ['ItemId', 'itemId', 'Id', 'id', 'ExternalId']) ?? requestedId,
    title: pickString(item, ['Title', 'title', 'OriginalTitle', 'Name', 'name']),
    images: Array.from(collectImageUrls(item)),
    price: extractPrice(item),
    currency: extractCurrency(item),
    available: typeof availability === 'boolean' ? availability : quantity !== undefined ? quantity > 0 : undefined,
    quantity,
    variants: uniqueVariants,
  }
}

function findItemsArray(value: unknown, depth = 0): JsonRecord[] | undefined {
  if (depth > 6) return undefined
  if (isRecord(value)) {
    for (const key of ['Items', 'items', 'ItemInfoList', 'Results', 'results', 'Content', 'content']) {
      const child = value[key]
      if (Array.isArray(child) && child.some(isRecord)) return child.filter(isRecord)
    }
    for (const child of Object.values(value)) {
      const found = findItemsArray(child, depth + 1)
      if (found) return found
    }
  } else if (Array.isArray(value)) {
    if (value.some(isRecord)) return value.filter(isRecord)
    for (const child of value) {
      const found = findItemsArray(child, depth + 1)
      if (found) return found
    }
  }
  return undefined
}

export function normalizePoizonSearch(raw: unknown) {
  const payload = rootPayload(raw)
  const items = findItemsArray(payload) ?? []
  return items.map((item) => {
    const normalized = normalizePoizonItem(item)
    return {
      id: normalized.id,
      title: normalized.title,
      images: normalized.images.slice(0, 3),
      price: normalized.price,
      currency: normalized.currency,
      available: normalized.available,
    }
  })
}

function upstreamError(raw: unknown) {
  if (!isRecord(raw)) return undefined
  const candidates = [raw, firstRecord(raw.Error, raw.error), firstRecord(raw.Result, raw.result)].filter(Boolean) as JsonRecord[]

  for (const candidate of candidates) {
    const code = pickString(candidate, ['ErrorCode', 'errorCode', 'Code', 'code'])
    const message = pickString(candidate, ['ErrorMessage', 'errorMessage', 'Message', 'message', 'Description', 'description'])
    if (message && (code || /error|limit|not found|invalid/i.test(message))) return { code, message }
  }

  return undefined
}

export async function callOtapi(method: string, params: Record<string, string | number | undefined>) {
  const body = new URLSearchParams({
    instanceKey: getInstanceKey(),
    language: DEFAULT_LANGUAGE,
  })

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') body.set(key, String(value))
  }

  let response: Response
  try {
    response = await fetch(`${OTAPI_BASE_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new OtapiError('OTCommerce API timed out.', { status: 504, code: 'OTAPI_TIMEOUT' })
    }
    throw new OtapiError('Could not reach OTCommerce API.', { status: 502, code: 'OTAPI_UNREACHABLE', details: error })
  }

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    throw new OtapiError('OTCommerce API returned an invalid response.', {
      status: 502,
      code: 'OTAPI_INVALID_RESPONSE',
      details: text.slice(0, 1000),
    })
  }

  if (!response.ok) {
    throw new OtapiError(`OTCommerce API returned HTTP ${response.status}.`, {
      status: response.status === 429 ? 429 : 502,
      code: response.status === 429 ? 'OTAPI_RATE_LIMITED' : 'OTAPI_HTTP_ERROR',
      retryAfter: response.headers.get('retry-after') ?? undefined,
      details: json,
    })
  }

  const apiError = upstreamError(json)
  if (apiError) {
    const isRateLimit = /limit|quota|too many/i.test(`${apiError.code ?? ''} ${apiError.message}`)
    const isNotFound = /not.?found|does not exist|unknown item/i.test(apiError.message)
    throw new OtapiError(apiError.message, {
      status: isRateLimit ? 429 : isNotFound ? 404 : 502,
      code: apiError.code ?? (isRateLimit ? 'OTAPI_RATE_LIMITED' : isNotFound ? 'OTAPI_NOT_FOUND' : 'OTAPI_ERROR'),
      details: json,
    })
  }

  return json
}

export function normalizePoizonId(input: string) {
  const id = input.trim()
  const prefixed = id.startsWith('pz-') ? id : `pz-${id}`
  if (!/^pz-[A-Za-z0-9_-]+$/.test(prefixed)) {
    throw new OtapiError('Invalid Poizon product ID.', { status: 400, code: 'INVALID_PRODUCT_ID' })
  }
  return prefixed
}

export async function getPoizonItem(itemId: string) {
  const normalizedId = normalizePoizonId(itemId)
  const raw = await callOtapi('GetItemFullInfo', { itemId: normalizedId })
  return { id: normalizedId, raw, product: normalizePoizonItem(raw, normalizedId) }
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

export async function searchPoizonItems(query: string, framePosition = 0, frameSize = 20) {
  const safeQuery = escapeXml(query.trim())
  const xmlParameters = `<SearchItemsParameters><Provider>${POIZON_PROVIDER}</Provider><SearchMethod>Default</SearchMethod><ItemTitle>${safeQuery}</ItemTitle></SearchItemsParameters>`
  const raw = await callOtapi('BatchSearchItemsFrame', {
    framePosition,
    frameSize,
    xmlParameters,
  })

  return { raw, items: normalizePoizonSearch(raw) }
}
