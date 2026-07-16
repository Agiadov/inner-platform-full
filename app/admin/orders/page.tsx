import { ShoppingBag } from 'lucide-react'
import { AdminSectionPage } from '../_components/section-page'

export default function OrdersPage() {
  return <AdminSectionPage title="Заказы" description="Отдельный раздел для подтверждённых заказов, оплаты и доставки." icon={ShoppingBag} actions={[{ label: 'Перейти к заявкам', href: '/admin', description: 'Посмотреть новые обращения клиентов и перевести их в заказ.' }, { label: 'Открыть товары', href: '/admin/products', description: 'Проверить каталог, цены и наличие.' }]} />
}
