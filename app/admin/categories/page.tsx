import { Tags } from 'lucide-react'
import { AdminSectionPage } from '../_components/section-page'

export default function CategoriesPage() {
  return <AdminSectionPage title="Категории" description="Управление разделами каталога INNER и переходами между ними." icon={Tags} actions={[{ label: 'Открыть товары', href: '/admin/products', description: 'Добавить позиции и назначить им нужную категорию.' }, { label: 'Открыть магазин', href: '/', description: 'Проверить, как категории выглядят для клиента.' }]} />
}
