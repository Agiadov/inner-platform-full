"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Boxes,
  Calculator,
  ExternalLink,
  LayoutDashboard,
  ListOrdered,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react"

const sidebarLinks = [
  { name: "Главная", href: "/admin", icon: LayoutDashboard },
  { name: "Товары", href: "/admin/products", icon: Package },
  { name: "Заявки", href: "/admin/requests", icon: ShoppingBag },
  { name: "Заказы", href: "/admin/orders", icon: ListOrdered },
  { name: "Категории", href: "/admin/categories", icon: Boxes },
  { name: "Ценообразование", href: "/admin/pricing", icon: Calculator },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
]

function isCurrentPath(pathname: string, href: string) {
  if (href === "/admin") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const currentPage = sidebarLinks.find((link) => isCurrentPath(pathname, link.href))

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#080d14]/95 backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white via-slate-300 to-slate-500 flex items-center justify-center shadow-lg">
              <span className="text-[#03060b] font-black text-xs">IN</span>
            </div>
            <div>
              <span className="block text-sm font-black tracking-[.16em] text-foreground">INNER</span>
              <span className="block text-[10px] text-muted-foreground">CONTROL CENTER</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen((value) => !value)} className="p-2 rounded-xl border border-border bg-card text-foreground" aria-label="Открыть меню">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-[#080d14]/98 backdrop-blur-xl transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="hidden lg:flex items-center h-20 px-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white via-slate-300 to-slate-500 flex items-center justify-center shadow-lg">
                <span className="text-[#03060b] font-black text-sm">IN</span>
              </div>
              <div>
                <span className="block text-lg font-black tracking-[.18em] text-foreground">INNER</span>
                <span className="block text-[10px] text-muted-foreground tracking-[.12em]">CONTROL CENTER</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = isCurrentPath(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-white/[.08] text-white font-semibold shadow-[inset_0_0_0_1px_rgba(201,211,223,.10)]"
                      : "text-muted-foreground hover:bg-white/[.04] hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center justify-center gap-2 min-h-11 rounded-xl border border-border bg-white/[.035] text-sm text-foreground hover:bg-white/[.07] transition-colors">
              <ExternalLink className="w-4 h-4" /> Открыть магазин
            </Link>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-full bg-white/[.07] flex items-center justify-center text-sm font-semibold">A</div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Администратор</p>
                <p className="text-xs text-muted-foreground">INNER</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Закрыть меню" />}

      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="hidden lg:flex items-center justify-between h-20 px-8 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-20">
          <div>
            <p className="text-[10px] font-bold tracking-[.14em] text-muted-foreground">INNER ADMIN</p>
            <h1 className="text-xl font-semibold text-foreground">{currentPage?.name || "Админ-панель"}</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 min-h-10 px-4 rounded-xl border border-border bg-white/[.035] text-sm text-foreground hover:bg-white/[.07] transition-colors">
            Магазин <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
        {children}
      </main>
    </div>
  )
}