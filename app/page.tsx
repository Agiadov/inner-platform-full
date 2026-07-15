'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Home,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import styles from './page.module.css'

type Product = {
  id: number
  name: string
  color: string
  price: number
  status: 'В наличии' | 'Под заказ'
  delivery: string
  image: string
  sizes: string[]
  description: string
}

type NavigationItem = {
  label: View
  icon: LucideIcon
}

type View = 'Главная' | 'Каталог' | 'Избранное' | 'Корзина'

type CartItem = {
  product: Product
  size: string
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'New Balance 530',
    color: 'White / Silver',
    price: 9000,
    status: 'Под заказ',
    delivery: '10–17 дней',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=88',
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    description: 'Лёгкая повседневная модель с фирменной амортизацией и серебристыми деталями.',
  },
  {
    id: 2,
    name: 'Nike Air Force 1',
    color: 'Triple White',
    price: 11000,
    status: 'В наличии',
    delivery: '1–3 дня',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=88',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    description: 'Классические белые кроссовки из натуральной кожи. Проверка подлинности включена.',
  },
  {
    id: 3,
    name: 'ASICS Gel-Kayano 14',
    color: 'Cream / Black',
    price: 14900,
    status: 'Под заказ',
    delivery: '10–17 дней',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=88',
    sizes: ['37.5', '38', '39', '40', '41.5', '42.5', '43.5'],
    description: 'Технологичная беговая эстетика 2000-х с мягкой посадкой и стабильной подошвой.',
  },
  {
    id: 4,
    name: 'Adidas Campus 00s',
    color: 'Core Black',
    price: 10500,
    status: 'В наличии',
    delivery: '1–3 дня',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=88',
    sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
    description: 'Замшевый силуэт с объёмными шнурками и массивной подошвой в стиле 2000-х.',
  },
]

const categories = ['Все', 'Кроссовки', 'Одежда', 'Аксессуары', 'Техника']

const navigationItems: NavigationItem[] = [
  { label: 'Главная', icon: Home },
  { label: 'Каталог', icon: Search },
  { label: 'Избранное', icon: Heart },
  { label: 'Корзина', icon: ShoppingCart },
]

