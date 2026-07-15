import { NextResponse } from 'next/server'
import { seedProducts, type CatalogProduct } from '@/lib/catalog'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-rest'

const columns = 'id,name,category,color,price,status,delivery,image,sizes,description,created_at'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, configured: false, products: seedProducts })
  }

  try {
    const products = await supabaseRequest<CatalogProduct[]>(`products?select=${columns}&order=created_at.desc`)
    return NextResponse.json({ ok: true, configured: true, products })
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json({ ok: false, error: 'Не удалось загрузить товары.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase не настроен в Vercel.' }, { status: 503 })
  }

  try {
    const product = (await request.json()) as Omit<CatalogProduct, 'id'>
    if (!product.name?.trim() || !product.image?.trim() || Number(product.price) <= 0) {
      return NextResponse.json({ ok: false, error: 'Заполните название, цену и фото.' }, { status: 400 })
    }

    const created = await supabaseRequest<CatalogProduct[]>('products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
    return NextResponse.json({ ok: true, product: created[0] })
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json({ ok: false, error: 'Не удалось сохранить товар.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase не настроен в Vercel.' }, { status: 503 })
  }

  try {
    const product = (await request.json()) as CatalogProduct
    if (!product.id) return NextResponse.json({ ok: false, error: 'Не указан ID товара.' }, { status: 400 })

    const { id, ...changes } = product
    const updated = await supabaseRequest<CatalogProduct[]>(`products?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    })
    return NextResponse.json({ ok: true, product: updated[0] })
  } catch (error) {
    console.error('Products PUT error:', error)
    return NextResponse.json({ ok: false, error: 'Не удалось обновить товар.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase не настроен в Vercel.' }, { status: 503 })
  }

  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Не указан ID товара.' }, { status: 400 })

    await supabaseRequest(`products?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Products DELETE error:', error)
    return NextResponse.json({ ok: false, error: 'Не удалось удалить товар.' }, { status: 500 })
  }
}
