'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Home,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react'

type Product = {
  id: number
  name: string
  color: string
  price: string
  status: 'В наличии' | 'Под заказ'
  delivery: string
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'New Balance 530',
    color: 'White / Silver',
    price: '9 000 ₽',
    status: 'Под заказ',
    delivery: '10–17 дней',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Nike Air Force 1',
    color: 'Triple White',
    price: '11 000 ₽',
    status: 'В наличии',
    delivery: '1–3 дня',
    image:
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'ASICS Gel-Kayano 14',
    color: 'Cream / Black',
    price: '14 900 ₽',
    status: 'Под заказ',
    delivery: '10–17 дней',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Adidas Campus 00s',
    color: 'Core Black',
    price: '10 500 ₽',
    status: 'В наличии',
    delivery: '1–3 дня',
    image:
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=85',
  },
]

const categories = [
  ['Кроссовки', '128 товаров', '01'],
  ['Одежда', '84 товара', '02'],
  ['Аксессуары', '56 товаров', '03'],
  ['Техника', '24 товара', '04'],
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('Главная')

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return products
    return products.filter((product) =>
      `${product.name} ${product.color}`.toLowerCase().includes(normalized),
    )
  }, [query])

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <main className="inner-app-shell">
      <div className="ice-orb ice-orb-one" />
      <div className="ice-orb ice-orb-two" />

      <div className="inner-app">
        <header className="topbar">
          <div className="brand-lockup" aria-label="INNER">
            <span className="brand-mark">IN</span>
            <span className="brand-name">INNER</span>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Избранное">
              <Heart size={20} />
              {favorites.length > 0 && <span className="counter">{favorites.length}</span>}
            </button>
            <button className="icon-button" aria-label="Корзина">
              <ShoppingBag size={20} />
            </button>
            <button className="avatar-button" aria-label="Профиль">
              <UserRound size={18} />
            </button>
          </div>
        </header>

        <section className="search-row" aria-label="Поиск по каталогу">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти бренд или модель"
          />
          <button className="filter-button" aria-label="Фильтры">
            <SlidersHorizontal size={18} />
          </button>
        </section>

        <section className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} />
              ORIGINAL GOODS
            </div>
            <h1>Оригинальные вещи без сложностей</h1>
            <p>
              Кроссовки, одежда и аксессуары из-за рубежа с проверкой подлинности.
            </p>
            <button className="primary-button">
              Смотреть каталог
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-product" aria-hidden="true">
            <div className="hero-glow" />
            <img src={products[0].image} alt="" />
            <span className="original-stamp">100% ORIGINAL</span>
          </div>
        </section>

        <section className="trust-strip" aria-label="Преимущества INNER">
          <div><CheckCircle2 size={18} /><span>Проверка подлинности</span></div>
          <div><CheckCircle2 size={18} /><span>Прозрачная цена</span></div>
          <div><CheckCircle2 size={18} /><span>Доставка по России</span></div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SHOP BY</span>
              <h2>Категории</h2>
            </div>
            <button>Все <ArrowRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categories.map(([title, count, number]) => (
              <button className="category-card" key={title}>
                <span className="category-index">{number}</span>
                <span className="category-title">{title}</span>
                <span className="category-count">{count}</span>
                <ArrowRight className="category-arrow" size={18} />
              </button>
            ))}
          </div>
        </section>

        <section className="section-block product-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">CURATED</span>
              <h2>{query ? 'Результаты поиска' : 'Популярное'}</h2>
            </div>
            <button>Каталог <ArrowRight size={16} /></button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isFavorite = favorites.includes(product.id)
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <span className="product-badge">ORIGINAL</span>
                      <button
                        className={`favorite-button ${isFavorite ? 'is-active' : ''}`}
                        onClick={() => toggleFavorite(product.id)}
                        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                      >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <img src={product.image} alt={`${product.name} ${product.color}`} />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.color}</p>
                      <strong>{product.price}</strong>
                      <div className="product-meta">
                        <span className={product.status === 'В наличии' ? 'in-stock' : 'preorder'}>
                          {product.status}
                        </span>
                        <span>{product.delivery}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={30} />
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить запрос или открыть весь каталог.</p>
            </div>
          )}
        </section>

        <section className="support-card">
          <div>
            <span className="section-kicker">PERSONAL SHOPPING</span>
            <h2>Не нашли нужный товар?</h2>
            <p>Пришлите ссылку или фото — рассчитаем итоговую стоимость и доставку.</p>
          </div>
          <button className="secondary-button">Написать @lutoway</button>
        </section>
      </div>

      <nav className="bottom-nav" aria-label="Навигация Mini App">
        {[
          ['Главная', Home],
          ['Каталог', Search],
          ['Избранное', Heart],
          ['Корзина', ShoppingCart],
        ].map(([label, Icon]) => {
          const icon = Icon as typeof Home
          const active = activeTab === label
          return (
            <button
              key={label as string}
              className={active ? 'active' : ''}
              onClick={() => setActiveTab(label as string)}
            >
              {icon({ size: 20 })}
              <span>{label as string}</span>
            </button>
          )
        })}
      </nav>
    </main>
  )
}
