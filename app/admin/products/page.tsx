'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Cloud, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { CatalogProduct, ProductCategory, ProductStatus, seedProducts } from '@/lib/catalog'
import styles from './products.module.css'

const emptyProduct: Omit<CatalogProduct, 'id'> = {
  name: '', category: 'Кроссовки', color: '', price: 0, status: 'Под заказ',
  delivery: '10–17 дней', image: '', sizes: [], description: '',
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<CatalogProduct[]>(seedProducts)
  const [draft, setDraft] = useState(emptyProduct)
  const [sizes, setSizes] = useState('37, 38, 39, 40, 41, 42')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [message, setMessage] = useState('')

  async function loadProducts() {
    setLoading(true)
    try {
      const response = await fetch('/api/products', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Ошибка загрузки')
      setProducts(data.products)
      setConfigured(Boolean(data.configured))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadProducts() }, [])

  function resetForm() {
    setDraft(emptyProduct)
    setSizes('37, 38, 39, 40, 41, 42')
    setEditingId(null)
  }

  function editProduct(product: CatalogProduct) {
    const { id, ...values } = product
    setEditingId(id)
    setDraft(values)
    setSizes(product.sizes.join(', '))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      ...draft,
      sizes: sizes.split(',').map((item) => item.trim()).filter(Boolean),
      ...(editingId ? { id: editingId } : {}),
    }

    try {
      const response = await fetch('/api/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Ошибка сохранения')
      setMessage(editingId ? 'Товар обновлён.' : 'Товар добавлен.')
      resetForm()
      await loadProducts()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить товар')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: number) {
    if (!window.confirm('Удалить этот товар?')) return
    try {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Ошибка удаления')
      setProducts((current) => current.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось удалить товар')
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <Link href="/admin"><ArrowLeft size={17} /> Заявки</Link>
          <span>INNER CONTROL CENTER</span>
          <h1>Товары</h1>
          <p>Единый каталог для сайта и всех устройств.</p>
        </div>
        <div className={styles.counter}><small>Позиций</small><strong>{products.length}</strong></div>
      </header>

      <div className={styles.cloudState} data-active={configured}>
        <Cloud size={17} />
        <span>{configured ? 'Облачная база Supabase подключена' : 'Демо-режим: добавьте ключи Supabase в Vercel'}</span>
      </div>

      {message && <div className={styles.message}>{message}</div>}

      <section className={styles.layout}>
        <form className={styles.formCard} onSubmit={saveProduct}>
          <h2>{editingId ? <Pencil size={19} /> : <Plus size={19} />} {editingId ? 'Редактирование товара' : 'Новый товар'}</h2>
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
          <button type="submit" disabled={saving || !configured}>{saving ? <Loader2 className={styles.spin} size={18} /> : <Save size={18} />} {editingId ? 'Сохранить изменения' : 'Добавить товар'}</button>
          {editingId && <button className={styles.cancelButton} type="button" onClick={resetForm}><X size={17} /> Отмена</button>}
          <p className={styles.note}>{configured ? 'Изменения сразу сохраняются в общей базе.' : 'После подключения Supabase форма станет активной.'}</p>
        </form>

        <div className={styles.listCard}>
          <h2>Каталог</h2>
          {loading ? <div className={styles.loading}><Loader2 className={styles.spin} /> Загрузка...</div> : (
            <div className={styles.list}>
              {products.map((product) => (
                <article key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div><span>{product.category}</span><h3>{product.name}</h3><p>{product.color} · {product.status}</p><strong>{product.price.toLocaleString('ru-RU')} ₽</strong></div>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => editProduct(product)} aria-label="Редактировать"><Pencil size={17} /></button>
                    <button type="button" onClick={() => void deleteProduct(product.id)} aria-label="Удалить" disabled={!configured}><Trash2 size={17} /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
