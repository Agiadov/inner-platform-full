import type { Metadata } from 'next'
import { AISupportButton } from '@/components/inner/ai-support-button'
import './globals.css'


export const metadata: Metadata = {
  title: 'INNER — поиск вещей по фото',
  description: 'Персональный шопинг-сервис. Фото, ссылка или описание превращаются в понятный заказ.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <AISupportButton />
      </body>
    </html>
  )
}
