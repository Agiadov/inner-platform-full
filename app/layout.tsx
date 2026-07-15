import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'INNER — оригинальные товары без сложностей',
  description:
    'Telegram Mini App для покупки оригинальных кроссовок, одежды, аксессуаров и техники из-за рубежа.',
  applicationName: 'INNER',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'INNER',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#03060B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
