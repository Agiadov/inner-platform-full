const OTAPI_BASE_URL = 'https://otapi.net/service-json'
const DEFAULT_LANGUAGE = 'en'
const POIZON_PROVIDER = 'Poizon'

type JsonRecord = Record<string, unknown>

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

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function instanceKey() {
  const key = process.env.OTAPI_INSTANCE_KEY?.trim()
  if (!key) throw new OtapiError('OTCommerce API is not configured.', { status: 503, code: 'OTAPI_NOT_CONFIGURED' })
  return key
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

function text(record: JsonRecord | undefined, keys: string[]) {
  if (!record) return undefined
  for (const key of keys) {
    const value = scalar(record[key])
    if (value !== undefined) return String(value)
  }
  return undefined
}

function numberValue(record: JsonRecord | undefined, keys: string[]) {
  if (!record) return undefined
  for (const key of keys) {
    const value = scalar(record[key])
    if (value === undefined || typeof value === 'boolean') continue
    const parsed = Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function objectValue(...values: unknown[]) {
  return values.find(isRecord) as JsonRecord | undefined
}

function unwrap(raw: unknown) {
  if (!isRecord(raw)) return raw
  return raw.Result ?? raw.result ?? raw.Data ?? raw.data ?? raw
}

function findItem(value: unknown, depth = 0): JsonRecord | undefined {
  if (depth > 6) return undefined
  if (isRecord(value)) {
    if (['ItemId', 'itemId', 'Title', 'OriginalTitle', 'Pictures', 'Configurations'].some((key) => key in value)) return value
    for (const child of Object.values(value)) {
      const found = findItem(child, depth + 1)
      if (found) return found
    }
  } else if (Array.isArray(value)) {
    for (const child of value) {
      const found = findItem(child, depth + 1)
      if (found) return found
    }
  }
  return undefined
}

function collectImages(value: unknown, depth = 0, output = new Set<string>()) {
  if (depth > 6 || output.size >= 30) return output
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value) && /\.(?:jpe?g|png|webp|avif)(?:\?|$)/i.test(value)) output.add(value)
    return output
  }
  if (Array.isArray(value)) {
    value.forEach((child) => collectImages(child, depth + 1, output))
    return output
  }
  if (isRecord(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (depth < 3 || /image|picture|photo|picurl|url/i.test(key)) collectImages(child, depth + 1, output)
    }
  }
  return output
}

function collectAttributes(value: unknown, depth = 0, output: Array<{ name: string; value: string }> = []) {
  if (depth > 5 || output.length >= 30) return output
  if (Array.isArray(value)) {
    value.forEach((child) => collectAttributes(child, depth + 1, output))
    return output
  }
  if (!isRecord(value)) return output

  const name = text(value, ['Name', 'name', 'Title', 'title', 'PropertyName', 'AttributeName'])
  const attrValue = text(value, ['Value', 'value', 'Text', 'text', 'PropertyValue', 'AttributeValue'])
  if (name && attrValue) output.push({ name, value: attrValue })
  Object.values(value).forEach((child) => collectAttributes(child, depth + 1, output))
  return output
}

function price(record: JsonRecord) {
  const direct = numberValue(record, ['Price', 'price', 'CurrentPrice', 'SalePrice', 'PromoPrice', 'OriginalPrice'])
  if (direct !== undefined) return direct
  const nested = objectValue(record.Price, record.price, record.PriceInfo, record.PriceObject, record.ConvertedPrice)
  return numberValue(nested, ['Value', 'value', 'Amount', 'amount', 'ConvertedValue', 'OriginalValue'])
}

function currency(record: JsonRecord) {
  const direct = text(record, ['Currency', 'currency', 'CurrencyCode', 'currencyCode'])
  if (direct) return direct
  const nested = objectValue(record.Price, record.price, record.PriceInfo, record.PriceObject, record.ConvertedPrice)
  return text(nested, ['Currency', 'currency', 'CurrencyCode', 'currencyCode'])
}

function collectVariantRecords(value: unknown, depth = 0, output: JsonRecord[] = []) {
  if (depth > 6) return output
  if (Array.isArray(value)) {
    const records = value.filter(isRecord)
    if (records.length && records.some((entry) => text(entry, ['ConfigurationId', 'configurationId', 'SkuId', 'skuId']))) {
      output.push(...records)
    }
    value.forEach((child) => collectVariantRecords(child, depth + 1, output))
    return output
  }
  if (!isRecord(value)) return output
  for (const [key, child] of Object.entries(value)) {
    if (/config|variant|sku/i.test(key) && Array.isArray(child)) output.push(...child.filter(isRecord))
    collectVariantRecords(child, depth + 1, output)
  }
  return output
}

function normalizeVariant(record: JsonRecord, index: number) {
  const attrs = collectAttributes(record)
  const size = attrs.find((entry) => /size|размер|尺码/i.test(entry.name))?.value ?? text(record, ['Size', 'size', 'SizeName', 'sizeName'])
  const availability = scalar(record.IsAvailable ?? record.isAvailable ?? record.IsInStock ?? record.isInStock ?? record.Available ?? record.available)
  const quantity = numberValue(record, ['Quantity', 'quantity', 'Stock', 'stock', 'AvailableQuantity', 'availableQuantity'])
  return {
    id: text(record, ['ConfigurationId', 'configurationId', 'SkuId', 'skuId', 'Id', 'id']) ?? `variant-${index + 1}`,
    size,
    price: price(record),
    currency: currency(record),
    available: typeof availability === 'boolean' ? availability : quantity !== undefined ? quantity > 0 : undefined,
    quantity,
    attributes: attrs,
  }
}

