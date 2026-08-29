import { unstable_cache } from 'next/cache'
import { jsonWithCors, preflight } from '@/lib/cors'
import { supabasePublicRequest } from '@/lib/supabase-rest'

export const dynamic = 'force-dynamic'

type CatalogVariant = {
  size: string
  available: boolean
  finalPriceRub: number | null
}

type CatalogRow = {
  id: number
  name: string
  category: string
  color: string
  price: number
  status: string
  delivery: string
  image: string
  images: string[]
  sizes: string[]
  variants: CatalogVariant[]
  brand: string
  model: string
  article: string
  description: string
  price_confirmed_at: string | null
  updated_at: string
}

const columns = [
  'id', 'name', 'category', 'color', 'price', 'status', 'delivery', 'image', 'images',
  'sizes', 'variants', 'brand', 'model', 'article', 'description', 'price_confirmed_at', 'updated_at',
].join(',')

const readCatalog = unstable_cache(
  async () => supabasePublicRequest<CatalogRow[]>(
    `products?select=${columns}&is_active=eq.true&order=sort_order.asc,id.asc`,
  ),
  ['inner-owned-catalog-v1'],
  { revalidate: 60 },
)

const APPLE_USD_PRICES: Record<string, Record<string, number>> = {
  'APPLE-IPHONE-17E': { '256 GB': 599, '512 GB': 799 },
  'APPLE-IPHONE-17': { '256 GB': 799, '512 GB': 999 },
  'APPLE-IPHONE-AIR': { '256 GB': 999, '512 GB': 1199, '1 TB': 1399 },
  'APPLE-IPHONE-17-PRO': { '256 GB': 1099, '512 GB': 1299, '1 TB': 1499 },
  'APPLE-IPHONE-17-PRO-MAX': {
    '256 GB': 1199,
    '512 GB': 1399,
    '1 TB': 1599,
    '2 TB': 1999,
  },
}

const getCbrUsdRate = unstable_cache(
  async () => {
    const response = await fetch('https://www.cbr.ru/scripts/XML_daily.asp', {
      headers: { Accept: 'application/xml,text/xml' },
    })
    if (!response.ok) throw new Error(`CBR rate request failed: ${response.status}`)
    const xml = await response.text()
    const usd = xml.match(
      /<Valute[^>]*>[\s\S]*?<CharCode>USD<\/CharCode>[\s\S]*?<Nominal>(\d+)<\/Nominal>[\s\S]*?<Value>([\d,]+)<\/Value>[\s\S]*?<\/Valute>/,
    )
    if (!usd) throw new Error('USD rate missing in CBR response')
    const nominal = Number(usd[1])
    const value = Number(usd[2].replace(',', '.'))
    if (!Number.isFinite(nominal) || !Number.isFinite(value) || nominal <= 0) {
      throw new Error('Invalid USD rate in CBR response')
    }
    return value / nominal
  },
  ['cbr-usd-rate-v1'],
  { revalidate: 21_600 },
)

function finalInnerPrice(usdPrice: number, usdRate: number) {
  const calculated = (usdPrice * usdRate + 5_000) * 1.15
  return Math.ceil(calculated / 1_000) * 1_000 - 10
}

export function OPTIONS(request: Request) {
  return preflight(request)
}

export async function GET(request: Request) {
  try {
    const rows = await readCatalog()
    const usdRate = await getCbrUsdRate().catch(() => null)
    const items = rows.map((row) => {
      const applePrices = APPLE_USD_PRICES[row.article]
      const cbrVariants = applePrices && usdRate
        ? Object.entries(applePrices).map(([size, usdPrice]) => ({
            size,
            available: true,
            finalPriceRub: finalInnerPrice(usdPrice, usdRate),
          }))
        : null
      const finalPriceRub = cbrVariants?.[0]?.finalPriceRub ?? (row.price > 0 ? row.price : null)

      return {
        id: `inner-${row.id}`,
        source: 'INNER',
        name: row.name,
        category: row.category,
        brand: row.brand,
        model: row.model,
        article: row.article,
        color: row.color,
        status: row.status,
        delivery: row.delivery,
        description: row.description,
        images: row.images.length ? row.images : row.image ? [row.image] : [],
        sizes: row.sizes,
        variants: cbrVariants ?? row.variants,
        finalPriceRub,
        priceConfirmedAt: row.price_confirmed_at,
        updatedAt: row.updated_at,
      }
    })

    return jsonWithCors(request, {
      ok: true,
      source: 'INNER',
      items,
      message: 'Актуальную цену уточним перед оплатой',
    })
  } catch (error) {
    console.error('INNER catalog endpoint error:', error)
    return jsonWithCors(request, {
      ok: false,
      items: [],
      message: 'Актуальную цену уточним перед оплатой',
    }, { status: 503 })
  }
}
