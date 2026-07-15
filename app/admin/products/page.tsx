'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import { CatalogProduct, ProductCategory, ProductStatus, seedProducts } from '@/lib/catalog'
import styles from './products.module.css'

const STORAGE_KEY = 'inner-admin-products-v1'

const emptyProduct: Omit<CatalogProduct, 'id'> = {
  name: '',
  category: 'Кроссовки',
  color: '',
  price: 0,
  status: 'Под заказ',
  delivery: '10–17 дней',
  image: '',
  sizes: [],
  description: '',
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<CatalogProduct[]>(seedProducts)
  const [draft, setDraft] = useState(emptyProduct)
  const [sizes, setSizes] = useState('37, 38, 39, 40, 41, 42')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setProducts(JSON.parse(saved) as CatalogProduct[]) } catch { setProducts(seedProducts) }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products, ready])

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.name.trim() || !draft.image.trim() || draft.price <= 0) return

    setProducts((current) => [{
      ...draft,
      id: Date.now(),
      sizes: sizes.split(',').map((item) => item.trim()).filter(Boolean),
    }, ...current])
    setDraft(emptyProduct)
    setSizes('37, 38, 39, 40, 41, 42')
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <Link href="/admin"><ArrowLeft size={17} /> Заявки</Link>
          <span>INNER CONTROL CENTER</span>
          <h1>Товары</h1>
          <p>Добавление и удаление позиций в одной админке.</p>
        </div>
        <div className={styles.counter}><small>Позиций</small><strong>{products.length}</strong></div>
      </header>

      <section className={styles.layout}>
        <form className={styles.formCard} onSubmit={addProduct}>
          <h2><Plus size={19} /> Новый товар</h2>
          <label>Название<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="New Balance 530" required /></label>
          <div className={styles.row}>
            <label>Категория<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ProductCategory })}><option>Кроссовки</option><option>Одежда</option><option>Аксессуары</option><option>Техника</option></select></label>
            <label>Статус<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ProductStatus })}><option>Под заказ</option><option>В наличии</option></select></label>
          </div>
          <div className={styles.row}>
            <label>Цвет<input value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} /></label>
            <label>Цена<input type="number" min="1" value={draft.price || ''} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} required /></label>
          </div>
          <label>Фото по ссылке<input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." required /></label>
          <div className={styles.row}>
            <label>Размеры<input value={sizes} onChange={(e) => setSizes(e.target.value)} /></label>
            <label>Доставка<input value={draft.delivery} onChange={(e) => setDraft({ ...draft, delivery: e.target.value })} /></label>
          </div>
          <label>Описание<textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          <button type="submit"><Save size={18} /> Сохранить товар</button>
          <p className={styles.note}>На этом этапе данные хранятся в браузере администратора. Общую облачную базу подключим следующим шагом.</p>
        </form>

        <div className={styles.listCard}>
          <h2>Каталог</h2>
          <div className={styles.list}>
            {products.map((product) => (
              <article key={product.id}>
                <img src={product.image} alt={product.name} />
                <div><span>{product.category}</span><h3>{product.name}</h3><p>{product.color} · {product.status}</p><strong>{product.price.toLocaleString('ru-RU')} ₽</strong></div>
                <button type="button" onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))} aria-label="Удалить"><Trash2 size={17} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
