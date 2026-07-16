import { Settings } from 'lucide-react'
import { AdminSectionPage } from '../_components/section-page'

export default function SettingsPage() {
  return <AdminSectionPage title="Настройки" description="Подключения магазина, Telegram, Supabase и параметры админки." icon={Settings} actions={[{ label: 'Проверить товары', href: '/admin/products', description: 'Убедиться, что облачная база подключена.' }, { label: 'Открыть магазин', href: '/', description: 'Проверить клиентскую часть после изменений.' }]} />
}
