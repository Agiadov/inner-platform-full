export type PoizonVariant = {
  id: string
  size?: string
  price?: number
  currency?: string
  available?: boolean
  quantity?: number
  attributes: Array<{ name: string; value: string }>
}

export type PoizonProduct = {
  id?: string
  title?: string
  images: string[]
  price?: number
  currency?: string
  available?: boolean
  quantity?: number
  variants: PoizonVariant[]
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json()
  if (!response.ok) {
    const message = typeof payload?.error === 'string' ? payload.error : 'Poizon request failed.'
    throw new Error(message)
  }
  return payload as T
}

export async function getPoizonProduct(productId: string) {
  const response = await fetch(`/api/poizon/item/${encodeURIComponent(productId)}`)
  return readJson<{ ok: true; provider: 'Poizon'; productId: string; product: PoizonProduct }>(response)
}

export async function searchPoizon(query: string, options: { offset?: number; limit?: number } = {}) {
  const params = new URLSearchParams({ q: query })
  if (options.offset !== undefined) params.set('offset', String(options.offset))
  if (options.limit !== undefined) params.set('limit', String(options.limit))

  const response = await fetch(`/api/poizon/search?${params.toString()}`)
  return readJson<{
    ok: true
    provider: 'Poizon'
    query: string
    offset: number
    limit: number
    items: Array<{
      id?: string
      title?: string
      images: string[]
      price?: number
      currency?: string
      available?: boolean
    }>
  }>(response)
}