const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeView, setActiveView] = useState<View>('Главная')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showOrder, setShowOrder] = useState(false)

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const source = activeView === 'Избранное' ? products.filter((item) => favorites.includes(item.id)) : products
    if (!normalized) return source
    return source.filter((product) => `${product.name} ${product.color}`.toLowerCase().includes(normalized))
  }, [query, activeView, favorites])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function openProduct(product: Product) {
    setSelectedProduct(product)
    setSelectedSize(product.sizes[0])
  }

  function addToCart() {
    if (!selectedProduct || !selectedSize) return
    setCart((current) => {
      const existing = current.find((item) => item.product.id === selectedProduct.id && item.size === selectedSize)
      if (existing) {
        return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, { product: selectedProduct, size: selectedSize, quantity: 1 }]
    })
    setSelectedProduct(null)
    setActiveView('Корзина')
  }

  function changeQuantity(index: number, delta: number) {
    setCart((current) => current.flatMap((item, itemIndex) => {
      if (itemIndex !== index) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  const renderProducts = (items: Product[]) => (
    <div className="product-grid">
      {items.map((product) => {
        const isFavorite = favorites.includes(product.id)
        return (
          <article className="product-card" key={product.id} onClick={() => openProduct(product)}>
            <div className="product-image-wrap">
              <span className="product-badge">ORIGINAL</span>
              <button
                className={`favorite-button ${isFavorite ? 'is-active' : ''}`}
                onClick={(event) => { event.stopPropagation(); toggleFavorite(product.id) }}
                aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                type="button"
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <img src={product.image} alt={`${product.name} ${product.color}`} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.color}</p>
              <strong>{formatPrice(product.price)}</strong>
              <div className="product-meta">
                <span className={product.status === 'В наличии' ? 'in-stock' : 'preorder'}>{product.status}</span>
                <span>{product.delivery}</span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )

  return (
    <main className="inner-app-shell">
      <div className="ice-orb ice-orb-one" />
      <div className="ice-orb ice-orb-two" />

      <div className="inner-app">
        <header className="topbar">
          <button className={styles.brandButton} onClick={() => setActiveView('Главная')} type="button" aria-label="На главную">
            <span className="brand-mark">IN</span>
            <span className="brand-name">INNER</span>
          </button>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setActiveView('Избранное')} aria-label="Избранное" type="button">
              <Heart size={20} />
              {favorites.length > 0 && <span className="counter">{favorites.length}</span>}
            </button>
            <button className="icon-button" onClick={() => setActiveView('Корзина')} aria-label="Корзина" type="button">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="counter">{cartCount}</span>}
            </button>
            <button className="avatar-button" aria-label="Профиль" type="button"><UserRound size={18} /></button>
          </div>
        </header>

        {activeView !== 'Корзина' && (
          <section className="search-row" aria-label="Поиск по каталогу">
            <Search size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти бренд или модель" aria-label="Найти бренд или модель" />
            <button className="filter-button" aria-label="Фильтры" type="button"><SlidersHorizontal size={18} /></button>
          </section>
        )}

        {activeView === 'Главная' && (
          <>
            <section className="hero-card">
              <div className="hero-copy">
                <div className="eyebrow"><Sparkles size={14} /> ORIGINAL GOODS</div>
                <h1>Оригинальные вещи без сложностей</h1>
                <p>Кроссовки, одежда и аксессуары из-за рубежа с проверкой подлинности.</p>
                <button className="primary-button" onClick={() => setActiveView('Каталог')} type="button">Смотреть каталог <ArrowRight size={18} /></button>
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
              <div className="section-heading"><div><span className="section-kicker">SHOP BY</span><h2>Категории</h2></div><button onClick={() => setActiveView('Каталог')} type="button">Все <ArrowRight size={16} /></button></div>
              <div className="category-grid">
                {categories.slice(1).map((title, index) => (
                  <button className="category-card" key={title} onClick={() => setActiveView('Каталог')} type="button">
                    <span className="category-index">0{index + 1}</span><span className="category-title">{title}</span><span className="category-count">Подборка INNER</span><ArrowRight className="category-arrow" size={18} />
                  </button>
                ))}
              </div>
            </section>

            <section className="section-block product-section">
              <div className="section-heading"><div><span className="section-kicker">CURATED</span><h2>Популярное</h2></div><button onClick={() => setActiveView('Каталог')} type="button">Каталог <ArrowRight size={16} /></button></div>
              {renderProducts(filteredProducts)}
            </section>
          </>
        )}

        {(activeView === 'Каталог' || activeView === 'Избранное') && (
          <section className={styles.catalogPage}>
            <div className={styles.pageHeader}>
              <div><span className="section-kicker">INNER SELECT</span><h1>{activeView}</h1><p>{activeView === 'Избранное' ? 'Сохранённые товары' : 'Оригинальные товары в наличии и под заказ'}</p></div>
              <span>{filteredProducts.length} товаров</span>
            </div>
            {activeView === 'Каталог' && <div className={styles.chips}>{categories.map((item, index) => <button className={index === 0 ? styles.chipActive : ''} key={item} type="button">{item}</button>)}</div>}
            {filteredProducts.length > 0 ? renderProducts(filteredProducts) : <div className="empty-state"><Heart size={30} /><h3>Здесь пока пусто</h3><p>Добавьте товары в избранное, чтобы вернуться к ним позже.</p></div>}
          </section>
        )}

        {activeView === 'Корзина' && (
          <section className={styles.cartPage}>
            <div className={styles.pageHeader}><div><span className="section-kicker">YOUR ORDER</span><h1>Корзина</h1><p>{cartCount ? `${cartCount} товара в заказе` : 'Добавьте товар из каталога'}</p></div></div>
            {cart.length === 0 ? (
              <div className="empty-state"><ShoppingCart size={30} /><h3>Корзина пуста</h3><p>Выберите товар и нужный размер.</p><button className="primary-button" onClick={() => setActiveView('Каталог')} type="button">Перейти в каталог</button></div>
            ) : (
              <div className={styles.cartLayout}>
                <div className={styles.cartList}>
                  {cart.map((item, index) => (
                    <article className={styles.cartItem} key={`${item.product.id}-${item.size}`}>
                      <img src={item.product.image} alt={item.product.name} />
                      <div><h3>{item.product.name}</h3><p>{item.product.color} · размер {item.size}</p><strong>{formatPrice(item.product.price)}</strong></div>
                      <div className={styles.quantity}><button onClick={() => changeQuantity(index, -1)} type="button">{item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}</button><span>{item.quantity}</span><button onClick={() => changeQuantity(index, 1)} type="button"><Plus size={16} /></button></div>
                    </article>
                  ))}
                </div>
                <aside className={styles.summaryCard}>
                  <h2>Итого</h2><div><span>Товары</span><strong>{formatPrice(cartTotal)}</strong></div><div><span>Доставка</span><strong>Рассчитаем</strong></div><hr /><div className={styles.total}><span>К оплате</span><strong>{formatPrice(cartTotal)}</strong></div><button className="primary-button" onClick={() => setShowOrder(true)} type="button">Оформить заявку</button><p>Менеджер подтвердит наличие, итоговую цену и срок доставки.</p>
                </aside>
              </div>
            )}
          </section>
        )}
      </div>

      <nav className="bottom-nav" aria-label="Навигация Mini App">
        {navigationItems.map(({ label, icon: Icon }) => <button key={label} className={activeView === label ? 'active' : ''} onClick={() => setActiveView(label)} type="button"><Icon size={20} /><span>{label}</span></button>)}
      </nav>

      {selectedProduct && (
        <div className={styles.overlay} onClick={() => setSelectedProduct(null)}>
          <section className={styles.productSheet} onClick={(event) => event.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedProduct(null)} type="button"><X size={20} /></button>
            <div className={styles.detailImage}><img src={selectedProduct.image} alt={selectedProduct.name} /><span>ORIGINAL</span></div>
            <div className={styles.detailContent}><button className={styles.backLink} onClick={() => setSelectedProduct(null)} type="button"><ArrowLeft size={16} /> Назад</button><h2>{selectedProduct.name}</h2><p>{selectedProduct.color}</p><strong className={styles.detailPrice}>{formatPrice(selectedProduct.price)}</strong><p className={styles.description}>{selectedProduct.description}</p><div className={styles.deliveryRow}><span className={selectedProduct.status === 'В наличии' ? 'in-stock' : 'preorder'}>{selectedProduct.status}</span><span>{selectedProduct.delivery}</span></div><h3>Выберите размер</h3><div className={styles.sizes}>{selectedProduct.sizes.map((size) => <button className={selectedSize === size ? styles.sizeActive : ''} onClick={() => setSelectedSize(size)} key={size} type="button">{size}</button>)}</div><button className="primary-button" onClick={addToCart} type="button">Добавить в корзину <ShoppingBag size={18} /></button></div>
          </section>
        </div>
      )}

      {showOrder && (
        <div className={styles.overlay} onClick={() => setShowOrder(false)}>
          <section className={styles.orderModal} onClick={(event) => event.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowOrder(false)} type="button"><X size={20} /></button>
            <span className="section-kicker">ORDER REQUEST</span><h2>Заявка почти готова</h2><p>Отправьте состав заказа менеджеру INNER. Он уточнит наличие, доставку и итоговую сумму.</p><div className={styles.orderSummary}>{cart.map((item) => <div key={`${item.product.id}-${item.size}`}><span>{item.product.name} · {item.size} × {item.quantity}</span><strong>{formatPrice(item.product.price * item.quantity)}</strong></div>)}</div><a className={styles.telegramButton} href="https://t.me/lutoway" target="_blank" rel="noreferrer">Отправить в Telegram <ArrowRight size={18} /></a>
          </section>
        </div>
      )}
    </main>
  )
}
