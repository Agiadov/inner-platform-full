export type ProductStatus = 'В наличии' | 'Под заказ'

export type CatalogProduct = {
  id: number
  name: string
  category: 'Кроссовки' | 'Одежда' | 'Аксессуары' | 'Техника'
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
    sizes: ['37', '38', '39',