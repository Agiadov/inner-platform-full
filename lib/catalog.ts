export type ProductStatus = 'В наличии' | 'Под заказ'
export type ProductCategory = 'Кроссовки' | 'Одежда' | 'Аксессуары' | 'Техника'

export type CatalogProduct = {
  id: number
  name: string
  category: ProductCategory
  color: string
  price: number
  status: ProductStatus
  delivery: string
  image: string
  sizes: string[]
  description: string
}

export const seedProducts: CatalogProduct[] = [
  {
    id: 1,
    name: 'New Balance 530',
    category: 'Кроссовки',
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
    category: 'Кроссовки',
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
    category: 'Кроссовки',
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
    category: 'Кроссовки',
    color: 'Core Black',
    price: 10500,
    status: 'В наличии',
    delivery: '1–3 дня',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=88',
    sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
    description: 'Замшевый силуэт с объёмными шнурками и массивной подошвой в стиле 2000-х.',
  },
]
