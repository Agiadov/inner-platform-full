import { unstable_cache } from 'next/cache'
import { jsonWithCors, preflight } from '@/lib/cors'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-rest'

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
  async () => supabaseRequest<CatalogRow[]>(
    `products?select=${columns}&is_active=eq.true&order=sort_order.asc,id.asc`,
  ),
  ['inner-owned-catalog-v1'],
  { revalidate: 60 },
)

export function OPTIONS(request: Request) {
  return preflight(request)
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return jsonWithCors(request, {
      ok: false,
      items: [],
      message: 'Актуальную цену уточним перед оплатой',
    }, { status: 503 })
  }

  try {
    const rows = await readCatalog()
    const items = rows.map((row) => ({
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
      variants: row.variants,
      finalPriceRub: row.price > 0 ? row.price : null,
      priceConfirmedAt: row.price_confirmed_at,
      updatedAt: row.updated_at,
    }))

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
