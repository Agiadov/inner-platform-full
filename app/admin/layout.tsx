"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut,
  Bell
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const sidebarLinks = [
  { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { name: "Настройки", href: "/admin", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-card rounded-xl flex items-center justify-center">
              <span className="text-foreground font-bold text-xs">IN</span>
            </div>
            <span className="text-lg font-semibold text-primary-foreground">INNER Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2.5 h-20 px-6 border-b border-primary-foreground/10">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-card rounded-xl flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">IN</span>
              </div>
              <span className="text-xl font-semibold text-primary-foreground">INNER</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-card/10 text-primary-foreground font-medium"
                      : "text-primary-foreground/60 hover:bg-card/5 hover:text-primary-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-primary-foreground/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-foreground truncate">Админ</p>
                <p className="text-xs text-primary-foreground/50 truncate">admin@inner.ru</p>
              </div>
              <button className="p-1.5 text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        {/* Top Bar */}
        <div className="hidden lg:flex items-center justify-between h-20 px-8 bg-card border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">
            {sidebarLinks.find(link => link.href === pathname)?.name || "Админ-панель"}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              На сайт
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
