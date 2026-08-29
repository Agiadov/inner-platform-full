'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/inner/header'
import { Footer } from '@/components/inner/footer'

type PriceBreakdown = { finalPriceRub?: number }
type Variant = { id: string; size?: string; price?: number; regularPrice?: number; promotionPrice?: number; currency?: string; quantity?: number; available?: boolean; innerPrice?: PriceBreakdown }
type Product = { id: string; title?: string; brand?: string; article?: string; images?: string[]; variants?: Variant[]; innerPrice?: PriceBreakdown }
type ApiResponse = { ok: boolean; product?: Product; error?: string }

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const id = decodeURIComponent(params.id)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    fetch(`/api/poizon/item/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        setData(json)
        const first = json.product?.variants?.find((v) => v.available !== false)
        if (first) setSelectedId(first.id)
      })
      .catch(() => setData({ ok: false, error: 'Не удалось загрузить товар' }))
  }, [id])

  const product = data?.product
  const variants = product?.variants ?? []
  const selected = useMemo(() => variants.find((v) => v.id === selectedId), [variants, selectedId])
  const finalRub = selected?.innerPrice?.finalPriceRub ?? product?.innerPrice?.finalPriceRub

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <Link href="/catalog" className="text-sm text-muted-foreground hover:text-foreground">← Назад в каталог</Link>

          {!data ? <div className="py-20 text-muted-foreground">Загружаем товар…</div> : null}
          {data && (!data.ok || !product) ? <div className="py-20 text-red-500">{data.error ?? 'Товар не найден'}</div> : null}

          {product ? (
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <div>
                <div className="aspect-square bg-white rounded-3xl overflow-hidden flex items-center justify-center border border-border">
                  {product.images?.[0] ? <img src={product.images[0]} alt={product.title ?? product.id} className="w-full h-full object-contain" /> : null}
                </div>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {(product.images ?? []).slice(0, 5).map((src) => <div key={src} className="aspect-square bg-white rounded-xl overflow-hidden border border-border"><img src={src} alt="" className="w-full h-full object-contain" /></div>)}
                </div>
              </div>

              <div className="lg:sticky lg:top-24 h-fit bg-card border border-border rounded-3xl p-6 sm:p-8">
                <div className="text-xs uppercase tracking-[.12em] text-primary font-semibold">{product.brand ?? 'Poizon'}</div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 leading-tight">{product.title}</h1>
                {product.article ? <div className="text-sm text-muted-foreground mt-2">Артикул: {product.article}</div> : null}

                <div className="mt-7">
                  <div className="text-sm text-muted-foreground">Финальная цена INNER</div>
                  <div className="text-4xl font-bold mt-1">{finalRub ? `${finalRub.toLocaleString('ru-RU')} ₽` : '—'}</div>
                  {selected?.price ? <div className="text-xs text-muted-foreground mt-1">Poizon: {selected.price} {selected.currency ?? 'CNY'}</div> : null}
                </div>

                <div className="mt-7 font-semibold">Выберите размер</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {variants.map((v) => {
                    const disabled = v.available === false
                    const active = v.id === selectedId
                    return <button key={v.id} disabled={disabled} onClick={() => setSelectedId(v.id)} className={`min-w-14 h-11 px-3 rounded-xl border text-sm font-semibold transition ${active ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-foreground'} ${disabled ? 'opacity-30 line-through cursor-not-allowed' : 'hover:border-primary/60'}`}>{v.size}</button>
                  })}
                </div>

                {selected ? <div className="mt-5 p-4 rounded-2xl bg-secondary text-sm text-muted-foreground"><div>Размер: <span className="text-foreground font-medium">{selected.size}</span></div><div className="mt-1">Наличие: <span className="text-foreground font-medium">{selected.available ? 'есть' : 'нет'}</span></div></div> : null}

                <button disabled={!selected || selected.available === false} className="w-full mt-6 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-40">Добавить в заявку</button>
                <div className="text-xs text-muted-foreground mt-3 text-center">Цена рассчитана по текущей стоимости Poizon с доставкой и наценкой INNER</div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  )
}