export function normalizePoizonItem(raw: unknown, requestedId?: string) {
  const payload = unwrap(raw)
  const item = findItem(payload) ?? (isRecord(payload) ? payload : {})
  const variants = collectVariantRecords(item).map(normalizeVariant)
  const uniqueVariants = Array.from(new Map(variants.map((variant) => [variant.id, variant])).values())
  const availability = scalar(item.IsAvailable ?? item.isAvailable ?? item.IsInStock ?? item.isInStock ?? item.Available ?? item.available)
  const quantity = numberValue(item, ['Quantity', 'quantity', 'Stock', 'stock', 'AvailableQuantity', 'availableQuantity'])

  return {
    id: text(item, ['ItemId', 'itemId', 'Id', 'id', 'ExternalId']) ?? requestedId,
    title: text(item, ['Title', 'title', 'OriginalTitle', 'Name', 'name']),
    images: Array.from(collectImages(item)),
    price: price(item),
    currency: currency(item),
    available: typeof availability === 'boolean' ? availability : quantity !== undefined ? quantity > 0 : undefined,
    quantity,
    variants: uniqueVariants,
  }
}

function findItems(value: unknown, depth = 0): JsonRecord[] | undefined {
  if (depth > 6) return undefined
  if (isRecord(value)) {
    for (const key of ['Items', 'items', 'ItemInfoList', 'Results', 'results', 'Content', 'content']) {
      const child = value[key]
      if (Array.isArray(child) && child.some(isRecord)) return child.filter(isRecord)
    }
    for (const child of Object.values(value)) {
      const found = findItems(child, depth + 1)
      if (found) return found
    }
  } else if (Array.isArray(value)) {
    if (value.some(isRecord)) return value.filter(isRecord)
  }
  return undefined
}

export function normalizePoizonSearch(raw: unknown) {
  return (findItems(unwrap(raw)) ?? []).map((item) => {
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

function apiError(raw: unknown) {
  if (!isRecord(raw)) return undefined
  const candidates = [raw, objectValue(raw.Error, raw.error), objectValue(raw.Result, raw.result)].filter(isRecord)
  for (const candidate of candidates) {
    const code = text(candidate, ['ErrorCode', 'errorCode', 'Code', 'code'])
    const message = text(candidate, ['ErrorMessage', 'errorMessage', 'Message', 'message', 'Description', 'description'])
    if (message && (code || /error|limit|not found|invalid/i.test(message))) return { code, message }
  }
  return undefined
}

export async function callOtapi(method: string, params: Record<string, string | number | undefined>) {
  const body = new URLSearchParams({ instanceKey: instanceKey(), language: DEFAULT_LANGUAGE })
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') body.set(key, String(value))
  })

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
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')
    throw new OtapiError(timedOut ? 'OTCommerce API timed out.' : 'Could not reach OTCommerce API.', {
      status: timedOut ? 504 : 502,
      code: timedOut ? 'OTAPI_TIMEOUT' : 'OTAPI_UNREACHABLE',
      details: error,
    })
  }

  const bodyText = await response.text()
  let json: unknown
  try {
    json = bodyText ? JSON.parse(bodyText) : null
  } catch {
    throw new OtapiError('OTCommerce API returned an invalid response.', { status: 502, code: 'OTAPI_INVALID_RESPONSE' })
  }

  if (!response.ok) {
    throw new OtapiError(`OTCommerce API returned HTTP ${response.status}.`, {
      status: response.status === 429 ? 429 : 502,
      code: response.status === 429 ? 'OTAPI_RATE_LIMITED' : 'OTAPI_HTTP_ERROR',
      retryAfter: response.headers.get('retry-after') ?? undefined,
      details: json,
    })
  }

  const upstream = apiError(json)
  if (upstream) {
    const rateLimited = /limit|quota|too many/i.test(`${upstream.code ?? ''} ${upstream.message}`)
    const notFound = /not.?found|does not exist|unknown item/i.test(upstream.message)
    throw new OtapiError(upstream.message, {
      status: rateLimited ? 429 : notFound ? 404 : 502,
      code: upstream.code ?? (rateLimited ? 'OTAPI_RATE_LIMITED' : notFound ? 'OTAPI_NOT_FOUND' : 'OTAPI_ERROR'),
      details: json,
    })
  }

  return json
}

export function normalizePoizonId(input: string) {
  const raw = input.trim()
  const id = raw.startsWith('pz-') ? raw : `pz-${raw}`
  if (!/^pz-[A-Za-z0-9_-]+$/.test(id)) {
    throw new OtapiError('Invalid Poizon product ID.', { status: 400, code: 'INVALID_PRODUCT_ID' })
  }
  return id
}

export async function getPoizonItem(itemId: string) {
  const id = normalizePoizonId(itemId)
  const raw = await callOtapi('GetItemFullInfo', { itemId: id })
  return { id, raw, product: normalizePoizonItem(raw, id) }
}

function escapeXml(value: string) {
  const entities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }
  return value.replace(/[<>&'\"]/g, (character) => entities[character] ?? character)
}

export async function searchPoizonItems(query: string, framePosition = 0, frameSize = 20) {
  const safeQuery = escapeXml(query.trim())
  const xmlParameters = `<SearchItemsParameters><Provider>${POIZON_PROVIDER}</Provider><SearchMethod>Default</SearchMethod><ItemTitle>${safeQuery}</ItemTitle></SearchItemsParameters>`
  const raw = await callOtapi('BatchSearchItemsFrame', { framePosition, frameSize, xmlParameters })
  return { raw, items: normalizePoizonSearch(raw) }
}
