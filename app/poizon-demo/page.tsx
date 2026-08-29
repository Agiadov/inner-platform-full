'use client'

import { useEffect, useMemo, useState } from 'react'

type Variant = {
  id: string
  size?: string
  version?: string
  price?: number
  regularPrice?: number
  promotionPrice?: number
  currency?: string
  quantity?: number
  available?: boolean
}

type Product = {
  id: string
  title?: string
  brand?: string
  article?: string
  images?: string[]
  price?: number
  regularPrice?: number
  promotionPrice?: number
  currency?: string
  variants?: Variant[]
}

type ApiResponse = {
  ok: boolean
  product?: Product
  error?: string
}

const PRODUCT_ID = 'pz-10001262684'

export default function PoizonDemoPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  useEffect(() => {
    fetch(`/api/poizon/item/${PRODUCT_ID}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        setData(json)
        const first = json.product?.variants?.find((variant) => variant.available !== false)
        if (first) setSelectedId(first.id)
      })
      .catch(() => setData({ ok: false, error: 'Не удалось загрузить товар' }))
  }, [])

  const product = data?.product
  const variants = product?.variants ?? []
  const selected = useMemo(
    () => variants.find((variant) => variant.id === selectedId),
    [variants, selectedId],
  )

  if (!data) {
    return <main style={styles.page}><div style={styles.card}>Загружаем товар Poizon…</div></main>
  }

  if (!data.ok || !product) {
    return <main style={styles.page}><div style={styles.card}>Ошибка: {data.error ?? 'Товар не найден'}</div></main>
  }

  const currentPrice = selected?.price ?? product.price
  const regularPrice = selected?.regularPrice ?? product.regularPrice
  const hasDiscount = Boolean(
    selected?.promotionPrice && regularPrice && selected.promotionPrice < regularPrice,
  )

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.gallery}>
          <div style={styles.mainImageWrap}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title ?? 'Poizon product'} style={styles.mainImage} />
            ) : null}
          </div>
          <div style={styles.thumbs}>
            {(product.images ?? []).slice(0, 5).map((src) => (
              <div key={src} style={styles.thumbWrap}>
                <img src={src} alt="" style={styles.thumb} />
              </div>
            ))}
          </div>
        </section>

        <section style={styles.info}>
          <div style={styles.eyebrow}>{product.brand ?? 'Poizon'}</div>
          <h1 style={styles.title}>{product.title}</h1>
          {product.article ? <div style={styles.article}>Артикул: {product.article}</div> : null}

          <div style={styles.priceBlock}>
            {hasDiscount && regularPrice ? (
              <span style={styles.oldPrice}>{regularPrice} {selected?.currency ?? product.currency ?? 'CNY'}</span>
            ) : null}
            <div style={styles.price}>
              {currentPrice ?? '—'} {selected?.currency ?? product.currency ?? 'CNY'}
            </div>
            <div style={styles.caption}>Актуальная цена Poizon для выбранного размера</div>
          </div>

          <div style={styles.sectionLabel}>Выберите размер</div>
          <div style={styles.sizeGrid}>
            {variants.map((variant) => {
              const active = variant.id === selectedId
              const disabled = variant.available === false
              return (
                <button
                  key={variant.id}
                  disabled={disabled}
                  onClick={() => setSelectedId(variant.id)}
                  style={{
                    ...styles.sizeButton,
                    ...(active ? styles.sizeButtonActive : {}),
                    ...(disabled ? styles.sizeButtonDisabled : {}),
                  }}
                >
                  {variant.size ?? '—'}
                </button>
              )
            })}
          </div>

          {selected ? (
            <div style={styles.selectedBox}>
              <div><strong>Размер:</strong> {selected.size}</div>
              <div><strong>Наличие:</strong> {selected.available ? 'Есть' : 'Нет'}</div>
              <div><strong>Количество:</strong> {selected.quantity ?? '—'}</div>
              <div><strong>Configuration ID:</strong> {selected.id}</div>
            </div>
          ) : null}

          <button style={styles.cta}>Рассчитать финальную цену в ₽</button>
          <div style={styles.note}>Демо: пока без наценки INNER и доставки. Следующим шагом подключим формулу финальной цены.</div>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#07090d',
    color: '#f7f8fb',
    padding: '32px 18px',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  shell: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, .9fr)',
    gap: 36,
    alignItems: 'start',
  },
  card: {
    maxWidth: 760,
    margin: '80px auto',
    padding: 28,
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 24,
    background: 'rgba(255,255,255,.04)',
  },
  gallery: {
    display: 'grid',
    gap: 14,
  },
  mainImageWrap: {
    minHeight: 560,
    borderRadius: 28,
    background: 'linear-gradient(145deg,#151a22,#0b0e13)',
    border: '1px solid rgba(109,178,255,.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    maxHeight: 620,
    objectFit: 'contain',
  },
  thumbs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5,1fr)',
    gap: 10,
  },
  thumbWrap: {
    aspectRatio: '1/1',
    background: '#11151c',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,.08)',
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover' },
  info: {
    position: 'sticky',
    top: 24,
    padding: 28,
    borderRadius: 28,
    background: 'rgba(15,18,24,.92)',
    border: '1px solid rgba(109,178,255,.18)',
    boxShadow: '0 24px 80px rgba(0,0,0,.35)',
  },
  eyebrow: {
    color: '#76b9ff',
    textTransform: 'uppercase',
    letterSpacing: '.12em',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  title: { fontSize: 30, lineHeight: 1.12, margin: 0 },
  article: { marginTop: 10, color: '#8f98a8', fontSize: 14 },
  priceBlock: { marginTop: 28, marginBottom: 26 },
  oldPrice: { color: '#7f8794', textDecoration: 'line-through', fontSize: 16 },
  price: { fontSize: 36, fontWeight: 800, marginTop: 4 },
  caption: { color: '#929bab', fontSize: 13, marginTop: 6 },
  sectionLabel: { fontWeight: 700, marginBottom: 12 },
  sizeGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  sizeButton: {
    minWidth: 58,
    height: 44,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,.14)',
    background: '#131820',
    color: '#f5f7fb',
    cursor: 'pointer',
    fontWeight: 700,
  },
  sizeButtonActive: {
    border: '1px solid #61adff',
    boxShadow: '0 0 0 2px rgba(97,173,255,.14)',
    background: '#172537',
  },
  sizeButtonDisabled: {
    opacity: .28,
    cursor: 'not-allowed',
    textDecoration: 'line-through',
  },
  selectedBox: {
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    background: '#0d1219',
    border: '1px solid rgba(255,255,255,.08)',
    display: 'grid',
    gap: 8,
    color: '#c8ced8',
    fontSize: 14,
  },
  cta: {
    width: '100%',
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    border: 0,
    background: '#4ba6ff',
    color: '#04101d',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'pointer',
  },
  note: { marginTop: 10, color: '#7f8998', fontSize: 12, lineHeight: 1.45 },
}
