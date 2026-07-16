import { BadgeRussianRuble } from 'lucide-react'
import { AdminSectionPage } from '../_components/section-page'

export default function PricingPage() {
  return <AdminSectionPage title="Ценообразование" description="Раздел для наценок, доставки и итоговой цены для клиента." icon={BadgeRussianRuble} actions={[{ label: 'Редактировать товары', href: '/admin/products', description: 'Изменить текущие цены каталога.' }, { label: 'Открыть магазин', href: '/', description: 'Проверить итоговые цены глазами клиента.' }]} />
}
